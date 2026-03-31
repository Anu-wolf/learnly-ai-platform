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

    const prompt = `You are a deeply empathetic AI tutor for "LEARNLY StudyLab".
A student named ${studentName} needs a personalized study plan.
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

Generate a Markdown-formatted plan with:
1. **Mental State Acknowledgment**: 2 empathetic sentences based on their stress (${stress}%) and confidence (${confidence}%).
2. **Study Strategy**: One paragraph of actionable advice based on their confidence level.
3. **Time Blocks**: Pomodoro or Deep Work schedule for ${hours} hours.
4. **Wellness**: Specific break reminders. If stress > 60%, include a recommended relaxation exercise.

Keep it structured, warm, and encouraging.`;

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
