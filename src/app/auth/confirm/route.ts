import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Get token_hash and type from URL params
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // If we have token_hash and type, verify the OTP
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect to success page or next URL
      return NextResponse.redirect(`${origin}${next}`);
    }

    // If error, redirect to error page
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  // If no token_hash, check for token (old format)
  const token = searchParams.get("token");

  if (token && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: token,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  // No valid params, redirect to error
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=missing_token`
  );
}
