# Requirements Document

## Introduction

Fitur ini menambahkan kemampuan kompresi dan cropping otomatis untuk gambar iklan berdasarkan slot type. Setiap slot iklan memiliki ukuran optimal yang berbeda, dan gambar yang diupload akan di-crop dan di-compress secara otomatis untuk memastikan kualitas tetap tajam dengan ukuran file yang optimal.

## Glossary

- **Ad_Image_Cropper**: Komponen dialog untuk crop gambar iklan dengan ukuran preset berdasarkan slot type
- **Slot_Type**: Tipe posisi iklan (in_article, homepage_hero, post_article, popup)
- **Aspect_Ratio**: Rasio lebar:tinggi gambar
- **Compression**: Proses mengurangi ukuran file gambar dengan tetap menjaga kualitas visual
- **Optimal_Size**: Ukuran gambar yang direkomendasikan untuk setiap slot type

## Requirements

### Requirement 1: Slot-Specific Image Dimensions

**User Story:** As an admin, I want uploaded ad images to be automatically cropped to the correct dimensions for each slot type, so that ads display properly across all placements.

#### Acceptance Criteria

1. WHEN an admin selects "in_article" slot type, THE Ad_Image_Cropper SHALL enforce a 300x250 pixel dimension (aspect ratio 6:5)
2. WHEN an admin selects "homepage_hero" slot type, THE Ad_Image_Cropper SHALL enforce a 728x90 pixel dimension for desktop (aspect ratio 8:1) or 970x250 (aspect ratio ~4:1)
3. WHEN an admin selects "post_article" slot type, THE Ad_Image_Cropper SHALL enforce a 728x90 pixel dimension (aspect ratio 8:1)
4. WHEN an admin selects "popup" slot type, THE Ad_Image_Cropper SHALL enforce a 500x400 pixel dimension (aspect ratio 5:4)

### Requirement 2: Automatic Image Compression

**User Story:** As an admin, I want uploaded images to be automatically compressed to optimal file sizes, so that ads load quickly without sacrificing visual quality.

#### Acceptance Criteria

1. WHEN an image is cropped, THE System SHALL compress it to JPEG format with 85% quality
2. WHEN the compressed image exceeds 500KB, THE System SHALL further reduce quality to achieve target size
3. THE System SHALL maintain image sharpness by using high-quality image smoothing during resize
4. WHEN compression is complete, THE System SHALL display the final file size to the admin

### Requirement 3: Cropper UI Integration

**User Story:** As an admin, I want a visual cropping interface that shows me the exact dimensions for my selected slot type, so that I can position the ad content correctly.

#### Acceptance Criteria

1. WHEN an admin uploads an image in the ad form, THE System SHALL automatically open the cropper dialog
2. THE Ad_Image_Cropper SHALL display the target dimensions and slot type name prominently
3. THE Ad_Image_Cropper SHALL show a preview of how the cropped image will look
4. WHEN the slot type changes, THE Ad_Image_Cropper SHALL update the crop area to match the new dimensions
5. THE Ad_Image_Cropper SHALL prevent saving if the source image is smaller than the target dimensions

### Requirement 4: Responsive Size Handling

**User Story:** As an admin, I want the system to handle both desktop and mobile ad sizes, so that ads look good on all devices.

#### Acceptance Criteria

1. FOR homepage_hero slot, THE System SHALL allow admin to choose between desktop (728x90) and large (970x250) sizes
2. THE System SHALL store the cropped image at the selected optimal resolution
3. WHEN displaying ads, THE System SHALL use CSS to scale images responsively while maintaining aspect ratio
