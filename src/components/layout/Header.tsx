"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { LocationWeatherWidget } from "@/components/layout/LocationWeatherWidget";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const { settings } = useSiteSettings();
  const { categories } = useCategories();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse brand name for display
  const brandName = settings.name || "BERITA.AE";
  const brandParts = brandName.includes(".")
    ? brandName.split(".")
    : [brandName.slice(0, -3), brandName.slice(-2)];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      {/* Top Bar - Location, Time, Weather */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-1.5">
            <LocationWeatherWidget />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={brandName}
                className="h-8 md:h-10 object-contain"
              />
            ) : (
              <div className="relative">
                <span className="text-xl md:text-2xl font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    {brandParts[0]}
                  </span>
                  <span className="text-foreground">
                    .{brandParts[1] || "AE"}
                  </span>
                </span>
              </div>
            )}
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
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hidden sm:flex relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </Link>

            {/* Bookmarks */}
            <Link href="/saved">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hidden sm:flex"
              >
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

            {/* Login Button or User Menu */}
            {authLoading ? (
              // Placeholder saat loading untuk mencegah flickering
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse hidden sm:block" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 hidden sm:flex gap-2"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={
                          profile?.avatar_url ||
                          user?.user_metadata?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profile?.full_name ||
                              user?.user_metadata?.full_name ||
                              user?.email ||
                              "U"
                          )}&background=random`
                        }
                      />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(profile?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate text-sm">
                      {profile?.full_name || user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved" className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Artikel Tersimpan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifikasi
                    </Link>
                  </DropdownMenuItem>
                  {(profile?.role === "admin" ||
                    profile?.role === "editor" ||
                    profile?.role === "author") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Dashboard Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="h-9 px-4 hidden sm:flex gap-2">
                  <User className="h-4 w-4" />
                  <span>Masuk</span>
                </Button>
              </Link>
            )}

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
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-10 px-3 text-sm"
                      )}
                    >
                      <Link href="/">Beranda</Link>
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
                                  <div className="text-sm font-medium">
                                    {category.name}
                                  </div>
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
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-10 px-3 text-sm"
                        )}
                      >
                        <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
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
                {authLoading ? (
                  // Placeholder saat loading untuk mobile
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            profile?.avatar_url ||
                            user?.user_metadata?.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              profile?.full_name ||
                                user?.user_metadata?.full_name ||
                                user?.email ||
                                "U"
                            )}&background=random`
                          }
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(profile?.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      Profil Saya
                    </Link>
                    {(profile?.role === "admin" ||
                      profile?.role === "editor" ||
                      profile?.role === "author") && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Dashboard Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Masuk / Daftar
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
