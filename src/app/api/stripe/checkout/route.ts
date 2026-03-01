import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const PRICE_MAP: Record<string, string | undefined> = {
  "pt-monthly": process.env.STRIPE_PRICE_ID_PRO_BRL,
  "en-monthly": process.env.STRIPE_PRICE_ID_PRO_USD,
  "pt-yearly": process.env.STRIPE_PRICE_ID_PRO_BRL_YEARLY,
  "en-yearly": process.env.STRIPE_PRICE_ID_PRO_USD_YEARLY,
};

export async function POST(req: Request) {
  try {
    const { userId, locale, billing = "monthly" } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userLocale = locale || (user.language === "pt" ? "pt" : "en");
    const interval = billing === "yearly" ? "yearly" : "monthly";
    const priceId = PRICE_MAP[`${userLocale}-${interval}`];

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 400 });
    }

    // Create or reuse Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await getStripe().checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${userLocale}/dashboard/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
