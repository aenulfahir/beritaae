# Requirements Document

## Introduction

Sistem penempatan iklan premium untuk website berita dengan pendekatan "less is more" - hanya 4 slot iklan strategis yang memberikan nilai tinggi bagi advertiser tanpa mengganggu pengalaman pembaca. Sistem ini mencakup komponen display iklan, data management, dan tracking dasar.

## Glossary

- **Ad_Slot**: Lokasi spesifik di website untuk menampilkan iklan
- **Ad_Banner**: Konten iklan yang ditampilkan (gambar, link, teks)
- **Sidebar_Sticky_Ad**: Iklan di sidebar kanan yang mengikuti scroll user
- **In_Article_Ad**: Iklan yang ditempatkan di tengah konten artikel
- **Homepage_Hero_Sponsor**: Iklan sponsor di area hero homepage
- **Post_Article_Ad**: Iklan setelah artikel selesai, sebelum komentar
- **Impression**: Satu kali iklan ditampilkan ke user
- **Click**: User mengklik iklan

## Requirements

### Requirement 1: Ad Slot Display

**User Story:** As a website visitor, I want to see relevant ads in designated locations, so that I can discover products/services while reading news without being overwhelmed.

#### Acceptance Criteria

1. THE Ad_Display_System SHALL render ads only in 4 designated premium slots: Sidebar_Sticky_Ad, In_Article_Ad, Homepage_Hero_Sponsor, Post_Article_Ad
2. WHEN a page loads, THE Ad_Display_System SHALL fetch and display active ads for that page's slots
3. WHEN no active ad exists for a slot, THE Ad_Display_System SHALL hide the slot gracefully without breaking layout
4. THE Sidebar_Sticky_Ad SHALL remain visible while user scrolls through article content
5. THE In_Article_Ad SHALL be placed after the 3rd paragraph of article content
6. THE Homepage_Hero_Sponsor SHALL display prominently in the hero section with "Sponsored" label
7. THE Post_Article_Ad SHALL appear between article end and comment section

### Requirement 2: Ad Data Management

**User Story:** As an admin, I want to manage ad placements through the admin panel, so that I can control which ads appear where and when.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide interface to create, edit, and delete ad banners
2. WHEN creating an ad, THE Admin_Panel SHALL require: title, image_url, target_url, slot_type, start_date, end_date
3. THE Admin_Panel SHALL allow setting ad status (active/inactive)
4. WHEN an ad's end_date passes, THE Ad_System SHALL automatically stop displaying it
5. THE Admin_Panel SHALL show list of all ads with their current status and performance metrics

### Requirement 3: Ad Tracking

**User Story:** As an advertiser, I want to see how my ads perform, so that I can evaluate the value of my ad placement.

#### Acceptance Criteria

1. WHEN an ad is displayed, THE Tracking_System SHALL record an impression
2. WHEN a user clicks an ad, THE Tracking_System SHALL record a click before redirecting
3. THE Admin_Panel SHALL display impression and click counts for each ad
4. THE Admin_Panel SHALL calculate and display CTR (Click-Through Rate) for each ad

### Requirement 4: Responsive Ad Display

**User Story:** As a mobile user, I want ads to display properly on my device, so that they don't break the reading experience.

#### Acceptance Criteria

1. THE Ad_Display_System SHALL render ads responsively based on device viewport
2. WHEN on mobile devices, THE Sidebar_Sticky_Ad SHALL move to inline position within content
3. THE In_Article_Ad SHALL maintain proper aspect ratio across all screen sizes
4. THE Homepage_Hero_Sponsor SHALL adapt its size for mobile without losing visibility

### Requirement 5: Dummy Data Seeding

**User Story:** As a developer, I want sample ad data available, so that I can test and demonstrate the ad system functionality.

#### Acceptance Criteria

1. THE Seed_System SHALL create sample ads for each of the 4 slot types
2. THE Seed_System SHALL include realistic placeholder images and URLs
3. THE Seed_System SHALL set varied date ranges to demonstrate active/inactive states
4. THE Seed_System SHALL include sample impression and click data for demonstration
