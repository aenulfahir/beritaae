# Implementation Plan: Supabase Backend Architecture

## Overview

This implementation plan outlines the step-by-step tasks to build a Supabase-based backend for the News Portal application. The implementation follows a bottom-up approach: starting with database schema and migrations, then adding authentication, storage, RLS policies, and finally integrating with the frontend.

## Tasks

- [x] 1. Set up Supabase project and dependencies

  - [x] 1.1 Install Supabase dependencies

    - Install `@supabase/supabase-js` and `@supabase/ssr` packages
    - Install `fast-check` and `vitest` for testing
    - _Requirements: 10.1_

  - [x] 1.2 Configure environment variables

    - Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Add `.env.local` to `.gitignore` if not already present
    - _Requirements: 10.1_

  - [x] 1.3 Create Supabase client utilities
    - Create `src/lib/supabase/client.ts` for browser client
    - Create `src/lib/supabase/server.ts` for server-side client
    - _Requirements: 10.1, 10.3_

- [x] 2. Create database schema and migrations

  - [x] 2.1 Create custom types and extensions migration

    - Create migration file for UUID extension and custom enums (user_role, article_status)
    - _Requirements: 1.1, 3.1_

  - [x] 2.2 Create profiles table migration

    - Create profiles table with all fields and foreign key to auth.users
    - Add indexes for performance
    - _Requirements: 1.1, 1.3_

  - [x] 2.3 Create categories table migration

    - Create categories table with unique constraints on name and slug
    - _Requirements: 2.1, 2.2_

  - [x] 2.4 Create articles table migration

    - Create articles table with foreign keys to categories and profiles
    - Add indexes for category_id, author_id, status, published_at, and slug
    - _Requirements: 3.1, 3.2_

  - [x] 2.5 Create comments and comment_likes tables migration
    - Create comments table with self-referencing parent_id for nested comments
    - Create comment_likes junction table
    - Add indexes for article_id, user_id, and parent_id
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Create database functions and triggers

  - [x] 3.1 Create profile auto-creation trigger

    - Create `handle_new_user()` function
    - Create trigger on auth.users for new user signup
    - _Requirements: 1.2, 1.4, 11.1_

  - [ ]\* 3.2 Write property test for profile auto-creation

    - **Property 1: Profile Auto-Creation on User Signup**
    - **Validates: Requirements 1.2, 1.4, 6.3, 11.1**

  - [x] 3.3 Create updated_at trigger function

    - Create `update_updated_at()` function
    - Apply trigger to profiles, categories, articles, and comments tables
    - _Requirements: 11.4_

  - [ ]\* 3.4 Write property test for updated_at trigger

    - **Property 18: Updated_at Timestamp Trigger**
    - **Validates: Requirements 11.4**

  - [x] 3.5 Create utility functions

    - Create `increment_view_count()` function
    - Create `toggle_comment_like()` function
    - Create `generate_slug()` function
    - Create `get_user_role()` helper function
    - _Requirements: 11.2, 11.3, 11.5_

  - [ ]\* 3.6 Write property tests for utility functions
    - **Property 5: Slug Generation Consistency**
    - **Property 16: View Count Increment**
    - **Property 17: Comment Like Toggle**
    - **Validates: Requirements 3.3, 11.2, 11.3, 11.5**

- [x] 4. Checkpoint - Verify database schema

  - Ensure all migrations run successfully
  - Verify tables, functions, and triggers are created
  - Ask the user if questions arise

- [x] 5. Implement Row Level Security policies

  - [x] 5.1 Create RLS policies for profiles table

    - Enable RLS on profiles
    - Create SELECT policy (public read)
    - Create UPDATE policy (own profile only, admin can update roles)
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 5.2 Create RLS policies for categories table

    - Enable RLS on categories
    - Create SELECT policy (public read)
    - Create INSERT/UPDATE/DELETE policies (admin only)
    - _Requirements: 9.4, 9.5_

  - [x] 5.3 Create RLS policies for articles table

    - Enable RLS on articles
    - Create SELECT policy (published for all, drafts for author/admin/editor)
    - Create INSERT policy (admin/editor/author)
    - Create UPDATE policy (own articles for author, any for admin/editor)
    - Create DELETE policy (admin only)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 5.4 Create RLS policies for comments table

    - Enable RLS on comments and comment_likes
    - Create SELECT policy (approved for all, own for author)
    - Create INSERT policy (authenticated only)
    - Create UPDATE/DELETE policies (own comments, admin/editor can modify any)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]\* 5.5 Write property tests for RLS policies
    - **Property 11: Article RLS - Public Read Access**
    - **Property 12: Article RLS - Write Access**
    - **Property 13: Comment RLS - Read Access**
    - **Property 14: Comment RLS - Write Access**
    - **Property 15: Profile and Category RLS**
    - **Validates: Requirements 7.1-7.7, 8.1-8.6, 9.1-9.5**

- [x] 6. Configure Supabase Storage

  - [x] 6.1 Create storage buckets

    - Create 'article-thumbnails' bucket with public access
    - Create 'user-avatars' bucket with public access
    - _Requirements: 5.1, 5.2_

  - [x] 6.2 Create storage policies

    - Create read policies for public access
    - Create upload policies for article-thumbnails (author/editor/admin)
    - Create upload policies for user-avatars (own folder only)
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [ ]\* 6.3 Write property tests for storage policies
    - **Property 9: Storage Public Read Access**
    - **Property 10: Storage Upload Authorization**
    - **Validates: Requirements 5.3, 5.4, 5.5, 5.6**

- [x] 7. Checkpoint - Verify RLS and Storage

  - Test RLS policies with different user roles
  - Test storage upload/download permissions
  - Ask the user if questions arise

- [x] 8. Create TypeScript type definitions

  - [x] 8.1 Generate Supabase types

    - Create `src/types/supabase.ts` with Database type definition
    - Include Row, Insert, and Update types for all tables
    - _Requirements: 10.2_

  - [x] 8.2 Create domain types
    - Update `src/types/index.ts` with types that match Supabase schema
    - Ensure backward compatibility with existing components
    - _Requirements: 10.2_

- [x] 9. Implement authentication

  - [x] 9.1 Create AuthProvider component

    - Create `src/components/providers/AuthProvider.tsx`
    - Implement auth context with user, profile, and loading state
    - Implement signIn, signUp, signInWithOAuth, and signOut methods
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 9.2 Create auth middleware

    - Create middleware for protected routes
    - Handle session refresh and redirect logic
    - _Requirements: 6.4, 6.5_

  - [x] 9.3 Update login and register pages
    - Update `src/app/login/page.tsx` to use Supabase Auth
    - Update `src/app/register/page.tsx` to use Supabase Auth
    - Add OAuth buttons for Google and GitHub
    - _Requirements: 6.1, 6.2_

- [x] 10. Implement data services

  - [x] 10.1 Create article service

    - Create `src/lib/supabase/services/articles.ts`
    - Implement getPublishedArticles, getArticleBySlug, getFeaturedArticles
    - Implement getBreakingNews, getTrendingArticles, incrementViewCount
    - Implement createArticle, updateArticle, deleteArticle for admin
    - _Requirements: 10.5_

  - [x] 10.2 Create comment service

    - Create `src/lib/supabase/services/comments.ts`
    - Implement getArticleComments with nested replies
    - Implement createComment, updateComment, deleteComment
    - Implement likeComment, unlikeComment
    - Implement subscribeToComments for real-time updates
    - _Requirements: 10.4, 10.5_

  - [x] 10.3 Create storage service

    - Create `src/lib/supabase/services/storage.ts`
    - Implement uploadArticleImage, uploadAvatar
    - Implement deleteImage, getPublicUrl
    - _Requirements: 10.5_

  - [x] 10.4 Create category and profile services
    - Create `src/lib/supabase/services/categories.ts`
    - Create `src/lib/supabase/services/profiles.ts`
    - Implement CRUD operations
    - _Requirements: 2.3, 10.5_

- [x] 11. Checkpoint - Verify services

  - Test all service methods work correctly
  - Verify real-time subscriptions work
  - Ask the user if questions arise

- [x] 12. Integrate with frontend components

  - [x] 12.1 Update home page data fetching

    - Update `src/app/page.tsx` to fetch from Supabase
    - Replace mock data imports with service calls
    - _Requirements: 10.5_

  - [x] 12.2 Update news detail page

    - Update `src/app/news/[slug]/page.tsx` to fetch from Supabase
    - Implement view count increment on page load
    - _Requirements: 10.5, 11.2_

  - [x] 12.3 Update CommentSection component

    - Update `src/components/news/CommentSection.tsx` to use Supabase
    - Implement real-time comment updates
    - Add authentication check for posting comments
    - _Requirements: 8.3, 10.4, 10.5_

  - [x] 12.4 Update category pages
    - Update `src/app/category/[slug]/page.tsx` to fetch from Supabase
    - _Requirements: 10.5_

- [x] 13. Update admin pages

  - [x] 13.1 Update admin articles management

    - Update `src/app/admin/articles/page.tsx` to use Supabase
    - Update article creation and editing pages
    - Implement image upload for article thumbnails
    - _Requirements: 5.6, 7.4, 7.5, 10.5_

  - [x] 13.2 Update admin categories management

    - Update `src/app/admin/categories/page.tsx` to use Supabase
    - _Requirements: 9.5, 10.5_

  - [x] 13.3 Update admin comments management

    - Update `src/app/admin/comments/page.tsx` to use Supabase
    - Implement comment approval functionality
    - _Requirements: 8.6, 10.5_

  - [ ] 13.4 Update admin users management
    - Update user management pages to use Supabase
    - Implement role management for admins
    - _Requirements: 9.3, 10.5_

- [x] 14. Create seed data migration

  - [x] 14.1 Create categories seed migration

    - Create migration to seed existing category data
    - Ensure idempotency (safe to run multiple times)
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]\* 14.2 Write property test for migration idempotency
    - **Property 19: Migration Idempotency**
    - **Validates: Requirements 12.2**

- [x] 15. Create error handling utilities

  - [x] 15.1 Create error handler
    - Create `src/lib/supabase/error-handler.ts`
    - Map Supabase error codes to user-friendly messages
    - _Requirements: 10.5_

- [x] 16. Final checkpoint - End-to-end verification
  - Verify all pages work with Supabase backend
  - Test authentication flow end-to-end
  - Test article CRUD operations
  - Test comment functionality with real-time updates
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout for type safety
- Supabase migrations should be version controlled in `supabase/migrations/` directory
