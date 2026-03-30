import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Model candidates to try in order - covers all Gemini API versions
const MODEL_CANDIDATES = [
  { version: "v1beta", model: "gemini-2.0-flash" },
  { version: "v1beta", model: "gemini-2.0-flash-exp" },
  { version: "v1beta", model: "gemini-1.5-flash-latest" },
  { version: "v1beta", model: "gemini-1.5-pro-latest" },
  { version: "v1", model: "gemini-1.5-flash-001" },
  { version: "v1", model: "gemini-1.5-pro-001" },
];

async function callGemini(apiKey: string, model: string, version: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    }),
  });
  return response;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set in Vercel environment variables." },
        { status: 500 }
      );
    }

    const { stress, hours, confidence, userName } = await req.json();
    const studentName = userName || "Student";

    const prompt = `You are a deeply empathetic AI tutor for "LEARNLY StudyLab".
A student named ${studentName} needs a personalized study plan.
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

Generate a Markdown-formatted plan with:
1. **Mental State Acknowledgment**: 2 empathetic sentences based on their stress and confidence.
2. **Study Strategy**: One paragraph of actionable advice based on their confidence level.
3. **Time Blocks**: Pomodoro or Deep Work blocks for ${hours} hours.
4. **Wellness**: Specific break reminders. If stress > 60%, mandate a relaxation exercise.

Keep it structured, warm, and encouraging.`;

    // Try each model in order until one works
    let lastError = "";
    for (const { version, model } of MODEL_CANDIDATES) {
      try {
        const response = await callGemini(apiKey, model, version, prompt);
        
        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`Success with model: ${model} (${version})`);
            return NextResponse.json({ plan: text });
          }
        } else {
          const err = await response.text();
          lastError = `${model}: ${err}`;
          console.warn(`Model ${model} failed:`, err.substring(0, 100));
        }
      } catch (e: any) {
        lastError = e.message;
        console.warn(`Model ${model} threw error:`, e.message);
      }
    }

    // All models failed
    return NextResponse.json(
      { error: `All Gemini models failed. Last error: ${lastError}` },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: `Server error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
