import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId, currency, interval, locale } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 🔹 Fallback de idioma, usado apenas na URL (ex: "en", "pt")
    const userLocale =
      locale || (user.language === "PT" ? "pt" : user.language === "EN" ? "en" : "en");

    // 🔹 Define o preço conforme moeda e período
    const priceId =
      currency === "BRL"
        ? interval === "yearly"
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BRL_YEARLY
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BRL_MONTHLY
        : interval === "yearly"
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_USD_YEARLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_USD_MONTHLY;

    if (!priceId) {
      return NextResponse.json({ error: "Preço não encontrado" }, { status: 400 });
    }

    // 🔹 Busca ou cria a subscription
    let subscription = await prisma.subscription.findUnique({ where: { userId } });

    if (!subscription) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
      });

      subscription = await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: customer.id,
        },
      });
    }

    // 🔹 Cria a sessão do Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: subscription.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // 👇 agora o locale só afeta a URL de retorno
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${userLocale}/dashboard/subscribe/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${userLocale}/dashboard/subscribe/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Erro no checkout Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
