import { AdminUser, Author, SiteSettings, TrendingItem, DashboardStats, ActivityLog } from "@/types/admin";

export const adminUsers: AdminUser[] = [
    {
        id: "1",
        name: "Super Admin",
        email: "admin@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=68",
        role: "super_admin",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Editor Utama",
        email: "editor@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=33",
        role: "editor",
        createdAt: "2024-03-15T00:00:00Z",
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        name: "Penulis Junior",
        email: "writer@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=12",
        role: "writer",
        createdAt: "2024-06-01T00:00:00Z",
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const authors: Author[] = [
    {
        id: "1",
        name: "Ahmad Rizki",
        email: "ahmad@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        bio: "Jurnalis senior dengan pengalaman 10 tahun di bidang ekonomi dan bisnis.",
        articlesCount: 156,
        socialLinks: { twitter: "ahmadrizki", instagram: "ahmadrizki_news" },
    },
    {
        id: "2",
        name: "Siti Nurhaliza",
        email: "siti@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        bio: "Spesialis teknologi dan startup Indonesia.",
        articlesCount: 89,
        socialLinks: { twitter: "sitinurhaliza" },
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@beritaae.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        bio: "Reporter olahraga dengan fokus sepak bola nasional.",
        articlesCount: 234,
    },
];

export const siteSettings: SiteSettings = {
    brandName: "BeritaAE",
    tagline: "Portal berita terdepan dengan informasi terkini, akurat, dan terpercaya untuk Indonesia.",
    logoUrl: undefined,
    faviconUrl: undefined,
    contactEmail: "redaksi@beritaae.com",
    contactPhone: "+62 21 1234 5678",
    address: "Gedung Graha Berita Lt. 15, Jl. Sudirman Kav. 52-53, Jakarta Selatan 12190",
    socialLinks: {
        facebook: "https://facebook.com/beritaae",
        twitter: "https://twitter.com/beritaae",
        instagram: "https://instagram.com/beritaae",
        youtube: "https://youtube.com/@beritaae",
    },
};

export const trendingTags: TrendingItem[] = [
    { id: "1", tag: "#CPNS2025", order: 1, isActive: true },
    { id: "2", tag: "#PialaAFF", order: 2, isActive: true },
    { id: "3", tag: "#UMK2025", order: 3, isActive: true },
    { id: "4", tag: "#Nataru", order: 4, isActive: true },
    { id: "5", tag: "#IKN", order: 5, isActive: true },
    { id: "6", tag: "#Lebaran2025", order: 6, isActive: false },
];

export const dashboardStats: DashboardStats = {
    totalArticles: 24,
    totalViews: 156420,
    totalComments: 342,
    totalUsers: 12500,
    articlesToday: 5,
    viewsToday: 8930,
};

export const recentActivity: ActivityLog[] = [
    { id: "1", action: "Artikel dipublikasikan", user: "Ahmad Rizki", target: "Pemerintah Luncurkan Program Digitalisasi UMKM", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { id: "2", action: "Kategori ditambahkan", user: "Super Admin", target: "Lifestyle", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "3", action: "Komentar disetujui", user: "Editor Utama", target: "15 komentar", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    { id: "4", action: "Artikel diedit", user: "Siti Nurhaliza", target: "Startup Indonesia Raih Pendanaan Seri B", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    { id: "5", action: "User baru terdaftar", user: "System", target: "user@example.com", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
];

// Current logged in admin (mock)
export const currentAdmin = adminUsers[0];
