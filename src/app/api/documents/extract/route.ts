import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    // 🔹 Busca documento no banco
    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // 🔹 Baixa PDF do S3
    const key = document.fileUrl.split(".amazonaws.com/")[1];
    const file = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      })
    );
    const buffer = Buffer.from(await file.Body!.transformToByteArray());

    // 🔹 Extrai texto com pdf2json
    const text = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err) => reject(err));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const rawText = pdfData.Pages.map((page: any) =>
          page.Texts.map((t: any) =>
            decodeURIComponent(t.R.map((r: any) => r.T).join(""))
          ).join(" ")
        ).join("\n\n");

        resolve(rawText);
      });

      pdfParser.parseBuffer(buffer);
    });

    // 🔹 Atualiza conteúdo do documento
    await prisma.document.update({
      where: { id: document.id },
      data: { content: text },
    });

    return NextResponse.json({
      message: "✅ PDF extraído e salvo com sucesso",
      documentId: document.id,
      length: text.length,
      preview: text.slice(0, 300) + "...", // mostra preview
    });
  } catch (err) {
    console.error("❌ Extract error:", err);
    return NextResponse.json({ error: "Extract failed" }, { status: 500 });
  }
}
