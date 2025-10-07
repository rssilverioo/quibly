import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

// 🔑 Helper para validar token
async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
  if (!decoded) return null;

  return prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
}

// GET -> pega dados do usuário logado
export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: user.createdAt,
  });
}

// PATCH -> atualizar dados do usuário
export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, plan } = body;

  const user = await prisma.user.update({
    where: { firebaseUid: decoded.uid },
    data: {
      name: name ?? undefined,
      plan: plan ?? undefined,
    },
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    updatedAt: user.updatedAt,
  });
}
