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

    const { documentId } = await req.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      return NextResponse.json(
        { error: "Document not found or not processed" },
        { status: 404 }
      );
    }

    // Check usage limit
    const usage = await checkUsageLimit(user.id, user.plan, "quizzes");
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Daily limit reached", used: usage.used, limit: usage.limit },
        { status: 429 }
      );
    }

    const contentPreview = document.content.slice(0, 8000);

    const prompt = `You are a quiz generator. Your job is to create a quiz STRICTLY based on the document content provided below. Do NOT invent or add any information that is not in the document.

Detect the language of the document and generate 7-20 multiple-choice questions in that same language.

Rules:
- Every question MUST be answerable using only information from the document below
- Each question must have exactly 4 options
- Only one option should be correct
- Vary difficulty levels (easy, medium, hard)
- Do NOT create generic or unrelated questions
- For about 30-50% of questions, add an "imageQuery" field with a short English search query (2-4 words) for a relevant illustration. Only add imageQuery when a visual would help understanding.

IMPORTANT: All questions and answers must come directly from the document content. Do not generate questions about topics not covered in the document.

Respond in pure JSON in this exact format:

{
  "language": "detected language",
  "topic": "Main topic of the document",
  "questions": [
    {
      "question": "Question based on the document",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "imageQuery": "optional image search query"
    }
  ]
}

--- DOCUMENT CONTENT START ---
${contentPreview}
--- DOCUMENT CONTENT END ---`;

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

    // Search images for questions that have imageQuery
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

    // Save quiz + questions
    const quiz = await prisma.quiz.create({
      data: {
        topic: parsed.topic || document.subject || "Quiz",
        language: parsed.language || null,
        document: { connect: { id: document.id } },
        user: { connect: { id: user.id } },
        questions: {
          create: questionsWithImages,
        },
      },
      include: { questions: true },
    });

    await incrementUsage(user.id, "quizzes");

    return NextResponse.json({ quiz });
  } catch (err) {
    console.error("Quiz generation failed:", err);
    return NextResponse.json(
      { error: "Quiz generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
