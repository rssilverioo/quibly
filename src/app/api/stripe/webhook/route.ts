import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

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
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const buf = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature validation failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as StripeSubSafe;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.warn("No user found for customer:", customerId);
          break;
        }

        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;

        const priceId =
          subscription.items?.data?.[0]?.price?.id ?? user.stripePriceId;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: periodEnd,
            plan: subscription.status === "active" ? "PRO" : "FREE",
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as StripeSubSafe;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              subscriptionStatus: "canceled",
            },
          });
        }

        break;
      }

      case "invoice.payment_succeeded": {
        console.log("Payment confirmed!");
        break;
      }

      default: {
        console.log("Event ignored:", event.type);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook processing error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
