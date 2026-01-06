# Implementation Plan: Premium Ad Slots

## Overview

Implementasi sistem iklan premium dengan 4 slot strategis menggunakan Supabase untuk backend dan React components untuk frontend. Dimulai dengan database schema, lalu services, components, dan terakhir integrasi ke halaman.

## Tasks

- [x] 1. Setup Database Schema

  - [x] 1.1 Create ads table migration

    - Create migration file dengan schema untuk tabel ads
    - Include slot_type CHECK constraint untuk 4 valid types
    - Add indexes untuk efficient querying
    - _Requirements: 1.1, 2.2_

  - [x] 1.2 Create seed data migration
    - Create sample ads untuk setiap slot type
    - Include varied date ranges (active, expired, future)
    - Add sample impression/click data
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 2. Create TypeScript Types and Service

  - [x] 2.1 Create ads types

    - Define AdSlotType union type
    - Define Ad interface
    - Define AdCreateInput interface
    - _Requirements: 2.2_

  - [x] 2.2 Create ads service

    - Implement getActiveAdForSlot function
    - Implement getAllAds function
    - Implement createAd, updateAd, deleteAd functions
    - Implement trackImpression and trackClick functions
    - Implement calculateCTR helper
    - _Requirements: 1.2, 2.1, 2.4, 3.1, 3.2, 3.4_

  - [ ]\* 2.3 Write property test for active ad filtering

    - **Property 2: Active Ad Filtering**
    - **Validates: Requirements 1.2, 2.4**

  - [ ]\* 2.4 Write property test for CTR calculation
    - **Property 6: CTR Calculation**
    - **Validates: Requirements 3.4**

- [x] 3. Create Ad Display Components

  - [x] 3.1 Create base AdBanner component

    - Render ad image with link
    - Handle click tracking
    - Show loading/empty states
    - _Requirements: 1.2, 3.2_

  - [x] 3.2 Create SidebarStickyAd component

    - Sticky positioning for desktop
    - Inline positioning for mobile
    - _Requirements: 1.4, 4.2_

  - [x] 3.3 Create InArticleAd component

    - Logic to insert after 3rd paragraph
    - Responsive sizing
    - _Requirements: 1.5, 4.3_

  - [ ]\* 3.4 Write property test for in-article placement

    - **Property 3: In-Article Ad Placement**
    - **Validates: Requirements 1.5**

  - [x] 3.5 Create HomepageSponsorAd component

    - Display with "Sponsored" label
    - Responsive sizing for mobile
    - _Requirements: 1.6, 4.4_

  - [x] 3.6 Create PostArticleAd component
    - Placement styling
    - Responsive sizing
    - _Requirements: 1.7_

- [x] 4. Checkpoint - Verify Components

  - Ensure all ad components render correctly
  - Test responsive behavior
  - Ask the user if questions arise

- [x] 5. Integrate Ads into Pages

  - [x] 5.1 Add HomepageSponsorAd to homepage

    - Place in hero section area
    - Ensure proper spacing
    - _Requirements: 1.6_

  - [x] 5.2 Add SidebarStickyAd to article detail page

    - Add to right sidebar
    - Configure sticky behavior
    - _Requirements: 1.4_

  - [x] 5.3 Add InArticleAd to article content

    - Integrate with article content rendering
    - Handle articles with < 3 paragraphs
    - _Requirements: 1.5_

  - [x] 5.4 Add PostArticleAd to article detail page
    - Place between article end and comments
    - _Requirements: 1.7_

- [x] 6. Create Admin Panel for Ads

  - [x] 6.1 Create AdsClient component

    - List all ads with status
    - Show impressions, clicks, CTR
    - Add/Edit/Delete functionality
    - _Requirements: 2.1, 2.3, 2.5, 3.3, 3.4_

  - [x] 6.2 Create ad form modal

    - Form fields for all required inputs
    - Date pickers for start/end dates
    - Slot type selector
    - Image URL preview
    - _Requirements: 2.2_

  - [x] 6.3 Add ads page to admin routes
    - Create page at /admin/company/ads
    - Add navigation link
    - _Requirements: 2.1_

- [x] 7. Final Checkpoint
  - Ensure all tests pass
  - Verify ads display correctly on all pages
  - Verify admin panel functionality
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Using fast-check for property-based testing in TypeScript
