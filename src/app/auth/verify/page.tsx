"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = searchParams.get("token_hash");
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      const next = searchParams.get("next") || "/";

      // Use token_hash or token
      const verificationToken = token_hash || token;

      if (!verificationToken || !type) {
        setStatus("error");
        setErrorMessage("Link verifikasi tidak valid atau sudah kadaluarsa.");
        return;
      }

      try {
        const supabase = createClient();

        const { error } = await supabase.auth.verifyOtp({
          type: type as "signup" | "recovery" | "invite" | "email",
          token_hash: verificationToken,
        });

        if (error) {
          setStatus("error");
          setErrorMessage(error.message || "Gagal memverifikasi email.");
          return;
        }

        setStatus("success");

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(next);
        }, 2000);
      } catch (err) {
        setStatus("error");
        setErrorMessage("Terjadi kesalahan saat memverifikasi email.");
        console.error("Verification error:", err);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-muted/50 via-background to-primary/5">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
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

            {status === "loading" && (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Memverifikasi Email...
                </h1>
                <p className="text-muted-foreground">
                  Mohon tunggu sebentar, kami sedang memverifikasi email Anda.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Email Terverifikasi!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Akun Anda telah berhasil diverifikasi. Anda akan dialihkan ke
                  halaman utama...
                </p>
                <Button asChild className="w-full">
                  <Link href="/">Ke Halaman Utama</Link>
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
                  <Button asChild className="w-full">
                    <Link href="/login">Ke Halaman Login</Link>
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

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
