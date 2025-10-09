import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { documentId, numCards = 10 } = await req.json();

    // 🔹 Busca o documento
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      return NextResponse.json(
        { error: "Document not found or not processed" },
        { status: 404 }
      );
    }

    // 🔹 Limita número de flashcards
    const safeNum = Math.max(5, Math.min(numCards, 30));

    // 🔹 Prompt inteligente (detecta e gera no idioma original)
    const prompt = `
Analise o texto abaixo, detecte automaticamente o idioma principal e crie exatamente ${safeNum} flashcards educativos **no mesmo idioma do texto**.

Cada flashcard deve conter:
- "front": uma pergunta ou termo principal (no idioma detectado)
- "back": a resposta curta e correta (no idioma detectado)
- "explain": uma explicação simples de 1 a 2 frases (no idioma detectado)

Responda em JSON puro, sem Markdown, no formato:

{
  "language": "idioma detectado (ex: Português, English, Español, etc.)",
  "topic": "Tema principal do conteúdo",
  "cards": [
    {
      "front": "Pergunta ou termo",
      "back": "Resposta curta",
      "explain": "Explicação curta (opcional)"
    }
  ]
}

Texto do documento:
${document.content.slice(0, 5000)}
`;

    // 🔹 Chamada à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Você é um criador de flashcards multilíngue. Sempre detecta automaticamente o idioma do texto e responde exclusivamente nesse idioma.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed: {
      language: string;
      topic: string;
      cards: { front: string; back: string; explain?: string | null }[];
    };

    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("❌ JSON inválido da OpenAI:", raw);
      return NextResponse.json(
        { error: "Invalid JSON returned by OpenAI", raw },
        { status: 500 }
      );
    }

    // 🔹 Salva no banco
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        topic: parsed.topic || document.subject || "Flashcards",
        document: { connect: { id: document.id } },
        user: { connect: { id: document.userId } },
        cards: {
          create: parsed.cards.map((c) => ({
            front: c.front,
            back: c.back,
            explain: c.explain || null,
            user: { connect: { id: document.userId } },
          })),
        },
      },
      include: { cards: true },
    });




    return NextResponse.json({
      message: "✅ Flashcards criados com sucesso",
      flashcardSet,
    });
  } catch (err) {
    console.error("❌ Flashcard generation failed:", err);
    return NextResponse.json(
      { error: "Flashcard generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
