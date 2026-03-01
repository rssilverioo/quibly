import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { deleteFromTigris } from "@/lib/tigris";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        quizzes: { include: { questions: true } },
        flashcardSets: { include: { cards: true }, orderBy: { createdAt: "desc" } },
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
      flashcardSetsCount: document.flashcardSets.length,
    });
  } catch (err) {
    console.error("Fetch document failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch document", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Delete related flashcardSets and quizzes first (their children cascade via schema)
    await prisma.flashcardSet.deleteMany({ where: { documentId: id } });
    await prisma.quiz.deleteMany({ where: { documentId: id } });
    await prisma.document.delete({ where: { id } });

    // Remove from Tigris
    if (document.fileUrl) {
      try {
        const bucketName = process.env.S3_BUCKET!;
        const urlParts = document.fileUrl.split(`/${bucketName}/`);
        const key = urlParts.length > 1 ? urlParts[1] : null;

        if (key) {
          await deleteFromTigris(key);
        }
      } catch (err) {
        console.warn("Failed to remove file from Tigris:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("Document deletion failed:", err);
    return NextResponse.json(
      { error: "Failed to delete document", details: String(err) },
      { status: 500 }
    );
  }
}
