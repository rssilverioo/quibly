import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { fal } from "@fal-ai/client";

// 🔹 Configura Fal.ai SDK
fal.config({
  credentials: process.env.FAL_API_KEY!,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFalImage(prompt: string) {
  const result = await fal.subscribe("fal-ai/flux-pro", {
    input: {
      prompt,
      size: "512x512",
      num_images: 1,
    },
  });

  // O SDK retorna { data: { images: [{ url: "..." }] } }
  return result.data?.images?.[0]?.url || null;
}


export async function POST(req: NextRequest) {
  try {
    const { documentId, numQuestions = 10 } = await req.json();

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

    // 🔹 Prompt para OpenAI (gera perguntas e prompts para imagens)
    const prompt = `
Detecte automaticamente o idioma do conteúdo e crie exatamente ${safeNum} perguntas de múltipla escolha nesse idioma.
70% devem ser perguntas de texto ("kind": "TEXT") e 30% perguntas de imagem ("kind": "IMAGE").

Para as perguntas de imagem:
- Elas devem representar conceitos, objetos, animais, órgãos, gráficos, mapas, diagramas ou cenas visuais que possam ser ilustrados realisticamente.
- Crie um campo "correctPrompt" descrevendo a imagem correta com riqueza de detalhes.
- Crie também um array "wrongPrompts" com 3 descrições semelhantes, mas incorretas e visualmente relacionadas ao mesmo tema (ex: se a correta é "microscopia de célula vegetal", uma incorreta pode ser "microscopia de célula animal").
- As imagens incorretas devem parecer plausíveis, mas conter erro conceitual.

Responda 100% em JSON no formato:
{
  "topic": "Título do quiz no mesmo idioma",
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
        { role: "system", content: "Você é um criador de quizzes multilíngues e multimodais (texto + imagem)." },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.error("Invalid JSON:", raw);
      return NextResponse.json(
        { error: "OpenAI did not return valid JSON", raw },
        { status: 500 }
      );
    }

    // 🔹 Processa perguntas IMAGE → gera imagens na Fal.ai
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
            answer: "Imagem correta", // opcional
          };
        }
        return q; // pergunta TEXT normal
      })
    );

    // 🔹 Salva no banco
    const quiz = await prisma.quiz.create({
      data: {
        topic: parsed.topic || document.subject || "Quiz",
        documentId: document.id,
        userId: document.userId,
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

    return NextResponse.json({ quiz });
  } catch (err) {
    console.error("Quiz generation failed:", err);
    return NextResponse.json(
      { error: "Quiz generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
