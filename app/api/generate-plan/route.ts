import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check the API key is present
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const { stress, hours, confidence, userName } = await req.json();

    if (!stress || !hours || !confidence) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const studentName = userName || "Student";

    const prompt = `You are a deeply empathetic AI tutor for "LEARNLY StudyLab", specifically designed to help students manage academic pressure while accelerating their learning. 
A student named ${studentName} has requested a study plan. 
Their current state:
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

Generate a highly personalized, Markdown-formatted study schedule that includes:
1. **Mental State Acknowledgment**: A short, highly empathetic 2-sentence greeting acknowledging their exact stress and confidence levels. 
2. **Strategic Focus**: Based directly on their confidence (${confidence}%), give 1 short paragraph of advice on *how* they should study right now.
3. **Structured Time Blocks**: A mathematically divided schedule for the next ${hours} hours. Use Pomodoro or Deep Work blocks.
4. **Wellness Checkpoints**: Tell them to take specific breaks. If stress > 60%, mandate relaxation exercises.

Keep the output clean, highly actionable, structured with markdown headings and bold text, and encouraging.`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: prompt,
    });

    return NextResponse.json({ plan: text });
  } catch (error: any) {
    // Surface the EXACT error for debugging
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: `AI error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
