import { createClient } from "@/lib/supabase/client";
import {
  Ad,
  AdSlotType,
  AdCreateInput,
  AdUpdateInput,
  AdWithStats,
  VALID_SLOT_TYPES,
} from "@/types/ads";

// Validate slot type
export function isValidSlotType(slotType: string): slotType is AdSlotType {
  return VALID_SLOT_TYPES.includes(slotType as AdSlotType);
}

// Calculate CTR (Click-Through Rate)
export function calculateCTR(impressions: number, clicks: number): number {
  if (impressions <= 0) return 0;
  return Number(((clicks / impressions) * 100).toFixed(2));
}

// Check if ad is currently active based on dates
export function isAdActive(ad: Ad): boolean {
  if (!ad.is_active) return false;
  const now = new Date();
  const startDate = new Date(ad.start_date);
  const endDate = new Date(ad.end_date);
  return now >= startDate && now <= endDate;
}

// Get active ad for a specific slot (client-side)
export async function getActiveAdForSlot(
  slotType: AdSlotType
): Promise<Ad | null> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("slot_type", slotType)
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching ad:", error);
    return null;
  }

  return data as Ad | null;
}

// Get all ads (admin)
export async function getAllAds(): Promise<AdWithStats[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ads:", error);
    return [];
  }

  // Add CTR calculation to each ad
  return (data || []).map((ad) => ({
    ...ad,
    ctr: calculateCTR(ad.impressions, ad.clicks),
  })) as AdWithStats[];
}

// Create new ad
export async function createAd(input: AdCreateInput): Promise<Ad | null> {
  if (!isValidSlotType(input.slot_type)) {
    console.error("Invalid slot type:", input.slot_type);
    return null;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .insert({
      title: input.title,
      image_url: input.image_url,
      target_url: input.target_url,
      slot_type: input.slot_type,
      start_date: input.start_date,
      end_date: input.end_date,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating ad:", error);
    return null;
  }

  return data as Ad;
}

// Update ad
export async function updateAd(
  id: string,
  input: AdUpdateInput
): Promise<Ad | null> {
  if (input.slot_type && !isValidSlotType(input.slot_type)) {
    console.error("Invalid slot type:", input.slot_type);
    return null;
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ad:", error);
    return null;
  }

  return data as Ad;
}

// Delete ad
export async function deleteAd(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from("ads").delete().eq("id", id);

  if (error) {
    console.error("Error deleting ad:", error);
    return false;
  }

  return true;
}

// Track impression (using RPC for atomic increment)
export async function trackImpression(adId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_ad_impressions", {
    ad_id: adId,
  });

  if (error) {
    console.error("Error tracking impression:", error);
  }
}

// Track click (using RPC for atomic increment)
export async function trackClick(adId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_ad_clicks", {
    ad_id: adId,
  });

  if (error) {
    console.error("Error tracking click:", error);
  }
}

// Get ad by ID
export async function getAdById(id: string): Promise<Ad | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching ad:", error);
    return null;
  }

  return data as Ad;
}

// Toggle ad active status
export async function toggleAdStatus(id: string): Promise<Ad | null> {
  const supabase = createClient();

  // First get current status
  const { data: currentAd, error: fetchError } = await supabase
    .from("ads")
    .select("is_active")
    .eq("id", id)
    .single();

  if (fetchError || !currentAd) {
    console.error("Error fetching ad status:", fetchError);
    return null;
  }

  // Toggle status
  const { data, error } = await supabase
    .from("ads")
    .update({ is_active: !currentAd.is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling ad status:", error);
    return null;
  }

  return data as Ad;
}
