import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { newBookingEmail, newMessageEmail, sendEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NewBookingPayload {
  type: "new_booking";
  hostId: string;
  riderName: string;
  trackName: string;
  slotDate: string;
  timeSlot: string;
  totalPrice: number;
}

interface NewMessagePayload {
  type: "new_message";
  receiverId: string;
  senderName: string;
  content: string;
}

type NotifyPayload = NewBookingPayload | NewMessagePayload;

export async function POST(req: Request) {
  let payload: NotifyPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const siteUrl = new URL(req.url).origin;

  try {
    if (payload.type === "new_booking") {
      const { data: host } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", payload.hostId)
        .single();
      if (!host?.email) {
        return NextResponse.json({ error: "Host not found" }, { status: 404 });
      }
      const { subject, html } = newBookingEmail({
        hostName: host.name,
        riderName: payload.riderName,
        trackName: payload.trackName,
        slotDate: payload.slotDate,
        timeSlot: payload.timeSlot,
        totalPrice: payload.totalPrice,
        siteUrl,
      });
      const result = await sendEmail({ to: host.email, subject, html });
      if (result.error) return NextResponse.json(result, { status: 502 });
      return NextResponse.json({ success: true });
    }

    if (payload.type === "new_message") {
      const { data: receiver } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", payload.receiverId)
        .single();
      if (!receiver?.email) {
        return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
      }
      const { subject, html } = newMessageEmail({
        recipientName: receiver.name,
        senderName: payload.senderName,
        content: payload.content,
        siteUrl,
      });
      const result = await sendEmail({ to: receiver.email, subject, html });
      if (result.error) return NextResponse.json(result, { status: 502 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown notification type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
