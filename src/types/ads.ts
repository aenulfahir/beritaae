// Ad Slot Types - 4 premium positions
export type AdSlotType =
  | "in_article"
  | "homepage_hero"
  | "post_article"
  | "popup";

// Valid slot types for validation
export const VALID_SLOT_TYPES: AdSlotType[] = [
  "in_article",
  "homepage_hero",
  "post_article",
  "popup",
];

// Slot dimension configuration for image cropping
export interface SlotDimension {
  width: number;
  height: number;
  aspectRatio: number;
  label: string;
}

// Optimal dimensions for each ad slot type
export const AD_SLOT_DIMENSIONS: Record<AdSlotType, SlotDimension[]> = {
  in_article: [
    { width: 300, height: 250, aspectRatio: 300 / 250, label: "300x250" },
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
  popup: [
    { width: 500, height: 400, aspectRatio: 500 / 400, label: "500x400" },
  ],
};

// Ad interface matching database schema
export interface Ad {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  slot_type: AdSlotType;
  is_active: boolean;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

// Input for creating new ad
export interface AdCreateInput {
  title: string;
  image_url: string;
  target_url: string;
  slot_type: AdSlotType;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

// Input for updating ad
export interface AdUpdateInput {
  title?: string;
  image_url?: string;
  target_url?: string;
  slot_type?: AdSlotType;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Ad with calculated CTR for admin display
export interface AdWithStats extends Ad {
  ctr: number; // Click-through rate percentage
}

// Slot configuration for display
export interface AdSlotConfig {
  type: AdSlotType;
  label: string;
  description: string;
  dimensions: SlotDimension[];
  desktopSize: string;
  mobileSize: string;
}

// Slot configurations
export const AD_SLOT_CONFIGS: Record<AdSlotType, AdSlotConfig> = {
  in_article: {
    type: "in_article",
    label: "In-Article",
    description: "Iklan di tengah artikel setelah paragraf ke-3",
    dimensions: AD_SLOT_DIMENSIONS.in_article,
    desktopSize: "300x250",
    mobileSize: "300x250",
  },
  homepage_hero: {
    type: "homepage_hero",
    label: "Homepage Hero",
    description: "Iklan sponsor di area hero homepage",
    dimensions: AD_SLOT_DIMENSIONS.homepage_hero,
    desktopSize: "728x90 atau 970x250",
    mobileSize: "320x100",
  },
  post_article: {
    type: "post_article",
    label: "Post-Article",
    description: "Iklan setelah artikel, sebelum komentar",
    dimensions: AD_SLOT_DIMENSIONS.post_article,
    desktopSize: "728x90",
    mobileSize: "320x100",
  },
  popup: {
    type: "popup",
    label: "Popup",
    description: "Iklan popup saat pertama kali akses beranda",
    dimensions: AD_SLOT_DIMENSIONS.popup,
    desktopSize: "500x400",
    mobileSize: "320x400",
  },
};
