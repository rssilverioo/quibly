import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth Firebase
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    // 📂 Pega arquivo enviado
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Converte para buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Nome único no S3
    const key = `${decoded.uid}/${Date.now()}-${file.name}`;
    const fileUrl = await uploadToS3(buffer, key, file.type);

    // 🔗 Vincula no Prisma
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(document);
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
