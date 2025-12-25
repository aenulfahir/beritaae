"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Chrome,
    Facebook,
    CheckCircle2
} from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    const benefits = [
        "Simpan artikel favorit",
        "Notifikasi berita pilihan",
        "Komentar & diskusi",
        "Newsletter eksklusif",
    ];

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-muted/50 via-background to-primary/5">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative">
                <ScrollReveal>
                    <Card className="border-0 shadow-2xl">
                        <CardContent className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-block mb-6">
                                    <span className="text-2xl font-black">
                                        <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                            BERITA
                                        </span>
                                        <span>.AE</span>
                                    </span>
                                </Link>
                                <h1 className="text-2xl font-bold mb-2">Buat Akun Baru</h1>
                                <p className="text-muted-foreground">Gratis dan hanya butuh 1 menit</p>
                            </div>

                            {/* Benefits */}
                            <div className="bg-muted/50 rounded-xl p-4 mb-6">
                                <p className="text-sm font-medium mb-3">Keuntungan member:</p>
                                <ul className="grid grid-cols-2 gap-2">
                                    {benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Button variant="outline" className="gap-2">
                                    <Chrome className="h-4 w-4" />
                                    Google
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Facebook className="h-4 w-4" />
                                    Facebook
                                </Button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">atau</span>
                                </div>
                            </div>

                            {/* Register Form */}
                            <form className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            className="pl-10 h-11"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="nama@email.com"
                                            className="pl-10 h-11"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimal 8 karakter"
                                            className="pl-10 pr-10 h-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <input type="checkbox" id="terms" className="rounded mt-0.5" />
                                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                                        Saya setuju dengan{" "}
                                        <Link href="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                                        {" "}dan{" "}
                                        <Link href="/privacy" className="text-primary hover:underline">Kebijakan Privasi</Link>
                                    </label>
                                </div>

                                <Button size="lg" className="w-full gap-2">
                                    Daftar <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>

                            {/* Login link */}
                            <p className="text-center mt-6 text-sm text-muted-foreground">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-primary font-medium hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </ScrollReveal>
            </div>
        </div>
    );
}
