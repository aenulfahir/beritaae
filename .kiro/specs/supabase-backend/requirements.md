# Requirements Document

## Introduction

This document defines the requirements for implementing a backend architecture for the News Portal application using Supabase. The system will replace the current mock data with a production-ready backend utilizing Supabase PostgreSQL database, Supabase Auth for authentication, Supabase Storage for media files, and Row Level Security (RLS) policies for data protection. No external backend server will be used - all data operations will be performed directly from the frontend using the Supabase JS Client.

## Glossary

- **Supabase_Client**: The Supabase JavaScript client library used for all database operations, authentication, and storage access from the frontend
- **RLS**: Row Level Security - PostgreSQL feature that restricts which rows users can access based on policies
- **User**: A registered member of the news portal who can read articles and post comments
- **Admin**: A user with elevated privileges who can manage all content and users
- **Editor**: A user who can create, edit, and publish articles
- **Author**: A user who can create and edit their own articles
- **Article**: A news article with title, content, slug, category, and metadata
- **Category**: A classification for organizing articles (e.g., Politik, Ekonomi, Teknologi)
- **Comment**: User-generated feedback on articles
- **Storage_Bucket**: A Supabase Storage container for organizing uploaded files
- **Profile**: Extended user information stored separately from auth.users

## Requirements

### Requirement 1: Database Schema - Users and Profiles

**User Story:** As a system administrator, I want a proper user management schema, so that user data is organized and secure.

#### Acceptance Criteria

1. THE Supabase_Client SHALL create a `profiles` table linked to `auth.users` with fields: id (UUID, references auth.users), email, full_name, avatar_url, role (enum: 'member', 'author', 'editor', 'admin'), bio, social_links (JSONB), created_at, updated_at
2. WHEN a new user registers via Supabase Auth, THE Database SHALL automatically create a corresponding profile record via database trigger
3. THE Database SHALL enforce that profile.id references auth.users.id with ON DELETE CASCADE
4. THE Database SHALL set default role to 'member' for new profiles

### Requirement 2: Database Schema - Categories

**User Story:** As a content manager, I want to organize articles into categories, so that readers can easily find content by topic.

#### Acceptance Criteria

1. THE Database SHALL create a `categories` table with fields: id (UUID), name (text, unique), slug (text, unique), color (text), description (text), created_at, updated_at
2. THE Database SHALL enforce unique constraints on category name and slug
3. THE Supabase_Client SHALL support CRUD operations on categories for admin users

### Requirement 3: Database Schema - Articles

**User Story:** As an editor, I want to create and manage news articles, so that readers can access current news content.

#### Acceptance Criteria

1. THE Database SHALL create an `articles` table with fields: id (UUID), title (text), slug (text, unique), excerpt (text), content (text), image_url (text), category_id (UUID, references categories), author_id (UUID, references profiles), status (enum: 'draft', 'published', 'archived'), is_breaking (boolean), is_featured (boolean), views_count (integer), read_time (text), published_at (timestamp), created_at, updated_at
2. THE Database SHALL enforce foreign key constraints for category_id and author_id
3. THE Database SHALL automatically generate slug from title if not provided
4. WHEN an article is published, THE Database SHALL set published_at to current timestamp if not already set

### Requirement 4: Database Schema - Comments

**User Story:** As a reader, I want to comment on articles, so that I can engage with the content and community.

#### Acceptance Criteria

1. THE Database SHALL create a `comments` table with fields: id (UUID), article_id (UUID, references articles), user_id (UUID, references profiles), parent_id (UUID, nullable, references comments for replies), content (text), likes_count (integer), is_approved (boolean), created_at, updated_at
2. THE Database SHALL support nested comments via self-referencing parent_id
3. THE Database SHALL cascade delete comments when parent article is deleted
4. THE Database SHALL set is_approved to false by default for moderation

### Requirement 5: Supabase Storage Configuration

**User Story:** As a content creator, I want to upload images for articles and user avatars, so that the portal has rich visual content.

#### Acceptance Criteria

1. THE Supabase_Storage SHALL create a bucket named 'article-thumbnails' for article images
2. THE Supabase_Storage SHALL create a bucket named 'user-avatars' for profile pictures
3. THE Storage_Bucket 'article-thumbnails' SHALL allow public read access
4. THE Storage_Bucket 'user-avatars' SHALL allow public read access
5. WHEN a user uploads to 'user-avatars', THE Storage SHALL only allow authenticated users to upload to their own folder
6. WHEN a user uploads to 'article-thumbnails', THE Storage SHALL only allow users with 'author', 'editor', or 'admin' role

### Requirement 6: Supabase Authentication

**User Story:** As a user, I want to register and login securely, so that I can access personalized features.

#### Acceptance Criteria

1. THE Supabase_Auth SHALL support email/password authentication
2. THE Supabase_Auth SHALL support OAuth providers (Google, GitHub)
3. WHEN a user registers, THE System SHALL create a profile with default 'member' role
4. THE Supabase_Client SHALL provide methods for login, logout, password reset, and session management
5. THE Supabase_Auth SHALL enforce email verification for new registrations

### Requirement 7: Row Level Security - Articles

**User Story:** As a system architect, I want to secure article data access, so that only authorized users can modify content.

#### Acceptance Criteria

1. THE RLS_Policy SHALL allow everyone (including anonymous) to SELECT articles WHERE status = 'published'
2. THE RLS_Policy SHALL allow users with 'admin' or 'editor' role to SELECT all articles regardless of status
3. THE RLS_Policy SHALL allow users with 'author' role to SELECT their own articles regardless of status
4. THE RLS_Policy SHALL allow only users with 'admin' or 'editor' role to INSERT new articles
5. THE RLS_Policy SHALL allow users with 'admin' or 'editor' role to UPDATE any article
6. THE RLS_Policy SHALL allow users with 'author' role to UPDATE only their own articles
7. THE RLS_Policy SHALL allow only users with 'admin' role to DELETE articles

### Requirement 8: Row Level Security - Comments

**User Story:** As a system architect, I want to secure comment data access, so that users can only manage their own comments.

#### Acceptance Criteria

1. THE RLS_Policy SHALL allow everyone to SELECT comments WHERE is_approved = true
2. THE RLS_Policy SHALL allow authenticated users to SELECT their own comments regardless of approval status
3. THE RLS_Policy SHALL allow only authenticated users to INSERT comments
4. THE RLS_Policy SHALL allow users to UPDATE only their own comments
5. THE RLS_Policy SHALL allow users to DELETE only their own comments
6. THE RLS_Policy SHALL allow users with 'admin' or 'editor' role to UPDATE and DELETE any comment

### Requirement 9: Row Level Security - Profiles and Categories

**User Story:** As a system architect, I want to secure profile and category data, so that user information is protected.

#### Acceptance Criteria

1. THE RLS_Policy SHALL allow everyone to SELECT profiles (public profile information)
2. THE RLS_Policy SHALL allow users to UPDATE only their own profile
3. THE RLS_Policy SHALL allow only users with 'admin' role to UPDATE any profile's role field
4. THE RLS_Policy SHALL allow everyone to SELECT categories
5. THE RLS_Policy SHALL allow only users with 'admin' role to INSERT, UPDATE, or DELETE categories

### Requirement 10: Supabase Client Integration

**User Story:** As a developer, I want a configured Supabase client, so that the frontend can interact with the backend services.

#### Acceptance Criteria

1. THE Supabase_Client SHALL be initialized with project URL and anon key from environment variables
2. THE Supabase_Client SHALL provide typed interfaces for all database tables
3. THE Supabase_Client SHALL handle authentication state and session persistence
4. THE Supabase_Client SHALL provide real-time subscription capabilities for comments
5. THE Supabase_Client SHALL provide helper functions for common operations (fetch articles, post comment, upload image)

### Requirement 11: Database Functions and Triggers

**User Story:** As a system architect, I want automated database operations, so that data integrity is maintained.

#### Acceptance Criteria

1. THE Database SHALL create a trigger to auto-create profile on user signup
2. THE Database SHALL create a function to increment article views_count
3. THE Database SHALL create a function to increment/decrement comment likes_count
4. THE Database SHALL create a trigger to update updated_at timestamp on record modification
5. THE Database SHALL create a function to generate unique slugs from titles

### Requirement 12: Data Migration

**User Story:** As a developer, I want to migrate existing mock data, so that the application has initial content.

#### Acceptance Criteria

1. THE Migration_Script SHALL seed the categories table with existing category data
2. THE Migration_Script SHALL be idempotent (safe to run multiple times)
3. THE Migration_Script SHALL use Supabase migrations for version control
