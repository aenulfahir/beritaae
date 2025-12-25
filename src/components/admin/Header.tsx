"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Bell,
    Search,
    Moon,
    Sun,
    User,
    Settings,
    LogOut,
    Command,
    Calendar,
    Clock,
    ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { currentAdmin } from "@/data/admin-mock";
import { useEffect, useState } from "react";

export function AdminHeader() {
    const { theme, setTheme } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = () => {
        return currentTime.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = () => {
        return currentTime.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-6">
                {/* Left: Date, Time & Search */}
                <div className="flex items-center gap-6">
                    {/* Date & Time */}
                    <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{mounted ? formatDate() : "Loading..."}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="tabular-nums">{mounted ? formatTime() : "--:--"}</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-72 hidden md:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari artikel, kategori..."
                            className="pl-9 pr-12 h-9 bg-muted/50 border-0 focus-visible:ring-1"
                        />
                        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <Command className="h-3 w-3" />K
                        </kbd>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                    {/* View Website */}
                    <Link href="/" target="_blank">
                        <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="text-xs">Lihat Website</span>
                        </Button>
                    </Link>

                    <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative h-8 w-8">
                                <Bell className="h-4 w-4" />
                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-pulse">
                                    3
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel className="flex items-center justify-between">
                                <span>Notifikasi</span>
                                <Badge variant="secondary" className="text-[10px]">3 baru</Badge>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-72 overflow-y-auto">
                                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                                    <p className="text-sm font-medium">Artikel baru menunggu review</p>
                                    <p className="text-xs text-muted-foreground">2 menit yang lalu</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                                    <p className="text-sm font-medium">5 komentar baru perlu moderasi</p>
                                    <p className="text-xs text-muted-foreground">15 menit yang lalu</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                                    <p className="text-sm font-medium">Sistem backup selesai</p>
                                    <p className="text-xs text-muted-foreground">1 jam yang lalu</p>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center text-primary text-sm font-medium">
                                Lihat semua notifikasi
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="w-px h-6 bg-border mx-2" />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2 h-9 pl-2 pr-3 hover:bg-accent">
                                <div className="relative">
                                    <Image
                                        src={currentAdmin.avatar}
                                        alt={currentAdmin.name}
                                        width={28}
                                        height={28}
                                        className="rounded-full ring-2 ring-background"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium leading-tight">{currentAdmin.name}</p>
                                    <p className="text-[10px] text-muted-foreground capitalize leading-tight">
                                        {currentAdmin.role.replace("_", " ")}
                                    </p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex items-center gap-3 p-3">
                                <Image
                                    src={currentAdmin.avatar}
                                    alt={currentAdmin.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{currentAdmin.name}</p>
                                    <p className="text-xs text-muted-foreground">{currentAdmin.email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profil Saya
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Pengaturan Akun
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                                <LogOut className="mr-2 h-4 w-4" />
                                Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
