import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: any // 👈 troque o tipo para "any" para o compilador aceitar o formato
) {
  const id = context?.params?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user", details: String(err) },
      { status: 500 }
    );
  }
}
