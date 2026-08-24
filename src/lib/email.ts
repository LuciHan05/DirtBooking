const FROM = "DirtBooking <onboarding@resend.dev>";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<{ error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY nu este configurat — email netrimis.");
    return { error: "Email service not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error("Eroare trimitere email:", text);
    return { error: text };
  }
  return {};
}

function emailShell(bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; background: #0a0a0a; padding: 32px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: #131316; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.08);">
        <p style="color: #ff6a1f; font-weight: 700; font-size: 18px; margin: 0 0 24px;">DirtBooking</p>
        ${bodyHtml}
      </div>
    </div>
  `;
}

export function newBookingEmail({
  hostName,
  riderName,
  trackName,
  slotDate,
  timeSlot,
  totalPrice,
  siteUrl,
}: {
  hostName: string;
  riderName: string;
  trackName: string;
  slotDate: string;
  timeSlot: string;
  totalPrice: number;
  siteUrl: string;
}): { subject: string; html: string } {
  const h = escapeHtml;
  return {
    subject: `Rezervare nouă — ${h(trackName)}`,
    html: emailShell(`
      <p style="color: #f5f5f5; font-size: 16px;">Salut, ${h(hostName)}!</p>
      <p style="color: #b5b5b5; font-size: 15px; line-height: 1.6;">
        <strong style="color:#f5f5f5">${h(riderName)}</strong> a rezervat o sesiune pe
        <strong style="color:#f5f5f5">${h(trackName)}</strong>, pe ${h(slotDate)} la ${h(timeSlot)}
        (${totalPrice} RON).
      </p>
      <a href="${siteUrl}/dashboard/bookings" style="display:inline-block;margin-top:16px;background:#ff6a1f;color:#0a0a0a;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        Vezi rezervarea
      </a>
    `),
  };
}

export function newMessageEmail({
  recipientName,
  senderName,
  content,
  siteUrl,
}: {
  recipientName: string;
  senderName: string;
  content: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const h = escapeHtml;
  return {
    subject: `Mesaj nou de la ${h(senderName)}`,
    html: emailShell(`
      <p style="color: #f5f5f5; font-size: 16px;">Salut, ${h(recipientName)}!</p>
      <p style="color: #b5b5b5; font-size: 15px; line-height: 1.6;">
        <strong style="color:#f5f5f5">${h(senderName)}</strong> ți-a trimis un mesaj:
      </p>
      <p style="color: #d5d5d5; font-size: 14px; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px 16px; font-style: italic;">
        „${h(content)}"
      </p>
      <a href="${siteUrl}/dashboard/messages" style="display:inline-block;margin-top:16px;background:#ff6a1f;color:#0a0a0a;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">
        Răspunde
      </a>
    `),
  };
}
