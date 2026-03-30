import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured in Vercel environment variables." },
        { status: 500 }
      );
    }

    const { stress, hours, confidence, userName } = await req.json();

    if (stress === undefined || !hours || confidence === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const studentName = userName || "Student";

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a deeply empathetic AI tutor for "LEARNLY StudyLab", specifically designed to help students manage academic pressure while accelerating their learning.
A student named ${studentName} has requested a study plan.
Their current state:
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

Generate a highly personalized, Markdown-formatted study schedule that includes:
1. **Mental State Acknowledgment**: A short, highly empathetic 2-sentence greeting acknowledging their exact stress and confidence levels.
2. **Strategic Focus**: Based directly on their confidence (${confidence}%), give 1 short paragraph of advice on how they should study right now.
3. **Structured Time Blocks**: A mathematically divided schedule for the next ${hours} hours. Use Pomodoro or Deep Work blocks.
4. **Wellness Checkpoints**: Tell them to take specific breaks. If stress > 60%, mandate relaxation exercises like Deep Breathing or Guided Meditation.

Keep the output clean, highly actionable, structured with markdown headings and bold text, and encouraging.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ plan: text });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: `AI error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
