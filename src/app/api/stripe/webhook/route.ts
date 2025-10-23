import { prisma } from "@/lib/prisma";
import type { Subscription as PrismaSubscription } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// ✅ Instância Stripe com versão fixa e segura
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Define tipo local — isola de @prisma/client
type StripeSubSafe = {
  id: string;
  customer: string | Stripe.Customer;
  status: string;
  current_period_end: number;
  items?: {
    data: {
      price?: { id?: string };
    }[];
  };
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.text();

  let event: Stripe.Event;

  try {
    // ✅ Valida assinatura do Stripe
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook recebido:", event.type);
  } catch (err: any) {
    console.error("❌ Erro ao validar assinatura do webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * ========================================================
       * ASSINATURA CRIADA / ATUALIZADA
       * ========================================================
       */
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as StripeSubSafe;
        const customerId = subscription.customer as string;

        console.log("🔄 Atualizando assinatura:", subscription.id);

        const prismaSub: PrismaSubscription | null =
          await prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId },
          });

        if (!prismaSub) {
          console.warn("⚠️ Nenhuma assinatura encontrada para:", customerId);
          break;
        }

        // ✅ Converte timestamp Unix → Date
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;

        const priceId =
          subscription.items?.data?.[0]?.price?.id ?? prismaSub.stripePriceId;

        await prisma.subscription.update({
          where: { id: prismaSub.id },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            status: subscription.status,
            current_period_end: periodEnd,
          },
        });

        await prisma.user.update({
          where: { id: prismaSub.userId },
          data: {
            plan: subscription.status === "active" ? "PREMIUM" : "FREE",
          },
        });

        console.log(
          `✅ Assinatura sincronizada (${subscription.status}) → ${prismaSub.userId}`
        );
        break;
      }

      /**
       * ========================================================
       * ASSINATURA CANCELADA
       * ========================================================
       */
      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as StripeSubSafe;
        const customerId = subscription.customer as string;

        const prismaSub: PrismaSubscription | null =
          await prisma.subscription.findUnique({
            where: { stripeCustomerId: customerId },
          });

        if (prismaSub) {
          await prisma.user.update({
            where: { id: prismaSub.userId },
            data: { plan: "FREE" },
          });

          await prisma.subscription.update({
            where: { id: prismaSub.id },
            data: { status: "canceled" },
          });

          console.log(`🗑️ Assinatura cancelada → ${prismaSub.userId}`);
        } else {
          console.warn(
            "⚠️ Nenhuma assinatura encontrada para cancelar:",
            customerId
          );
        }

        break;
      }

      /**
       * ========================================================
       * PAGAMENTO CONFIRMADO
       * ========================================================
       */
      case "invoice.payment_succeeded": {
        console.log("💰 Pagamento confirmado!");
        break;
      }

      /**
       * ========================================================
       * EVENTOS IGNORADOS
       * ========================================================
       */
      default: {
        console.log("ℹ️ Evento ignorado:", event.type);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("💥 Erro ao processar webhook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
