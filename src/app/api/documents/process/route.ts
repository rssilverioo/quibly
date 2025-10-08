import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { fal } from "@fal-ai/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔹 Configura Fal.ai SDK (mesmo do flashcard)
fal.config({
  credentials: process.env.FAL_API_KEY!,
});

// 🔹 Gera imagem Fal.ai
async function generateFalImage(prompt: string) {
  const result = await fal.subscribe("fal-ai/flux-pro", {
    input: {
      prompt,
      size: "512x512",
      num_images: 1,
    },
  });

  return result.data?.images?.[0]?.url || null;
}

export async function POST(req: NextRequest) {
  try {
    const { documentId, numQuestions = 10 } = await req.json();

    // 🔹 Busca documento no banco
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      return NextResponse.json(
        { error: "Document not found or not processed" },
        { status: 404 }
      );
    }

    // 🔹 Garante múltiplos de 5 entre 5 e 20
    let safeNum = Math.max(5, Math.min(numQuestions, 20));
    safeNum = Math.ceil(safeNum / 5) * 5;

    // 🔹 Prompt OpenAI
    const prompt = `
Detecte automaticamente o idioma do conteúdo e crie exatamente ${safeNum} perguntas de múltipla escolha nesse idioma.
70% devem ser perguntas de texto ("kind": "TEXT") e 30% perguntas de imagem ("kind": "IMAGE").

Para as perguntas de imagem:
- Elas devem representar conceitos, objetos, animais, órgãos, gráficos, mapas, diagramas ou cenas visuais.
- Crie um campo "correctPrompt" descrevendo a imagem correta com detalhes.
- Crie também um array "wrongPrompts" com 3 descrições incorretas, porém semelhantes.

Responda 100% em JSON no formato:
{
  "topic": "Título do quiz",
  "questions": [
    {
      "kind": "TEXT" | "IMAGE",
      "prompt": "Pergunta",
      "answer": "Resposta correta",
      "options": [
        { "key": "A", "text": "...", "isCorrect": false },
        { "key": "B", "text": "...", "isCorrect": true }
      ],
      "correctPrompt": "somente se for IMAGE",
      "wrongPrompts": ["...", "...", "..."]
    }
  ]
}

Conteúdo:
${document.content}
`;

    // 🔹 Chamada à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um criador de quizzes multilíngues e multimodais (texto + imagem).",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("❌ JSON inválido:", raw);
      return NextResponse.json(
        { error: "Invalid JSON returned by OpenAI", raw },
        { status: 500 }
      );
    }

    // 🔹 Processa perguntas IMAGE → Fal.ai
    const processedQuestions = await Promise.all(
      parsed.questions.map(async (q: any) => {
        if (q.kind === "IMAGE" && q.correctPrompt) {
          const correctUrl = await generateFalImage(q.correctPrompt);
          const wrongUrls = await Promise.all(
            (q.wrongPrompts || []).map((p: string) => generateFalImage(p))
          );

          const options = [
            { key: "A", text: correctUrl, isCorrect: true },
            ...wrongUrls.map((url, i) => ({
              key: String.fromCharCode(66 + i),
              text: url,
              isCorrect: false,
            })),
          ].sort(() => Math.random() - 0.5);

          return {
            ...q,
            options,
            answer: "Imagem correta",
          };
        }
        return q;
      })
    );

    // 🔹 Cria quiz no mesmo formato do flashcardSet
    const quiz = await prisma.quiz.create({
      data: {
        topic: parsed.topic || document.subject || "Quiz",
        document: { connect: { id: document.id } }, // 🔗 conecta documento
        user: { connect: { id: document.userId } }, // 🔗 conecta usuário dono do documento
        questions: {
          create: processedQuestions.map((q: any) => ({
            kind: q.kind || "TEXT",
            prompt: q.prompt,
            answer: q.answer,
            explain: q.explain || null,
            options: {
              create: q.options.map((o: any) => ({
                key: o.key,
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    });

    console.log(`✅ Quiz criado: ${quiz.topic} (${quiz.questions.length} perguntas)`);

    return NextResponse.json({ quiz });
  } catch (err) {
    console.error("❌ Quiz generation failed:", err);
    return NextResponse.json(
      { error: "Quiz generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
