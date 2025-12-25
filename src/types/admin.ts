// Admin Types
export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'super_admin' | 'editor' | 'writer';
    createdAt: string;
    lastLogin: string;
}

export interface Author {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    articlesCount: number;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}

export interface SiteSettings {
    brandName: string;
    tagline: string;
    logoUrl?: string;
    faviconUrl?: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        tiktok?: string;
    };
}

export interface TrendingItem {
    id: string;
    tag: string;
    order: number;
    isActive: boolean;
}

export interface DashboardStats {
    totalArticles: number;
    totalViews: number;
    totalComments: number;
    totalUsers: number;
    articlesToday: number;
    viewsToday: number;
}

export interface ActivityLog {
    id: string;
    action: string;
    user: string;
    target?: string;
    timestamp: string;
}
