# Design Document: Ad Image Cropper

## Overview

Fitur ini menambahkan komponen AdImageCropper yang terintegrasi dengan form tambah/edit iklan di admin panel. Komponen ini akan otomatis menentukan ukuran crop berdasarkan slot type yang dipilih, melakukan kompresi gambar, dan memastikan output sesuai dengan dimensi optimal untuk setiap posisi iklan.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AdsManagementClient                       │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Slot Selector  │───▶│      AdImageCropper Dialog      │ │
│  └─────────────────┘    │  ┌─────────────────────────────┐│ │
│                         │  │   Slot Dimension Config     ││ │
│  ┌─────────────────┐    │  │   - in_article: 300x250     ││ │
│  │  Image Upload   │───▶│  │   - homepage_hero: 728x90   ││ │
│  └─────────────────┘    │  │   - post_article: 728x90    ││ │
│                         │  │   - popup: 500x400          ││ │
│                         │  └─────────────────────────────┘│ │
│                         │  ┌─────────────────────────────┐│ │
│                         │  │   ReactCrop Component       ││ │
│                         │  │   (locked aspect ratio)     ││ │
│                         │  └─────────────────────────────┘│ │
│                         │  ┌─────────────────────────────┐│ │
│                         │  │   Image Compressor          ││ │
│                         │  │   - Resize to target        ││ │
│                         │  │   - JPEG 85% quality        ││ │
│                         │  │   - Max 500KB               ││ │
│                         │  └─────────────────────────────┘│ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. AdImageCropper Component

```typescript
interface AdImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  slotType: AdSlotType;
  onCropComplete: (croppedBlob: Blob, fileSize: number) => void;
}
```

### 2. Slot Dimension Configuration

```typescript
interface SlotDimension {
  width: number;
  height: number;
  aspectRatio: number;
  label: string;
}

const AD_SLOT_DIMENSIONS: Record<AdSlotType, SlotDimension[]> = {
  in_article: [
    { width: 300, height: 250, aspectRatio: 6 / 5, label: "300x250" },
  ],
  homepage_hero: [
    {
      width: 728,
      height: 90,
      aspectRatio: 728 / 90,
      label: "728x90 (Desktop)",
    },
    {
      width: 970,
      height: 250,
      aspectRatio: 970 / 250,
      label: "970x250 (Large)",
    },
  ],
  post_article: [
    { width: 728, height: 90, aspectRatio: 728 / 90, label: "728x90" },
  ],
  popup: [{ width: 500, height: 400, aspectRatio: 5 / 4, label: "500x400" }],
};
```

### 3. Image Compression Utility

```typescript
interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  fileSize: number;
}

async function compressAndResizeImage(
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  maxFileSize: number = 500 * 1024 // 500KB
): Promise<CompressionResult>;
```

## Data Models

### Updated AD_SLOT_CONFIGS in types/ads.ts

```typescript
export interface AdSlotConfig {
  type: AdSlotType;
  label: string;
  description: string;
  dimensions: SlotDimension[];
  desktopSize: string;
  mobileSize: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Slot Type Dimension Mapping

_For any_ valid slot type, the AD_SLOT_DIMENSIONS configuration SHALL return a non-empty array of valid dimensions with positive width, height, and aspect ratio values.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Aspect Ratio Consistency

_For any_ slot dimension configuration, the aspect ratio SHALL equal width divided by height (within floating point tolerance).

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 3: Compression File Size Limit

_For any_ image processed through the compressor with maxFileSize parameter, the output blob size SHALL be less than or equal to maxFileSize.

**Validates: Requirements 2.2**

### Property 4: Output Dimension Accuracy

_For any_ cropped and resized image, the output dimensions SHALL match the selected target dimensions exactly.

**Validates: Requirements 4.2**

### Property 5: Minimum Source Size Validation

_For any_ source image with dimensions smaller than the target slot dimensions, the cropper SHALL prevent the crop operation and return an error.

**Validates: Requirements 3.5**

## Error Handling

1. **Source Image Too Small**: Display error message "Gambar terlalu kecil. Minimal {width}x{height} pixel untuk slot ini."
2. **Compression Failure**: Retry with lower quality, if still fails show error "Gagal mengkompresi gambar"
3. **Invalid File Type**: Only accept image/\* MIME types
4. **Canvas Context Error**: Fallback to original image with warning

## Testing Strategy

### Unit Tests

- Test AD_SLOT_DIMENSIONS configuration values
- Test aspect ratio calculations
- Test compression quality reduction logic

### Property-Based Tests

- Use fast-check library for TypeScript
- Generate random slot types and verify dimension mappings
- Generate random image sizes and verify compression output
- Minimum 100 iterations per property test

### Integration Tests

- Test full flow: upload → crop → compress → save
- Test slot type change updates crop area
- Test validation prevents small images
