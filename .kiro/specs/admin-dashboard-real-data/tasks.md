# Implementation Plan: Admin Dashboard Real Data

## Overview

Implementasi Admin Dashboard dengan data real dari Supabase, menggantikan mock data yang ada saat ini.

## Tasks

- [x] 1. Create Dashboard Service

  - [x] 1.1 Create dashboard service file with TypeScript interfaces

    - Create `src/lib/supabase/services/dashboard.ts`
    - Define all interfaces (DashboardStats, DailyViewsData, HourlyTrafficData, etc.)
    - Use `getSupabase()` pattern for fresh auth tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 Implement getDashboardStats function

    - Fetch total articles count (published only)
    - Fetch total views as SUM(views_count)
    - Fetch total comments count (approved only)
    - Fetch total users count
    - Calculate percentage changes vs previous week
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.3 Implement getDailyViews function

    - Fetch page_views grouped by date for last 7 days
    - Convert dates to Indonesian day names (Sen, Sel, Rab, etc.)
    - Fill missing days with zero values
    - _Requirements: 2.1, 2.4_

  - [x] 1.4 Implement getHourlyTraffic function

    - Fetch page_views grouped by hour for today
    - Format hours in 24-hour format
    - Fill missing hours with zero values
    - _Requirements: 3.1, 3.3_

  - [x] 1.5 Implement getCategoryDistribution function

    - Fetch article count per category with category colors
    - Include categories with zero articles
    - _Requirements: 4.1_

  - [x] 1.6 Implement getDeviceDistribution function

    - Fetch device type distribution from page_views
    - Calculate percentages
    - Return default distribution if no data
    - _Requirements: 5.1, 5.3_

  - [x] 1.7 Implement getPopularArticles function

    - Fetch top 5 articles ordered by views_count DESC
    - Include id, title, slug, image_url, views_count
    - _Requirements: 6.1_

  - [x] 1.8 Implement getRecentArticles function

    - Fetch 5 most recent published articles
    - Join with categories for name and color
    - Include is_breaking flag
    - _Requirements: 7.1, 7.3_

  - [x] 1.9 Implement getRecentActivity function
    - Fetch recent admin_activity_log entries
    - Join with profiles for user full_name
    - Handle empty activity gracefully
    - _Requirements: 8.1, 8.4_

- [x] 2. Update Admin Dashboard Page

  - [x] 2.1 Add state management and data fetching

    - Add useState for all dashboard data
    - Add useEffect to fetch data on mount
    - Add loading and error states
    - _Requirements: 9.1, 9.2, 10.1_

  - [x] 2.2 Update StatCard components with real data

    - Replace mock dashboardStats with real stats
    - Display actual percentage changes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.3 Update Views Overview chart with real data

    - Replace mock viewsData with dailyViews
    - Ensure chart displays correctly
    - _Requirements: 2.1, 2.2_

  - [x] 2.4 Update Traffic chart with real data

    - Replace mock trafficData with hourlyTraffic
    - _Requirements: 3.1, 3.2_

  - [x] 2.5 Update Category chart with real data

    - Replace mock categoryData with real distribution
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.6 Update Device chart with real data

    - Replace mock deviceData with real distribution
    - _Requirements: 5.1, 5.2_

  - [x] 2.7 Update Popular Articles list with real data

    - Replace mock topArticles with popularArticles
    - _Requirements: 6.1, 6.2_

  - [x] 2.8 Update Recent Articles list with real data

    - Replace mock recentArticles with real data
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 2.9 Update Activity Feed with real data

    - Replace mock recentActivity with real data
    - Show empty state if no activity
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 2.10 Add loading skeletons
    - Add Skeleton components for each section
    - Show while data is loading
    - _Requirements: 9.1, 9.3_

- [x] 3. Checkpoint - Verify Dashboard Works
  - Ensure all data loads correctly
  - Test with empty database states
  - Verify charts render properly
  - Ask user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Use `getSupabase()` pattern instead of singleton for fresh auth tokens
- Handle RLS errors gracefully - admin should have access to all data
