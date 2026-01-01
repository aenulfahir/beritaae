"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, XCircle, Mail, RefreshCw } from "lucide-react";

const OTP_LENGTH = 8; // Supabase uses 8-digit OTP

function VerifyOTPContent() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState<
    "input" | "loading" | "success" | "error"
  >("input");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "signup";

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    // Handle paste
    if (value.length > 1) {
      const pastedCode = value.slice(0, OTP_LENGTH).split("");
      pastedCode.forEach((digit, i) => {
        if (i < OTP_LENGTH) newOtp[i] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedCode.length, OTP_LENGTH - 1)]?.focus();

      // Auto submit if all filled
      if (pastedCode.length === OTP_LENGTH) {
        handleVerify(newOtp.join(""));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all filled
    if (value && index === OTP_LENGTH - 1) {
      const code = newOtp.join("");
      if (code.length === OTP_LENGTH) {
        handleVerify(code);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setErrorMessage(`Masukkan ${OTP_LENGTH} digit kode verifikasi`);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: type as "signup" | "recovery" | "email",
      });

      if (error) {
        setStatus("error");
        if (error.message.includes("expired")) {
          setErrorMessage("Kode sudah kadaluarsa. Silakan minta kode baru.");
        } else if (error.message.includes("invalid")) {
          setErrorMessage("Kode tidak valid. Periksa kembali kode Anda.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      setStatus("success");

      // Redirect after success
      setTimeout(() => {
        if (type === "recovery") {
          router.push("/auth/reset-password");
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Verification error:", err);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsResending(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      if (type === "recovery") {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${
            window.location.origin
          }/auth/verify-otp?email=${encodeURIComponent(email)}&type=recovery`,
        });
      } else {
        await supabase.auth.resend({
          type: "signup",
          email,
        });
      }

      setResendCooldown(60);
    } catch (err) {
      setErrorMessage("Gagal mengirim ulang kode. Silakan coba lagi.");
      console.error("Resend error:", err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-muted/50 via-background to-primary/5">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            {/* Logo */}
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black">
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  BERITA
                </span>
                <span>.AE</span>
              </span>
            </Link>

            {status === "input" && (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verifikasi Email</h1>
                <p className="text-muted-foreground mb-6">
                  Masukkan {OTP_LENGTH} digit kode yang telah dikirim ke{" "}
                  <strong className="text-foreground">{email}</strong>
                </p>

                {/* OTP Input - 8 digits */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={OTP_LENGTH}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-10 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold p-0"
                    />
                  ))}
                </div>

                {errorMessage && (
                  <p className="text-destructive text-sm mb-4">
                    {errorMessage}
                  </p>
                )}

                <Button
                  onClick={() => handleVerify()}
                  className="w-full mb-4"
                  disabled={otp.join("").length !== OTP_LENGTH}
                >
                  Verifikasi
                </Button>

                <div className="text-sm text-muted-foreground">
                  Tidak menerima kode?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isResending}
                    className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <span className="inline-flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Mengirim...
                      </span>
                    ) : resendCooldown > 0 ? (
                      `Kirim ulang (${resendCooldown}s)`
                    ) : (
                      "Kirim ulang"
                    )}
                  </button>
                </div>
              </>
            )}

            {status === "loading" && (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Memverifikasi...</h1>
                <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {type === "recovery"
                    ? "Email Terverifikasi!"
                    : "Akun Terverifikasi!"}
                </h1>
                <p className="text-muted-foreground mb-6">
                  {type === "recovery"
                    ? "Anda akan dialihkan ke halaman reset password..."
                    : "Akun Anda telah berhasil diverifikasi. Anda akan dialihkan..."}
                </p>
                <Button asChild className="w-full">
                  <Link
                    href={type === "recovery" ? "/auth/reset-password" : "/"}
                  >
                    {type === "recovery"
                      ? "Reset Password"
                      : "Ke Halaman Utama"}
                  </Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verifikasi Gagal</h1>
                <p className="text-muted-foreground mb-6">{errorMessage}</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setStatus("input");
                      setOtp(Array(OTP_LENGTH).fill(""));
                      inputRefs.current[0]?.focus();
                    }}
                    className="w-full"
                  >
                    Coba Lagi
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register">Daftar Ulang</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
