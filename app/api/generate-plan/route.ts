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

INSTRUCTIONS FOR FORMATTING & TONE:
1. **TONE**: Extremely upbeat, supportive, and uses emojis (✨, 🚀, 💡, 🌈, 🧘‍♀️).
2. **SPACING**: Use DOUBLE NEWLINES between every individual point and paragraph. Avoid dense blocks of text.
3. **GREETING**: Start with a warm, fun 2-sentence greeting.

CONTENT STRUCTURE:
- **Your Game Plan ✨**: A short, persuasive paragraph on why they will crush this session.
- **The Flow 🌊 (Time Blocks)**: Step-by-step Pomodoro/Deep Work schedule for ${hours} hours. Space each block out clearly.
- **Wellness Check ✅**: Mandatory fun relaxation tip since their stress is at ${stress}%.

Stay positive, spaced-out, and super engaging!`;

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
