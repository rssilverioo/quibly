// /src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const buf = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const sub = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
      if (!sub) break;

      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
current_period_end: new Date((subscription as any).current_period_end * 1000),
        },
      });

      await prisma.user.update({
        where: { id: sub.userId },
        data: { plan: subscription.status === "active" ? "PREMIUM" : "FREE" },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const sub = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
      if (sub) {
        await prisma.user.update({
          where: { id: sub.userId },
          data: { plan: "FREE" },
        });
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
