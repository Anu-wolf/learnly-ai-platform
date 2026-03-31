import { NextResponse } from "next/server";
import { generateWithFallback } from "@/utils/modelManager";

export const dynamic = "force-dynamic";

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

    const prompt = `You are a fun, highly engaging, and feminine AI tutor for "LEARNLY StudyLab".
A student named ${studentName} needs a personalized study plan.
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

CRITICAL FORMATTING RULES:
1. **NO HTML**: Do NOT use <br> or any other HTML tags.
2. **SPACING**: Use EXACTLY two newlines (a full empty line) between every paragraph and bullet point for a "spaced-out" look.
3. **EMOJIS**: Use 1-2 emojis per section to keep it fun (✨, 🚀, 💡).

CONTENT STRUCTURE:
- **Your Game Plan ✨**: An upbeat, persuasive paragraph on why they will crush this session.
- **The Flow 🌊**: Step-by-step Pomodoro/Deep Work schedule. Space each block out clearly with empty lines.
- **Wellness Check ✅**: One fun relaxation tip.

Stay high-energy, persuasive, and strictly use Markdown only!`;

    const plan = await generateWithFallback(prompt, apiKey);
    return NextResponse.json({ plan });

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}
