/**
 * AI Model Manager
 * Dynamically discovers, validates, and selects available Gemini models.
 * Uses in-memory caching and automatic fallback logic.
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com";

// Priority order: preferred models first
const MODEL_PRIORITY = [
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
];

// Cache to avoid repeated ListModels API calls
let cachedModels: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface GeminiModel {
  name: string; // e.g. "models/gemini-1.5-pro"
  supportedGenerationMethods?: string[];
}

/**
 * Fetches the list of models available for this API key from v1beta.
 * Falls back to returning the MODEL_PRIORITY list if the fetch fails.
 */
async function fetchAvailableModels(apiKey: string): Promise<string[]> {
  const now = Date.now();

  // Return cached list if still fresh
  if (cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
    console.log("[ModelManager] Using cached model list.");
    return cachedModels;
  }

  try {
    const res = await fetch(
      `${GEMINI_BASE}/v1beta/models?key=${apiKey}&pageSize=50`
    );

    if (!res.ok) {
      console.warn(`[ModelManager] ListModels failed (${res.status}) — using priority fallback list.`);
      return MODEL_PRIORITY;
    }

    const data = await res.json();
    const models: GeminiModel[] = data.models || [];

    // Only keep models that support generateContent
    const available = models
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace("models/", ""));

    console.log("[ModelManager] Available models:", available);

    cachedModels = available;
    cacheTimestamp = now;
    return available;
  } catch (err) {
    console.warn("[ModelManager] Network error fetching models — using priority fallback list.", err);
    return MODEL_PRIORITY;
  }
}

/**
 * Selects the highest-priority model from the available models list.
 * Throws if none of the priority models are available.
 */
export function getAvailableModel(availableModels: string[]): string {
  for (const preferred of MODEL_PRIORITY) {
    // Match by exact name or prefix (e.g. "gemini-1.5-flash" matches "gemini-1.5-flash-002")
    const match = availableModels.find(
      (m) => m === preferred || m.startsWith(preferred)
    );
    if (match) {
      console.log(`[ModelManager] Selected model: ${match}`);
      return match;
    }
  }
  throw new Error(
    `No priority models available. Available: [${availableModels.join(", ")}]`
  );
}

/**
 * Tries to generate content using available Gemini models in priority order.
 * Automatically falls back to the next model on failure.
 * Returns the generated text.
 */
export async function generateWithFallback(
  prompt: string,
  apiKey: string
): Promise<string> {
  const availableModels = await fetchAvailableModels(apiKey);

  // Build an ordered list of models to try, prioritised
  const orderedModels: string[] = [];

  for (const preferred of MODEL_PRIORITY) {
    const match = availableModels.find(
      (m) => m === preferred || m.startsWith(preferred)
    );
    if (match && !orderedModels.includes(match)) {
      orderedModels.push(match);
    }
  }

  // Append any remaining available models not in priority list as last-resort
  for (const m of availableModels) {
    if (!orderedModels.includes(m)) {
      orderedModels.push(m);
    }
  }

  if (orderedModels.length === 0) {
    throw new Error("No available Gemini models found for this API key.");
  }

  const errors: string[] = [];

  for (const model of orderedModels) {
    try {
      console.log(`[ModelManager] Trying model: ${model}`);

      const res = await fetch(
        `${GEMINI_BASE}/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[ModelManager] Model ${model} failed (${res.status}):`, errText.substring(0, 120));
        errors.push(`${model} [${res.status}]`);

        // Invalidate cache if model not found so next call re-fetches
        if (res.status === 404) {
          cachedModels = null;
        }
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        errors.push(`${model} [empty response]`);
        continue;
      }

      console.log(`[ModelManager] ✅ Success with model: ${model}`);
      return text;
    } catch (err: any) {
      console.warn(`[ModelManager] Network error with model ${model}:`, err.message);
      errors.push(`${model} [network error: ${err.message}]`);
    }
  }

  throw new Error(`All Gemini models failed.\nDetails:\n${errors.join("\n")}`);
}
