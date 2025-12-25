"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    MapPin,
    Cloud,
    Thermometer,
    TrendingUp,
    Clock,
    ChevronRight
} from "lucide-react";
import { breakingNews } from "@/data/mock";

export function TopBar() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
            setCurrentDate(
                now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
            );
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-zinc-900 text-zinc-300 text-xs border-b border-zinc-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-8">
                    {/* Left: Date, Time, Location, Weather */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-zinc-500" />
                            <span className="font-medium">{currentTime}</span>
                            <span className="text-zinc-500">|</span>
                            <span>{currentDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <MapPin className="h-3 w-3" />
                            <span>Jakarta, Indonesia</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <Cloud className="h-3 w-3" />
                            <Thermometer className="h-3 w-3" />
                            <span>28°C Cerah</span>
                        </div>
                    </div>

                    {/* Mobile: Simple date */}
                    <div className="md:hidden flex items-center gap-2 text-zinc-400">
                        <Clock className="h-3 w-3" />
                        <span>{currentTime}</span>
                    </div>

                    {/* Right: Trending & Quick Links */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 text-amber-500">
                            <TrendingUp className="h-3 w-3" />
                            <span className="font-medium">Trending:</span>
                            <Link href="/trending" className="text-zinc-300 hover:text-white transition-colors truncate max-w-[150px]">
                                CPNS 2025
                            </Link>
                        </div>
                        <span className="text-zinc-700">|</span>
                        <Link href="/about" className="hover:text-white transition-colors">Tentang</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Kontak</Link>
                        <Link href="/advertise" className="hover:text-white transition-colors hidden sm:block">Iklan</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function BreakingNewsTicker() {
    const breakingItems = [
        "Pemerintah Luncurkan Program Digitalisasi UMKM Nasional",
        "Timnas Indonesia Melaju ke Semifinal Piala AFF",
        "DPR Sahkan RUU Cipta Kerja Klaster Ketenagakerjaan",
        "Bank Indonesia Pertahankan Suku Bunga Acuan di 6%",
    ];

    return (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-9">
                    {/* Breaking Badge */}
                    <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-red-400/50">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </div>
                        <span className="font-bold text-xs uppercase tracking-wider">Breaking</span>
                    </div>

                    {/* Scrolling News */}
                    <div className="flex-1 overflow-hidden ml-4">
                        <div className="flex gap-12 animate-marquee whitespace-nowrap">
                            {breakingItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href="#"
                                    className="text-sm font-medium hover:underline flex items-center gap-2"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                    {item}
                                </Link>
                            ))}
                            {breakingItems.map((item, index) => (
                                <Link
                                    key={`dup-${index}`}
                                    href="#"
                                    className="text-sm font-medium hover:underline flex items-center gap-2"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
