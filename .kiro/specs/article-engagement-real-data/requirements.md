# Requirements Document

## Introduction

Fitur ini mengubah komponen engagement artikel (likes, dislikes, jumlah komentar, dan trending rank) dari menggunakan data hardcoded/mock menjadi data real dari Supabase. Saat ini, komponen ArticleActions menampilkan nilai default (142 likes, 8 dislikes, 24 komentar) yang tidak mencerminkan data sebenarnya. Fitur ini akan membuat tabel baru untuk menyimpan likes/dislikes artikel dan mengintegrasikan data real ke halaman detail artikel.

## Glossary

- **Article_Likes**: Tabel database untuk menyimpan reaksi pengguna (like/dislike) terhadap artikel
- **Article_Actions**: Komponen React yang menampilkan tombol like, dislike, komentar, simpan, dan bagikan
- **Likes_Count**: Jumlah total likes pada sebuah artikel
- **Dislikes_Count**: Jumlah total dislikes pada sebuah artikel
- **Comments_Count**: Jumlah komentar yang disetujui pada sebuah artikel
- **Trending_Rank**: Peringkat artikel berdasarkan popularitas (views, likes, comments)
- **User_Reaction**: Status reaksi pengguna terhadap artikel (like, dislike, atau null)

## Requirements

### Requirement 1: Database Schema - Article Likes

**User Story:** As a system administrator, I want a table to store article reactions, so that likes and dislikes are persisted.

#### Acceptance Criteria

1. THE Database SHALL create an `article_likes` table with fields: article_id (UUID, references articles), user_id (UUID, references profiles), reaction_type (enum: 'like', 'dislike'), created_at (timestamp)
2. THE Database SHALL enforce a composite primary key on (article_id, user_id) to prevent duplicate reactions
3. THE Database SHALL cascade delete reactions when the parent article is deleted
4. THE Database SHALL cascade delete reactions when the user profile is deleted

### Requirement 2: Article Likes Count Aggregation

**User Story:** As a reader, I want to see accurate like and dislike counts on articles, so that I can gauge community sentiment.

#### Acceptance Criteria

1. WHEN the article detail page loads, THE System SHALL fetch the count of likes (reaction_type = 'like') for that article
2. WHEN the article detail page loads, THE System SHALL fetch the count of dislikes (reaction_type = 'dislike') for that article
3. WHEN a user is logged in, THE System SHALL fetch the user's current reaction (if any) for that article
4. THE Article_Actions component SHALL display the real likes count instead of hardcoded value
5. THE Article_Actions component SHALL display the real dislikes count instead of hardcoded value

### Requirement 3: Like/Dislike Functionality

**User Story:** As a logged-in user, I want to like or dislike articles, so that I can express my opinion.

#### Acceptance Criteria

1. WHEN a logged-in user clicks the like button, THE System SHALL insert or update their reaction to 'like'
2. WHEN a logged-in user clicks the dislike button, THE System SHALL insert or update their reaction to 'dislike'
3. WHEN a user clicks the same reaction button again, THE System SHALL remove their reaction (toggle off)
4. WHEN a user changes from like to dislike (or vice versa), THE System SHALL update the reaction_type
5. IF a user is not logged in, THEN THE System SHALL redirect to login page when they try to react
6. WHEN a reaction is changed, THE Article_Actions component SHALL update the counts immediately (optimistic update)

### Requirement 4: Real Comments Count

**User Story:** As a reader, I want to see the actual number of comments on an article, so that I know how much discussion there is.

#### Acceptance Criteria

1. WHEN the article detail page loads, THE System SHALL count approved comments from the comments table for that article
2. THE Article_Actions component SHALL display the real comments count instead of hardcoded value
3. THE Comments count SHALL only include comments where is_approved = true

### Requirement 5: Trending Rank Display

**User Story:** As a reader, I want to see an article's trending rank, so that I know how popular it is.

#### Acceptance Criteria

1. WHEN the article detail page loads, THE System SHALL calculate the article's trending rank based on views_count
2. THE Trending rank SHALL be calculated by ordering all published articles by views_count descending
3. THE Article detail page SHALL display the trending rank (e.g., "#5 Trending")
4. IF the article is not in top 100, THEN THE System SHALL not display trending rank

### Requirement 6: Row Level Security - Article Likes

**User Story:** As a system architect, I want to secure article likes data, so that users can only manage their own reactions.

#### Acceptance Criteria

1. THE RLS_Policy SHALL allow everyone to SELECT article_likes (for counting)
2. THE RLS_Policy SHALL allow only authenticated users to INSERT their own reactions
3. THE RLS_Policy SHALL allow users to UPDATE only their own reactions
4. THE RLS_Policy SHALL allow users to DELETE only their own reactions
5. THE RLS_Policy SHALL allow users with 'admin' role to DELETE any reaction

### Requirement 7: Performance Optimization

**User Story:** As a user, I want the article page to load quickly, so that I can read content without delay.

#### Acceptance Criteria

1. THE System SHALL fetch likes count, dislikes count, comments count, and user reaction in a single database query where possible
2. THE Database SHALL have indexes on article_likes(article_id) and article_likes(user_id) for fast lookups
3. THE Article detail page SHALL load engagement data server-side to avoid loading spinners
