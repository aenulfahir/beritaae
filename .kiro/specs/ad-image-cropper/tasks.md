# Implementation Plan: Ad Image Cropper

## Overview

Implementasi fitur cropping dan kompresi gambar iklan berdasarkan slot type. Menggunakan react-image-crop yang sudah ada dan menambahkan konfigurasi dimensi per slot serta kompresi otomatis.

## Tasks

- [x] 1. Update Ad Types dengan Slot Dimensions

  - Tambahkan SlotDimension interface ke src/types/ads.ts
  - Tambahkan AD_SLOT_DIMENSIONS configuration
  - Update AD_SLOT_CONFIGS dengan dimensions array
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create AdImageCropper Component

  - [x] 2.1 Create base AdImageCropper component

    - Buat src/components/ads/AdImageCropper.tsx
    - Implement props interface (open, onClose, imageSrc, slotType, onCropComplete)
    - Use ReactCrop dengan locked aspect ratio berdasarkan slot
    - Display target dimensions dan slot name
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 2.2 Implement image compression utility

    - Add compressAndResizeImage function
    - Resize to exact target dimensions
    - JPEG compression dengan quality 85%
    - Auto-reduce quality jika > 500KB
    - Return blob dengan file size info
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.3 Add source image validation

    - Check source image dimensions vs target
    - Show error jika gambar terlalu kecil
    - Disable crop button jika invalid
    - _Requirements: 3.5_

  - [x] 2.4 Add size selector for homepage_hero
    - Dropdown untuk pilih 728x90 atau 970x250
    - Update crop area saat size berubah
    - _Requirements: 4.1_

- [x] 3. Integrate AdImageCropper into AdsManagementClient

  - [x] 3.1 Update image upload flow

    - Open AdImageCropper dialog setelah file dipilih
    - Pass current slot_type ke cropper
    - Handle onCropComplete untuk set image_url
    - _Requirements: 3.1_

  - [x] 3.2 Handle slot type changes

    - Reset image jika slot type berubah dan sudah ada gambar
    - Atau re-crop dengan dimensi baru
    - _Requirements: 3.4_

  - [x] 3.3 Display file size info
    - Show compressed file size setelah crop
    - Format ke KB/MB
    - _Requirements: 2.4_

- [x] 4. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 5. Write property tests

  - [ ]\* 5.1 Property test for slot dimension mapping

    - **Property 1: Slot Type Dimension Mapping**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

  - [ ]\* 5.2 Property test for aspect ratio consistency
    - **Property 2: Aspect Ratio Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 6. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Menggunakan react-image-crop yang sudah terinstall
- Komponen ImageCropper existing bisa dijadikan referensi
- Kompresi menggunakan canvas.toBlob dengan quality parameter
