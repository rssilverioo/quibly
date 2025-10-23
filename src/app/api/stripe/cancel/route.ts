import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  try {
    // 🔒 Verifica token Firebase (pega o user logado)
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 Lê o corpo da requisição
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscriptionId" },
        { status: 400 }
      );
    }

    // 🔍 Busca a assinatura e o usuário logado
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: { Subscription: true },
    });

    if (!user || !user.Subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // ⚙️ Cancela no Stripe
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // 💾 Atualiza o status no banco
    await prisma.subscription.update({
      where: { id: user.Subscription.id },
      data: { status: "canceled" },
    });

    // 🔄 Atualiza o plano do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: "FREE" },
    });

    console.log(`🗑️ Assinatura cancelada → ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully",
    });
  } catch (err: any) {
    console.error("💥 Error canceling subscription:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
