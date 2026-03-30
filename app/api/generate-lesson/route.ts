import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { topic, performance, stress, weakAreas, strongAreas } = await req.json();

    const systemPrompt = `You are an AI Learning Orchestrator inside an advanced EdTech platform.
Your task is to generate a COMPLETE POST-ASSESSMENT LEARNING EXPERIENCE for a student.

----------------------------------------
🎯 CONTEXT
----------------------------------------
The student has just completed an assessment.
- Topic: ${topic}
- Performance Level: ${performance}
- Stress Level: ${stress}
- Weak Areas: ${weakAreas.join(", ")}
- Strong Areas: ${strongAreas.join(", ")}

----------------------------------------
⚙️ CORE OBJECTIVE
----------------------------------------
Generate a structured learning page that will be shown AFTER clicking "Start Lesson".
This page MUST:
1. Redirect user from assessment → lesson dashboard
2. Show personalized learning path
3. Provide HIGH-QUALITY curated resources
4. Maintain engaging + empathetic tone
5. Include gamified + interactive suggestions

----------------------------------------
🧠 OUTPUT STRUCTURE (STRICT FORMAT)
----------------------------------------
Return ONLY JSON with the following structure:
{
  "redirect": "/lesson/${topic.toLowerCase().replace(/\s+/g, '-')}",
  "lesson_dashboard": {
    "title": "string",
    "intro_message": "string",
    "motivation_line": "string"
  },
  "learning_path": [
    {
      "level": "Foundation | Intermediate | Advanced",
      "topics": ["string"],
      "estimated_time": "string"
    }
  ],
  "resources": {
    "courses": [{"title": "string", "platform": "string", "link": "string", "level": "string", "why_recommended": "string"}],
    "youtube_videos": [{"title": "string", "channel": "string", "link": "string", "duration": "string", "focus_area": "string"}],
    "interactive_tools": [{"name": "string", "type": "simulator | playground | notebook", "link": "string", "purpose": "string"}],
    "flashcards": [{"topic": "string", "cards": [{"q": "string", "a": "string"}]}],
    "practice_platforms": [{"name": "string", "link": "string", "difficulty": "string", "use_case": "string"}],
    "projects": [{"title": "string", "description": "string", "difficulty": "string", "tools_required": ["string"]}]
  },
  "gamification": {
    "mini_task": "string",
    "challenge": "string",
    "reward": "string"
  },
  "wellness_support": {
    "trigger_condition": "string",
    "activity": "string",
    "duration": "string"
  }
}

----------------------------------------
📚 CONTENT REQUIREMENTS
----------------------------------------
(Follow the specific topic requirements for Data Science, Algebra, or other subjects as provided in the instructions).

----------------------------------------
🌐 RESOURCE RULES
----------------------------------------
- Include AT LEAST: 5 courses, 8 YouTube videos, 3 interactive tools, 10 flashcards, 5 practice platforms, 3 mini projects.
----------------------------------------
💡 PERSONALIZATION LOGIC
----------------------------------------
IF performance = LOW: Focus on basics + slow pacing.
IF performance = MEDIUM: Balanced theory + practice.
IF performance = HIGH: Advanced + projects + challenges.
IF stress = HIGH: Add wellness activity + reduce load.
----------------------------------------
🎮 GAMIFICATION RULES
----------------------------------------
- Add 1 quick task, 1 challenge, 1 reward.
----------------------------------------
💬 TONE
----------------------------------------
- Friendly, mentor-like, encouraging.
----------------------------------------
⚠️ IMPORTANT
----------------------------------------
- DO NOT output explanations.
- ONLY return JSON.
- Keep it clean and structured.`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: systemPrompt,
    });

    // Attempt to parse JSON to ensure it's valid, but return as object
    const lessonsData = JSON.parse(text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, ""));

    return NextResponse.json(lessonsData);
  } catch (error) {
    console.error("Lesson Generation Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
