import { adminAuth } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Instância Stripe segura
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// ✅ Define tipo local seguro (evita conflito com Prisma)
type StripeSubSafe = {
  id: string;
  status: string;
  customer: string | Stripe.Customer;
  current_period_end?: number;
};

export async function GET(req: NextRequest) {
  try {
    // 🔒 Autenticação Firebase
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Busca usuário + assinatura
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: { Subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sub = user.Subscription;
    if (!sub) {
      return NextResponse.json(
        { message: "No active subscription found", subscription: null },
        { status: 200 }
      );
    }

    // 🔹 Consulta o Stripe para garantir dados atualizados
    let stripeSub: StripeSubSafe | null = null;
    try {
      const result = await stripe.subscriptions.retrieve(
        sub.stripeSubscriptionId!
      );
      stripeSub = {
        id: result.id,
        status: result.status,
        customer: result.customer,
        current_period_end: result.current_period_end,
      };
    } catch (stripeErr) {
      console.warn("⚠️ Subscription not found in Stripe:", stripeErr);
    }

    // 🔹 Atualiza no Prisma (mantém em sincronia)
    if (stripeSub) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: stripeSub.status,
          current_period_end: stripeSub.current_period_end
            ? new Date(stripeSub.current_period_end * 1000)
            : null,
        },
      });
    }

    // 🔹 Define status ativo
    const isActive = ["active", "trialing", "past_due"].includes(
      stripeSub?.status || sub.status
    );

    // ✅ Retorna dados formatados
    return NextResponse.json({
      subscription: {
        id: sub.id,
        status: stripeSub?.status ?? sub.status,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        current_period_end: stripeSub?.current_period_end
          ? new Date(stripeSub.current_period_end * 1000)
          : sub.current_period_end ?? null,
      },
      active: isActive,
    });
  } catch (err: any) {
    console.error("💥 Error fetching subscription:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
