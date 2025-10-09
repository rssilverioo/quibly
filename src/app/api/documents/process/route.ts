import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { fal } from "@fal-ai/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔹 Configura Fal.ai SDK
fal.config({
  credentials: process.env.FAL_API_KEY!,
});

// 🔹 Função auxiliar para gerar imagens com Fal.ai
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

    // 🔹 Busca documento
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      return NextResponse.json(
        { error: "Document not found or not processed" },
        { status: 404 }
      );
    }

    // 🔹 Limita entre 5 e 20 perguntas
    let safeNum = Math.max(5, Math.min(numQuestions, 20));
    safeNum = Math.ceil(safeNum / 5) * 5;

    // 🔹 Prompt multilíngue aprimorado
    const prompt = `
Analise o texto abaixo e **detecte automaticamente o idioma principal**.
Com base nesse idioma, gere exatamente ${safeNum} perguntas de múltipla escolha **nesse mesmo idioma**.

Regras:
- 70% das perguntas devem ser de texto ("kind": "TEXT")
- 30% devem ser perguntas visuais ("kind": "IMAGE")

Para perguntas de imagem:
- "correctPrompt" descreve a imagem correta com detalhes.
- "wrongPrompts" contém 3 descrições incorretas, porém semelhantes.

Responda 100% em JSON puro (sem Markdown) no formato:

{
  "language": "idioma detectado (ex: Português, English, Español, etc.)",
  "topic": "Título principal do quiz",
  "questions": [
    {
      "kind": "TEXT" | "IMAGE",
      "prompt": "Pergunta no idioma detectado",
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

Conteúdo do documento:
${document.content.slice(0, 5000)}
`;

    // 🔹 Chamada OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Você é um criador de quizzes multilíngues. Sempre detecta automaticamente o idioma do texto e responde exclusivamente nesse idioma.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed: {
      language: string;
      topic: string;
      questions: any[];
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

    // 🔹 Gera imagens Fal.ai para perguntas tipo IMAGE
    const processedQuestions = await Promise.all(
      parsed.questions.map(async (q) => {
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

    // 🔹 Cria o quiz no banco
    const quiz = await prisma.quiz.create({
      data: {
        topic: parsed.topic || document.subject || "Quiz",
        document: { connect: { id: document.id } },
        user: { connect: { id: document.userId } },
        questions: {
          create: processedQuestions.map((q) => ({
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
    console.error("❌ Quiz generation failed:", err);
    return NextResponse.json(
      { error: "Quiz generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
