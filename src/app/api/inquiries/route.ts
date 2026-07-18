import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Public endpoint: capture a lead from a property inquiry form or the contact
 * form. Persists to the DB so it appears live in the admin Inquiries view.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const source = body.source === "contact" ? "contact" : "property";
    const propertyId = body.propertyId ? String(body.propertyId) : null;

    // Minimal server-side validation (boundary input).
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        source,
        // Only attach a property if it exists (defensive).
        propertyId: propertyId ?? undefined,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your enquiry. Please try again." },
      { status: 500 },
    );
  }
}
