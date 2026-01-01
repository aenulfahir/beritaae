# Design Document: Admin Dashboard Real Data

## Overview

Mengubah Admin Dashboard dari mock data ke data real dari Supabase. Dashboard akan menampilkan statistik real-time dengan data yang diambil langsung dari database, termasuk total artikel, views, komentar, pengguna, serta berbagai chart dan list.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard Page                      │
│                   (src/app/admin/page.tsx)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Stats Cards │  │   Charts    │  │   Lists     │         │
│  │  Component  │  │  Component  │  │  Component  │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│                    ┌─────▼─────┐                            │
│                    │  Custom   │                            │
│                    │   Hooks   │                            │
│                    └─────┬─────┘                            │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Dashboard  │
                    │   Service   │
                    │ (analytics) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │   Client    │
                    └─────────────┘
```

## Components and Interfaces

### Dashboard Service Interface

```typescript
// src/lib/supabase/services/dashboard.ts

interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalComments: number;
  totalUsers: number;
  articlesChange: number; // percentage change vs last week
  viewsChange: number;
  commentsChange: number;
  usersChange: number;
}

interface DailyViewsData {
  date: string;
  dayName: string; // Sen, Sel, Rab, etc.
  views: number;
  articles: number;
}

interface HourlyTrafficData {
  hour: string; // 00:00, 03:00, etc.
  value: number;
}

interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

interface DeviceDistribution {
  name: string; // Mobile, Desktop, Tablet
  value: number;
  color: string;
}

interface PopularArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  views_count: number;
}

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: {
    name: string;
    color: string;
  };
  is_breaking: boolean;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string | null;
  user_name: string;
  created_at: string;
}

// Service Functions
async function getDashboardStats(): Promise<DashboardStats>;
async function getDailyViews(days: number): Promise<DailyViewsData[]>;
async function getHourlyTraffic(): Promise<HourlyTrafficData[]>;
async function getCategoryDistribution(): Promise<CategoryDistribution[]>;
async function getDeviceDistribution(): Promise<DeviceDistribution[]>;
async function getPopularArticles(limit: number): Promise<PopularArticle[]>;
async function getRecentArticles(limit: number): Promise<RecentArticle[]>;
async function getRecentActivity(limit: number): Promise<ActivityLog[]>;
```

### Dashboard Page Component

```typescript
// src/app/admin/page.tsx

interface DashboardState {
  stats: DashboardStats | null;
  dailyViews: DailyViewsData[];
  hourlyTraffic: HourlyTrafficData[];
  categoryData: CategoryDistribution[];
  deviceData: DeviceDistribution[];
  popularArticles: PopularArticle[];
  recentArticles: RecentArticle[];
  recentActivity: ActivityLog[];
  loading: boolean;
  error: string | null;
}
```

## Data Models

### Database Queries

1. **Total Articles Count**

```sql
SELECT COUNT(*) FROM articles WHERE status = 'published'
```

2. **Total Views (Sum)**

```sql
SELECT COALESCE(SUM(views_count), 0) FROM articles WHERE status = 'published'
```

3. **Total Comments Count**

```sql
SELECT COUNT(*) FROM comments WHERE is_approved = true
```

4. **Total Users Count**

```sql
SELECT COUNT(*) FROM profiles
```

5. **Daily Views (Last 7 Days)**

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as views
FROM page_views
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date ASC
```

6. **Hourly Traffic (Today)**

```sql
SELECT
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as value
FROM page_views
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour ASC
```

7. **Category Distribution**

```sql
SELECT
  c.name,
  c.color,
  COUNT(a.id) as value
FROM categories c
LEFT JOIN articles a ON a.category_id = c.id AND a.status = 'published'
GROUP BY c.id, c.name, c.color
ORDER BY value DESC
```

8. **Device Distribution**

```sql
SELECT
  device_type,
  COUNT(*) as value
FROM page_views
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY device_type
```

9. **Popular Articles**

```sql
SELECT id, title, slug, image_url, views_count
FROM articles
WHERE status = 'published'
ORDER BY views_count DESC
LIMIT 5
```

10. **Recent Articles**

```sql
SELECT
  a.id, a.title, a.slug, a.image_url, a.is_breaking, a.created_at,
  c.name as category_name, c.color as category_color
FROM articles a
JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.created_at DESC
LIMIT 5
```

11. **Recent Activity**

```sql
SELECT
  al.id, al.action, al.entity_type, al.entity_title, al.created_at,
  p.full_name as user_name
FROM admin_activity_log al
JOIN profiles p ON al.user_id = p.id
ORDER BY al.created_at DESC
LIMIT 10
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Count Accuracy

_For any_ database state, the dashboard stats counts (articles, comments, users) SHALL equal the actual count from their respective tables with appropriate filters applied.
**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Views Sum Accuracy

_For any_ set of published articles with views_count values, the total views displayed SHALL equal the sum of all views_count values.
**Validates: Requirements 1.2**

### Property 3: Percentage Change Calculation

_For any_ current week count and previous week count, the percentage change SHALL be calculated as ((current - previous) / previous) \* 100, rounded to nearest integer.
**Validates: Requirements 1.5**

### Property 4: Daily Views Data Range

_For any_ request for daily views data, the returned array SHALL contain exactly 7 entries, one for each of the last 7 days.
**Validates: Requirements 2.1**

### Property 5: Indonesian Day Names

_For any_ date in the daily views data, the dayName SHALL be one of: "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min".
**Validates: Requirements 2.4**

### Property 6: Hourly Traffic Buckets

_For any_ hourly traffic data, each hour value SHALL be in 24-hour format (00, 01, ..., 23).
**Validates: Requirements 3.1, 3.3**

### Property 7: Category Sum Equals Total

_For any_ category distribution data, the sum of all category values SHALL equal the total published articles count.
**Validates: Requirements 4.1**

### Property 8: Device Percentages Sum

_For any_ device distribution data, the sum of all percentages SHALL equal 100 (within rounding tolerance).
**Validates: Requirements 5.1**

### Property 9: Popular Articles Ordering

_For any_ list of popular articles, each article's views_count SHALL be greater than or equal to the next article's views_count.
**Validates: Requirements 6.1**

### Property 10: Recent Articles Ordering

_For any_ list of recent articles, each article's created_at SHALL be greater than or equal to the next article's created_at.
**Validates: Requirements 7.1**

### Property 11: Activity Log User Names

_For any_ activity log entry, the user_name field SHALL be non-null and non-empty string.
**Validates: Requirements 8.4**

## Error Handling

1. **Database Connection Errors**

   - Return empty/default data with error flag
   - Display user-friendly error message
   - Provide retry button

2. **Empty Data States**

   - Show appropriate empty state messages
   - For device data: use default distribution
   - For activity: show "Belum ada aktivitas"

3. **RLS Permission Errors**
   - Handle gracefully without breaking UI
   - Log error for debugging

## Testing Strategy

### Unit Tests

- Test percentage change calculation function
- Test Indonesian day name conversion
- Test hour formatting function
- Test data transformation functions

### Property-Based Tests

- Use fast-check library for TypeScript
- Minimum 100 iterations per property test
- Tag format: **Feature: admin-dashboard-real-data, Property {number}: {property_text}**

### Integration Tests

- Test dashboard service functions with mock Supabase client
- Verify correct SQL queries are generated
- Test error handling scenarios
