import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    console.log("🔑 AUTH HEADER RECEBIDO:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Invalid header" }, { status: 400 });
    }

    const token = authHeader.split(" ")[1];
    console.log("🟢 TOKEN EXTRAÍDO:", token.substring(0, 20) + "...");

    const decoded = await adminAuth.verifyIdToken(token);
    console.log("✅ TOKEN DECODIFICADO:", decoded);

    // Dados extras do body
    const body = await req.json().catch(() => ({}));
    const email = decoded.email?.toLowerCase() ?? null;
    const name = body.name ?? decoded.name ?? null;

    // 🔍 1. Verifica se já existe usuário com mesmo UID ou e-mail
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ firebaseUid: decoded.uid }, { email }],
      },
    });

    let user;
    if (existingUser) {
      // 🔁 Atualiza se já existe
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firebaseUid: decoded.uid,
          email,
          name,
          updatedAt: new Date(),
        },
      });
    } else {
      // 🆕 Cria se não existir
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email,
          name,
          plan: "FREE",
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error("❌ Auth error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
