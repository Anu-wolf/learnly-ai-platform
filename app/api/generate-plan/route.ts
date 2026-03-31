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

INSTRUCTIONS:
1. Start with a VERY CONCISE greeting (max 2 sentences) acknowledging their stress and confidence.
2. Provide a detailed Markdown-formatted plan with:
   - **Study Strategy**: One paragraph of actionable advice.
   - **Time Blocks**: A step-by-step Pomodoro or Deep Work schedule for the full ${hours} hours.
   - **Wellness**: Specific break reminders and relaxation exercises (mandatory if stress > 60%).

Stay encouraging but prioritize the actual schedule content.`;

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
