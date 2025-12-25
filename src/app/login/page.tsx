"use client";

import { useState } from "react";
import { Metadata } from "next";
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
    Facebook
} from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-muted/50 via-background to-primary/5">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

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
                                <h1 className="text-2xl font-bold mb-2">Selamat Datang</h1>
                                <p className="text-muted-foreground">Masuk ke akun BeritaAE Anda</p>
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

                            {/* Login Form */}
                            <form className="space-y-4">
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">Password</label>
                                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                            Lupa password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
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

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="remember" className="rounded" />
                                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                                        Ingat saya
                                    </label>
                                </div>

                                <Button size="lg" className="w-full gap-2">
                                    Masuk <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>

                            {/* Register link */}
                            <p className="text-center mt-6 text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <Link href="/register" className="text-primary font-medium hover:underline">
                                    Daftar sekarang
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </ScrollReveal>
            </div>
        </div>
    );
}
