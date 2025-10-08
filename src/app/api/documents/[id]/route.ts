import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// ============================
// 🔹 GET /api/documents/:id
// ============================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ precisa ser Promise no Next 15
) {
  const { id } = await params;

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
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        quizzes: { include: { questions: { include: { options: true } } } },
        sets: { include: { cards: true }, orderBy: { createdAt: "desc" } },
      },
    });

    if (!document)
      return NextResponse.json({ error: "Document not found" }, { status: 404 });

    if (document.userId !== user.id)
      return NextResponse.json(
        { error: "Forbidden: you don't own this document" },
        { status: 403 }
      );

    return NextResponse.json({
      ...document,
      quizzesCount: document.quizzes.length,
      flashcardSetsCount: document.sets.length,
    });
  } catch (err) {
    console.error("❌ Fetch document failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch document", details: String(err) },
      { status: 500 }
    );
  }
}

// ============================
// 🔹 DELETE /api/documents/:id
// ============================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ✅ idem aqui
) {
  const { id } = await params;

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
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const document = await prisma.document.findUnique({ where: { id } });
    if (!document)
      return NextResponse.json({ error: "Document not found" }, { status: 404 });

    if (document.userId !== user.id)
      return NextResponse.json(
        { error: "Forbidden: you don't own this document" },
        { status: 403 }
      );

    // 🧹 Deleta relacionamentos
    await prisma.flashcardSet.deleteMany({ where: { documentId: id } });
    await prisma.quiz.deleteMany({ where: { documentId: id } });

    // 🗑️ Deleta o documento no banco
    await prisma.document.delete({ where: { id } });

    // ☁️ Remove da S3 se existir
    if (document.fileUrl?.includes("s3")) {
      try {
        const keyMatch = document.fileUrl.match(/amazonaws\.com\/(.+)$/);
        const key = keyMatch ? keyMatch[1] : null;

        if (key) {
          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
          });
          await s3.send(command);
          console.log(`🗑️ Arquivo removido da S3: ${key}`);
        }
      } catch (err) {
        console.warn("⚠️ Falha ao remover arquivo da S3:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("❌ Document deletion failed:", err);
    return NextResponse.json(
      { error: "Failed to delete document", details: String(err) },
      { status: 500 }
    );
  }
}
