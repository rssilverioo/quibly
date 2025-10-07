import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { documentId, numCards = 10 } = await req.json();

    // 🔹 Busca documento e valida
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      return NextResponse.json(
        { error: "Document not found or not processed" },
        { status: 404 }
      );
    }

    // 🔹 Define número de flashcards (mínimo 5, máximo 30)
    let safeNum = Math.max(5, Math.min(numCards, 30));

    // 🔹 Prompt para gerar flashcards
    const prompt = `
Detecte automaticamente o idioma do texto e crie exatamente ${safeNum} flashcards educativos nesse idioma.
Cada flashcard deve ter:
- "front": uma pergunta ou conceito principal.
- "back": a resposta curta e direta.
- "explain": uma explicação simples de 1 a 2 frases.

Responda em JSON no formato:

{
  "topic": "Tema principal do conteúdo",
  "cards": [
    {
      "front": "Pergunta ou termo",
      "back": "Resposta ou definição",
      "explain": "Explicação curta (opcional)"
    }
  ]
}

Conteúdo:
${document.content}
`;

    // 🔹 Chamada ao OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um criador de flashcards multilíngues e educativos." },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("❌ JSON inválido da OpenAI:", raw);
      return NextResponse.json(
        { error: "Invalid JSON returned by OpenAI", raw },
        { status: 500 }
      );
    }

    // 🔹 Cria o FlashcardSet com relação direta (igual ao quiz)
  // 🔹 Cria o FlashcardSet e os Flashcards
const flashcardSet = await prisma.flashcardSet.create({
  data: {
    topic: parsed.topic || document.subject || "Flashcards",
    document: { connect: { id: document.id } }, // 🔗 conecta o documento existente
    user: { connect: { id: document.userId } }, // 🔗 conecta o usuário existente
    cards: {
      create: parsed.cards.map((c: any) => ({
        front: c.front,
        back: c.back,
        explain: c.explain || null,
        user: { connect: { id: document.userId } }, // ✅ garante o dono em cada card
      })),
    },
  },
  include: { cards: true },
});

    console.log(
      `✅ Flashcards criados: ${flashcardSet.cards.length} cards para o tema "${flashcardSet.topic}"`
    );

    return NextResponse.json({ flashcardSet });
  } catch (err) {
    console.error("❌ Flashcard generation failed:", err);
    return NextResponse.json(
      { error: "Flashcard generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
