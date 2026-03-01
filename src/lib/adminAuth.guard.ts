import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  const decoded = await adminAuth.verifyIdToken(token).catch(() => null);

  if (!decoded) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  }

  if (user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}
