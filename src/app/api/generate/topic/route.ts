import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { getGemini } from "@/lib/gemini";
import { searchImage } from "@/lib/image-search";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { topic, type } = (await req.json()) as {
      topic?: string;
      type?: "flashcards" | "quiz";
    };

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
    if (type !== "flashcards" && type !== "quiz") {
      return NextResponse.json(
        { error: "Type must be 'flashcards' or 'quiz'" },
        { status: 400 }
      );
    }

    const usageType = type === "flashcards" ? "flashcards" : "quizzes";
    const usage = await checkUsageLimit(user.id, user.plan, usageType);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Daily limit reached", used: usage.used, limit: usage.limit },
        { status: 429 }
      );
    }

    if (type === "flashcards") {
      return await generateFlashcardsFromTopic(topic.trim(), user.id);
    } else {
      return await generateQuizFromTopic(topic.trim(), user.id);
    }
  } catch (err) {
    console.error("Topic generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed", details: String(err) },
      { status: 500 }
    );
  }
}

async function generateFlashcardsFromTopic(topic: string, userId: string) {
  const prompt = `You are a study assistant. Your job is to create flashcards about the topic provided by the user.

Detect the language of the topic and create 10-15 flashcards in that same language.

Each flashcard must contain:
- "front": a question or key concept about the topic
- "back": the correct answer
- "explain": a brief 1-2 sentence explanation
- "imageQuery": a short English search query (2-4 words) for a relevant illustration

Create educational, accurate flashcards that cover the most important aspects of this topic.

Respond in pure JSON in this exact format:

{
  "language": "detected language",
  "topic": "Topic title",
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer",
      "explain": "Explanation",
      "imageQuery": "image search query"
    }
  ]
}

--- TOPIC ---
${topic}`;

  const result = await getGemini().generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const raw = result.response.text();

  let parsed: {
    language: string;
    topic: string;
    cards: { front: string; back: string; explain?: string; imageQuery?: string }[];
  };

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("Invalid JSON from Gemini:", raw);
    return NextResponse.json(
      { error: "Invalid JSON returned by AI", raw },
      { status: 500 }
    );
  }

  const cardsWithImages = await Promise.all(
    parsed.cards.map(async (card) => {
      let imageUrl: string | null = null;
      if (card.imageQuery) {
        imageUrl = await searchImage(card.imageQuery);
      }
      return {
        front: card.front,
        back: card.back,
        explain: card.explain || null,
        imageQuery: card.imageQuery || null,
        imageUrl,
      };
    })
  );

  const flashcardSet = await prisma.flashcardSet.create({
    data: {
      topic: parsed.topic || topic,
      language: parsed.language || null,
      user: { connect: { id: userId } },
      cards: {
        create: cardsWithImages,
      },
    },
    include: { cards: true },
  });

  await incrementUsage(userId, "flashcards");

  return NextResponse.json({ flashcardSet });
}

async function generateQuizFromTopic(topic: string, userId: string) {
  const prompt = `You are a quiz generator. Your job is to create a quiz about the topic provided by the user.

Detect the language of the topic and generate 7-20 multiple-choice questions in that same language.

Rules:
- Each question must have exactly 4 options
- Only one option should be correct
- Vary difficulty levels (easy, medium, hard)
- Create educational, accurate questions that cover the most important aspects of this topic
- For about 30-50% of questions, add an "imageQuery" field with a short English search query (2-4 words) for a relevant illustration. Only add imageQuery when a visual would help understanding.

Respond in pure JSON in this exact format:

{
  "language": "detected language",
  "topic": "Topic title",
  "questions": [
    {
      "question": "Question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "imageQuery": "optional image search query"
    }
  ]
}

--- TOPIC ---
${topic}`;

  const result = await getGemini().generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const raw = result.response.text();

  let parsed: {
    language: string;
    topic: string;
    questions: { question: string; options: string[]; correctIndex: number; imageQuery?: string }[];
  };

  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("Invalid JSON from Gemini:", raw);
    return NextResponse.json(
      { error: "Invalid JSON returned by AI", raw },
      { status: 500 }
    );
  }

  const questionsWithImages = await Promise.all(
    parsed.questions.map(async (q) => {
      let imageUrl: string | null = null;
      if (q.imageQuery) {
        imageUrl = await searchImage(q.imageQuery);
      }
      return {
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        imageQuery: q.imageQuery || null,
        imageUrl,
      };
    })
  );

  const quiz = await prisma.quiz.create({
    data: {
      topic: parsed.topic || topic,
      language: parsed.language || null,
      user: { connect: { id: userId } },
      questions: {
        create: questionsWithImages,
      },
    },
    include: { questions: true },
  });

  await incrementUsage(userId, "quizzes");

  return NextResponse.json({ quiz });
}
