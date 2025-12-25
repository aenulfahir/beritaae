"use client";

import Link from "next/link";
import { categories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import {
    Search,
    Moon,
    Sun,
    Menu,
    X,
    User,
    Bell,
    Bookmark,
    TrendingUp,
    Flame,
    ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b">
            {/* Main Header */}
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        <div className="relative">
                            <span className="text-xl md:text-2xl font-black tracking-tighter">
                                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                    BERITA
                                </span>
                                <span className="text-foreground">.AE</span>
                            </span>
                        </div>
                    </Link>

                    {/* Center: Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari berita, topik, atau penulis..."
                                className="pl-10 pr-4 h-9 bg-muted/50 border-0 focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-1">
                        {/* Search Toggle (Mobile) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9"
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Notifications */}
                        <Link href="/notifications">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex relative">
                                <Bell className="h-4 w-4" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                            </Button>
                        </Link>

                        {/* Bookmarks */}
                        <Link href="/saved">
                            <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </Link>

                        {/* Theme Toggle */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </Button>
                        )}

                        {/* Login Button */}
                        <Link href="/login">
                            <Button size="sm" className="h-9 px-4 hidden sm:flex gap-2">
                                <User className="h-4 w-4" />
                                <span>Masuk</span>
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-9 w-9"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search */}
                {searchOpen && (
                    <div className="lg:hidden pb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari berita..."
                                className="pl-10 pr-4 h-9 bg-muted/50 border-0"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Bar */}
            <div className="border-t bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="hidden lg:flex items-center justify-between h-10">
                        {/* Left: Categories */}
                        <nav className="flex items-center gap-1">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-0">
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "h-10 px-3 text-sm")}>
                                            <Link href="/">
                                                Beranda
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="h-10 px-3 text-sm">
                                            Kategori
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2">
                                                {categories.map((category) => (
                                                    <li key={category.id}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={`/category/${category.slug}`}
                                                                className="flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                                                            >
                                                                <div
                                                                    className="w-2 h-2 rounded-full shrink-0"
                                                                    style={{ backgroundColor: category.color }}
                                                                />
                                                                <div>
                                                                    <div className="text-sm font-medium">{category.name}</div>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Berita {category.name.toLowerCase()}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    {categories.slice(0, 4).map((cat) => (
                                        <NavigationMenuItem key={cat.id}>
                                            <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "h-10 px-3 text-sm")}>
                                                <Link href={`/category/${cat.slug}`}>
                                                    {cat.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </nav>

                        {/* Right: Special Links */}
                        <div className="flex items-center gap-1">
                            <Link
                                href="/trending"
                                className="flex items-center gap-1.5 px-3 h-10 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md transition-colors"
                            >
                                <TrendingUp className="h-4 w-4" />
                                Trending
                            </Link>
                            <Link
                                href="/popular"
                                className="flex items-center gap-1.5 px-3 h-10 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                            >
                                <Flame className="h-4 w-4" />
                                Terpopuler
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="space-y-1">
                            <Link
                                href="/"
                                className="flex items-center px-3 py-2.5 text-sm font-medium hover:bg-accent rounded-md"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>

                            <div className="py-2">
                                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Kategori
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.slug}`}
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-2 mt-2 space-y-1">
                                <Link
                                    href="/trending"
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <TrendingUp className="h-4 w-4" />
                                    Trending
                                </Link>
                                <Link
                                    href="/popular"
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Flame className="h-4 w-4" />
                                    Terpopuler
                                </Link>
                            </div>

                            <div className="border-t pt-3 mt-3">
                                <Button className="w-full" size="sm">
                                    <User className="h-4 w-4 mr-2" />
                                    Masuk / Daftar
                                </Button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
