import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Anda sudah berlangganan" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("newsletter_subscribers")
    .insert({ email, is_active: true });

  if (error) {
    console.error("[Newsletter] Error:", error.message);
    return NextResponse.json({ error: "Gagal berlangganan" }, { status: 500 });
  }

  return NextResponse.json({ message: "Berhasil berlangganan!" });
}
