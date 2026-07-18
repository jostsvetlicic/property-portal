import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Public endpoint: newsletter subscription. Stores a unique email so the agency
 * can build a market-insights mailing list. Re-subscribing is idempotent.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const locale = body.locale === "sl" ? "sl" : "en";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, locale },
      update: { locale },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
