# Implementation Plan: Article Engagement Real Data

## Overview

Implementasi sistem engagement artikel yang real dengan menyimpan likes/dislikes ke database Supabase dan menampilkan data real di halaman detail artikel.

## Tasks

- [x] 1. Create database migration for article_likes table

  - [x] 1.1 Create migration file `00032_article_likes.sql`
    - Create reaction_type enum ('like', 'dislike')
    - Create article_likes table with composite primary key
    - Add indexes for article_id and user_id
    - Add RLS policies for SELECT, INSERT, UPDATE, DELETE
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4, 6.5, 7.2_

- [x] 2. Create engagement service

  - [x] 2.1 Create `src/lib/supabase/services/engagement.ts`

    - Implement `getArticleEngagement()` function to fetch likes count, dislikes count, comments count, trending rank, and user reaction
    - Use single optimized query where possible
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.3, 5.1, 5.2, 7.1_

  - [x] 2.2 Implement `toggleArticleReaction()` function
    - Handle insert new reaction
    - Handle toggle off (delete) same reaction
    - Handle switch reaction type (update)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Create API route for reactions

  - [x] 3.1 Create `src/app/api/articles/[id]/reaction/route.ts`
    - POST handler for toggling reactions
    - Return updated counts after toggle
    - Handle authentication check
    - _Requirements: 3.1, 3.2, 3.5_

- [x] 4. Update article detail page

  - [x] 4.1 Update `src/app/news/[slug]/page.tsx`

    - Fetch engagement data server-side using getArticleEngagement
    - Pass engagement props to NewsDetailClient
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 5.1, 7.3_

  - [x] 4.2 Update `src/components/news/NewsDetailClient.tsx`
    - Accept engagement props and pass to ArticleActions
    - Display trending rank if available
    - _Requirements: 5.3, 5.4_

- [x] 5. Update ArticleActions component

  - [x] 5.1 Update `src/components/news/ArticleActions.tsx`
    - Remove hardcoded default values
    - Accept real engagement data as props
    - Implement API call for reaction toggle
    - Add optimistic updates for better UX
    - Handle login redirect for unauthenticated users
    - _Requirements: 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2_

- [x] 6. Checkpoint - Test the implementation

  - Run the application and verify:
    - Article detail page shows real likes/dislikes counts
    - Article detail page shows real comments count
    - Trending rank displays correctly
    - Like/dislike toggle works for logged-in users
    - Unauthenticated users are redirected to login
  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 7. Write property tests

  - [ ]\* 7.1 Write property test for reaction counts

    - **Property 1: Reaction Counts Match Database**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]\* 7.2 Write property test for unique reactions

    - **Property 2: Unique User Reaction Per Article**
    - **Validates: Requirements 1.2**

  - [ ]\* 7.3 Write property test for toggle behavior

    - **Property 3: Reaction Toggle Behavior**
    - **Validates: Requirements 3.3, 3.4**

  - [ ]\* 7.4 Write property test for comments count

    - **Property 4: Comments Count Accuracy**
    - **Validates: Requirements 4.1, 4.3**

  - [ ]\* 7.5 Write property test for trending rank
    - **Property 5: Trending Rank Calculation**
    - **Validates: Requirements 5.1, 5.2**

- [x] 8. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
