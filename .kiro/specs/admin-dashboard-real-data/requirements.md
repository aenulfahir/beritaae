# Requirements Document

## Introduction

Fitur ini mengubah Admin Dashboard dari menggunakan mock data menjadi data real dari Supabase. Dashboard akan menampilkan statistik real-time termasuk total artikel, total views, komentar, pengguna, views overview, traffic harian, distribusi kategori, distribusi perangkat, artikel populer, artikel terbaru, dan aktivitas terbaru.

## Glossary

- **Dashboard**: Halaman utama admin yang menampilkan ringkasan statistik portal berita
- **Analytics_Service**: Service layer yang mengambil data analytics dari Supabase
- **Views_Count**: Total jumlah views dari semua artikel (sum dari views_count di tabel articles)
- **Traffic_Data**: Data kunjungan berdasarkan waktu dari tabel page_views
- **Device_Distribution**: Distribusi pengunjung berdasarkan jenis perangkat (mobile, desktop, tablet)
- **Category_Distribution**: Distribusi artikel berdasarkan kategori
- **Admin_Activity**: Log aktivitas admin dari tabel admin_activity_log

## Requirements

### Requirement 1: Dashboard Statistics Cards

**User Story:** As an admin, I want to see real statistics on the dashboard, so that I can monitor the portal's performance accurately.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL display total articles count from the articles table
2. WHEN the dashboard loads, THE Dashboard SHALL display total views as sum of views_count from all published articles
3. WHEN the dashboard loads, THE Dashboard SHALL display total comments count from the comments table
4. WHEN the dashboard loads, THE Dashboard SHALL display total users count from the profiles table
5. WHEN statistics are displayed, THE Dashboard SHALL show percentage change compared to previous week

### Requirement 2: Views Overview Chart

**User Story:** As an admin, I want to see views trend over the last 7 days, so that I can understand traffic patterns.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch daily views data for the last 7 days
2. WHEN views data is available, THE Dashboard SHALL display an area chart showing daily views
3. IF no analytics data exists, THEN THE Dashboard SHALL calculate views from page_views table grouped by date
4. WHEN displaying the chart, THE Dashboard SHALL show day names in Indonesian (Sen, Sel, Rab, etc.)

### Requirement 3: Daily Traffic Chart

**User Story:** As an admin, I want to see hourly traffic distribution, so that I can understand peak hours.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch page views grouped by hour for today
2. WHEN traffic data is available, THE Dashboard SHALL display a line chart showing hourly traffic
3. WHEN displaying the chart, THE Dashboard SHALL show hours in 24-hour format (00:00, 03:00, etc.)

### Requirement 4: Category Distribution Chart

**User Story:** As an admin, I want to see article distribution by category, so that I can understand content balance.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch article count per category
2. WHEN category data is available, THE Dashboard SHALL display a pie chart with category colors
3. WHEN displaying the chart, THE Dashboard SHALL show category name and article count

### Requirement 5: Device Distribution Chart

**User Story:** As an admin, I want to see visitor device distribution, so that I can optimize for the right platforms.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch device type distribution from page_views
2. WHEN device data is available, THE Dashboard SHALL display a pie chart showing mobile, desktop, tablet percentages
3. IF no device data exists, THEN THE Dashboard SHALL show default distribution (Mobile 60%, Desktop 30%, Tablet 10%)

### Requirement 6: Popular Articles List

**User Story:** As an admin, I want to see top performing articles, so that I can understand what content resonates.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch top 5 articles ordered by views_count descending
2. WHEN displaying articles, THE Dashboard SHALL show rank number, thumbnail, title, and view count
3. WHEN an article is clicked, THE Dashboard SHALL navigate to the article edit page

### Requirement 7: Recent Articles List

**User Story:** As an admin, I want to see recently published articles, so that I can track new content.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch 5 most recent articles ordered by created_at descending
2. WHEN displaying articles, THE Dashboard SHALL show thumbnail, title, category badge, and relative time
3. WHEN displaying articles, THE Dashboard SHALL show breaking news badge if is_breaking is true

### Requirement 8: Recent Activity Feed

**User Story:** As an admin, I want to see recent admin activities, so that I can track team actions.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Dashboard SHALL fetch recent entries from admin_activity_log
2. WHEN activity data is available, THE Dashboard SHALL show action, target, user name, and relative time
3. IF no activity log exists, THEN THE Dashboard SHALL show "Belum ada aktivitas" message
4. WHEN displaying activity, THE Dashboard SHALL join with profiles table to get user full_name

### Requirement 9: Loading States

**User Story:** As an admin, I want to see loading indicators while data is being fetched, so that I know the dashboard is working.

#### Acceptance Criteria

1. WHILE data is being fetched, THE Dashboard SHALL display skeleton loaders for each section
2. WHEN data fetch fails, THE Dashboard SHALL display error message with retry option
3. WHEN data is successfully loaded, THE Dashboard SHALL hide loading indicators

### Requirement 10: Data Refresh

**User Story:** As an admin, I want the dashboard to show fresh data, so that I can see current statistics.

#### Acceptance Criteria

1. WHEN the dashboard page is visited, THE Dashboard SHALL fetch fresh data from Supabase
2. THE Dashboard SHALL cache data in component state to prevent unnecessary refetches during the session
