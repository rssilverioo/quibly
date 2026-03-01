import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { downloadFromTigris } from "@/lib/tigris";
import { pdf as pdfParse } from "pdf-parse";
import { getGemini } from "@/lib/gemini";

export const dynamic = "force-dynamic";

/**
 * Fallback: use Gemini Vision to extract text from scanned/image-based PDFs.
 * Sends the raw PDF as inlineData and asks Gemini to read it.
 */
async function extractWithGeminiVision(pdfBuffer: Buffer): Promise<string> {
  const base64 = pdfBuffer.toString("base64");

  const result = await getGemini().generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Extract ALL text content from this PDF document. Return ONLY the raw text, preserving paragraphs and structure. Do not add any commentary, headers, or formatting — just the document text as-is.",
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
    },
  });

  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Extract key from Tigris URL
    const bucketName = process.env.S3_BUCKET!;
    const urlParts = document.fileUrl.split(`/${bucketName}/`);
    const key = urlParts.length > 1 ? urlParts[1] : document.fileUrl.split("/").slice(-2).join("/");

    const buffer = await downloadFromTigris(key);

    // Step 1: Try pdf-parse (fast, free — works for text-based PDFs)
    let text = "";
    let method = "pdf-parse";

    try {
      const result = await pdfParse(buffer);
      text = typeof result === "string" ? result : result.text;
    } catch (err) {
      console.warn("pdf-parse failed, will try Gemini Vision:", err);
    }

    // Step 2: If pdf-parse returned no/minimal text, fallback to Gemini Vision (OCR)
    if (!text || text.trim().length < 50) {
      console.log("pdf-parse extracted insufficient text, falling back to Gemini Vision OCR...");
      method = "gemini-vision";
      text = await extractWithGeminiVision(buffer);
    }

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF." },
        { status: 422 }
      );
    }

    await prisma.document.update({
      where: { id: document.id },
      data: { content: text },
    });

    return NextResponse.json({
      message: "PDF extracted successfully",
      method,
      documentId: document.id,
      length: text.length,
      preview: text.slice(0, 300) + "...",
    });
  } catch (err) {
    console.error("Extract error:", err);
    return NextResponse.json({ error: "Extract failed" }, { status: 500 });
  }
}
