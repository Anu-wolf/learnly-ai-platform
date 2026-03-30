import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured in Vercel environment variables." },
        { status: 500 }
      );
    }

    const { stress, hours, confidence, userName } = await req.json();
    const studentName = userName || "Student";

    const prompt = `You are a deeply empathetic AI tutor for "LEARNLY StudyLab", designed to help students manage academic pressure while accelerating learning.
A student named ${studentName} has requested a personalized study plan.
Their current state:
- Stress Level: ${stress}%
- Confidence Level: ${confidence}%
- Available Study Time: ${hours} hours

Generate a Markdown-formatted study schedule with:
1. **Mental State Acknowledgment**: A warm, empathetic 2-sentence greeting based on their stress (${stress}%) and confidence (${confidence}%) levels.
2. **Study Strategy**: One paragraph of advice on how they should study right now based on their confidence level.
3. **Time Blocks**: A schedule divided into Pomodoro or Deep Work blocks for ${hours} hours.
4. **Wellness Checkpoints**: Specific break reminders. If stress > 60%, mandate a relaxation exercise (Deep Breathing, Guided Meditation).

Keep it clean, actionable, structured with markdown headings and bold text, and encouraging.`;

    // Use the stable v1 endpoint directly — NOT v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "No content returned from AI." }, { status: 500 });
    }

    return NextResponse.json({ plan: text });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: `Server error: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
