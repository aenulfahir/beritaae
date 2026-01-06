"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  MessageSquare,
  Users,
  TrendingUp,
  Flame,
  Zap,
  Building2,
  Settings,
  Image,
  ChevronLeft,
  ChevronRight,
  User,
  UserCog,
  FileText,
  Briefcase,
  Megaphone,
  Palette,
  Phone,
  Share2,
  Scale,
  BarChart3,
  Globe,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "destructive" | "secondary";
  children?: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Utama",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analitik", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Konten",
    items: [
      {
        title: "Artikel",
        href: "/admin/articles",
        icon: Newspaper,
        badge: "24",
      },
      { title: "Kategori", href: "/admin/categories", icon: FolderOpen },
      {
        title: "Komentar",
        href: "/admin/comments",
        icon: MessageSquare,
        badge: "5",
        badgeVariant: "destructive",
      },
      { title: "Media", href: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Kurasi",
    items: [
      { title: "Breaking News", href: "/admin/breaking", icon: Zap },
      { title: "Trending", href: "/admin/trending", icon: TrendingUp },
      { title: "Popular", href: "/admin/popular", icon: Flame },
      { title: "Kelola Iklan", href: "/admin/ads", icon: Megaphone },
    ],
  },
  {
    label: "Kelola",
    items: [
      {
        title: "Pengguna",
        href: "/admin/users",
        icon: Users,
        children: [
          { title: "Admin", href: "/admin/users/admins", icon: UserCog },
          { title: "Penulis", href: "/admin/users/authors", icon: User },
          { title: "Member", href: "/admin/users/members", icon: Users },
        ],
      },
      {
        title: "Perusahaan",
        href: "/admin/company",
        icon: Building2,
        children: [
          { title: "Tentang", href: "/admin/company/about", icon: FileText },
          { title: "Tim", href: "/admin/company/team", icon: Users },
          { title: "Karir", href: "/admin/company/careers", icon: Briefcase },
          { title: "Iklan", href: "/admin/company/ads", icon: Megaphone },
        ],
      },
      {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: Settings,
        children: [
          {
            title: "Branding",
            href: "/admin/settings/branding",
            icon: Palette,
          },
          { title: "Kontak", href: "/admin/settings/contact", icon: Phone },
          { title: "Social", href: "/admin/settings/social", icon: Share2 },
          { title: "Legal", href: "/admin/settings/legal", icon: Scale },
        ],
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    // Auto-expand active parent items
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) => pathname === child.href
          );
          if (isChildActive && !expandedItems.includes(item.title)) {
            setExpandedItems((prev) => [...prev, item.title]);
          }
        }
      });
    });
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    if (item.children) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              "hover:bg-accent",
              active && "bg-accent",
              collapsed && "justify-center"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{item.title}</span>
                <ChevronRight
                  className={cn(
                    "h-3 w-3 shrink-0 transition-transform",
                    expandedItems.includes(item.title) && "rotate-90"
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && expandedItems.includes(item.title) && (
            <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const childActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                      "hover:bg-accent",
                      childActive && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <ChildIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{child.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const navLink = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
          "hover:bg-accent",
          active && "bg-primary/10 text-primary",
          collapsed && "justify-center"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant={item.badgeVariant || "secondary"}
                className="h-4 px-1 text-[10px]"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.title} delayDuration={0}>
          <TooltipTrigger asChild>{navLink}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <div className="flex items-center gap-2">
              {item.title}
              {item.badge && (
                <Badge
                  variant={item.badgeVariant || "secondary"}
                  className="h-4 px-1 text-[10px]"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.title}>{navLink}</div>;
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Header - Fixed */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b px-2">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-2 px-1">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  B
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none truncate">
                  BeritaAE
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  Admin
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-primary"
            >
              <span className="text-xs font-bold text-primary-foreground">
                B
              </span>
            </Link>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Expand button when collapsed - Fixed */}
        {collapsed && (
          <div className="flex shrink-0 justify-center py-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map(renderNavItem)}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer - Fixed */}
        <div className="shrink-0 border-t p-2 space-y-1">
          <Link
            href="/admin/help"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Bantuan</span>}
          </Link>
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className={cn("w-full h-7 text-xs gap-1.5", collapsed && "px-0")}
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span>Lihat Website</span>}
            </Button>
          </Link>
        </div>
      </aside>
    </TooltipProvider>
  );
}
