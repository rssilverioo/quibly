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
    const usage = await checkUsageLimit(user.id, user.plan, "flashcards");
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Daily limit reached", used: usage.used, limit: usage.limit },
        { status: 429 }
      );
    }

    const contentPreview = document.content.slice(0, 8000);

    const prompt = `You are a study assistant. Your job is to create flashcards STRICTLY based on the document content provided below. Do NOT invent or add any information that is not in the document.

Detect the language of the document and create 10-15 flashcards in that same language.

Each flashcard must contain:
- "front": a question or key concept taken directly from the document
- "back": the correct answer, using only information from the document
- "explain": a brief 1-2 sentence explanation based on the document
- "imageQuery": a short English search query (2-4 words) for a relevant illustration

IMPORTANT: Every flashcard MUST be based on facts, concepts, or information explicitly present in the document below. Do not generate generic or unrelated content.

Respond in pure JSON in this exact format:

{
  "language": "detected language",
  "topic": "Main topic of the document",
  "cards": [
    {
      "front": "Question or term from the document",
      "back": "Answer from the document",
      "explain": "Explanation based on the document",
      "imageQuery": "image search query"
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

    // Search images for each card
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

    // Save flashcard set + cards
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        topic: parsed.topic || document.subject || "Flashcards",
        language: parsed.language || null,
        document: { connect: { id: document.id } },
        user: { connect: { id: user.id } },
        cards: {
          create: cardsWithImages,
        },
      },
      include: { cards: true },
    });

    await incrementUsage(user.id, "flashcards");

    return NextResponse.json({ flashcardSet });
  } catch (err) {
    console.error("Flashcard generation failed:", err);
    return NextResponse.json(
      { error: "Flashcard generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
