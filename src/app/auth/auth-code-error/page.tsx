"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "missing_token":
        return "Link verifikasi tidak lengkap. Silakan gunakan link dari email yang kami kirim.";
      case "invalid_request":
        return "Permintaan tidak valid. Silakan coba lagi.";
      case "otp_expired":
        return "Link verifikasi sudah kadaluarsa. Silakan daftar ulang atau minta link baru.";
      default:
        return (
          errorCode ||
          "Terjadi kesalahan saat memproses autentikasi Anda. Link mungkin sudah kadaluarsa atau tidak valid."
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-muted/50 via-background to-primary/5">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black">
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  BERITA
                </span>
                <span>.AE</span>
              </span>
            </Link>

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
            <p className="text-muted-foreground mb-6">
              {getErrorMessage(error)}
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">Coba Login Lagi</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthCodeErrorContent />
    </Suspense>
  );
}
