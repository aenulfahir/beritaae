import { createClient } from "../client";

function getSupabase() {
  return createClient();
}

// =====================================================
// Company Profile
// =====================================================

export interface CompanyProfile {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  founded_year?: number;
  logo_url?: string;
  favicon_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  email_editorial?: string;
  email_complaints?: string;
}

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("company_profile") as any)
    .select("*")
    .single();

  if (error) return null;
  return data;
}

export async function updateCompanyProfile(
  id: string,
  updates: Partial<CompanyProfile>
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("company_profile") as any)
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating company profile:", error);
    return false;
  }
  return true;
}

// =====================================================
// Team Members
// =====================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
}

export async function getTeamMembers(
  activeOnly: boolean = true
): Promise<TeamMember[]> {
  const supabase = getSupabase();
  let query = (supabase.from("team_members") as any)
    .select("*")
    .order("display_order", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
  return data || [];
}

export async function createTeamMember(
  member: Omit<TeamMember, "id">
): Promise<TeamMember | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("team_members") as any)
    .insert(member)
    .select()
    .single();

  if (error) {
    console.error("Error creating team member:", error);
    return null;
  }
  return data;
}

export async function updateTeamMember(
  id: string,
  updates: Partial<TeamMember>
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("team_members") as any)
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating team member:", error);
    return false;
  }
  return true;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("team_members") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    return false;
  }
  return true;
}

// =====================================================
// Job Listings
// =====================================================

export interface JobListing {
  id: string;
  title: string;
  department?: string;
  location?: string;
  job_type?: string;
  level?: string;
  salary_range?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  applicants_count: number;
  created_at: string;
  expires_at?: string;
}

export async function getJobListings(
  activeOnly: boolean = true
): Promise<JobListing[]> {
  const supabase = getSupabase();
  let query = (supabase.from("job_listings") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching job listings:", error);
    return [];
  }
  return data || [];
}

export async function getJobListing(id: string): Promise<JobListing | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("job_listings") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createJobListing(
  job: Omit<JobListing, "id" | "applicants_count" | "created_at">
): Promise<JobListing | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("job_listings") as any)
    .insert(job)
    .select()
    .single();

  if (error) {
    console.error("Error creating job listing:", error);
    return null;
  }
  return data;
}

export async function updateJobListing(
  id: string,
  updates: Partial<JobListing>
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("job_listings") as any)
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating job listing:", error);
    return false;
  }
  return true;
}

export async function deleteJobListing(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("job_listings") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting job listing:", error);
    return false;
  }
  return true;
}

// =====================================================
// Job Applications
// =====================================================

export interface JobApplication {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  cover_letter?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string;
  created_at: string;
  job?: JobListing;
}

export async function getJobApplications(
  jobId?: string
): Promise<JobApplication[]> {
  const supabase = getSupabase();
  let query = (supabase.from("job_applications") as any)
    .select(
      `
      *,
      job:job_listings (*)
    `
    )
    .order("created_at", { ascending: false });

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching job applications:", error);
    return [];
  }
  return data || [];
}

export async function submitJobApplication(
  application: Omit<JobApplication, "id" | "status" | "created_at" | "job">
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("job_applications") as any).insert(
    application
  );

  if (error) {
    console.error("Error submitting job application:", error);
    return false;
  }

  // Increment applicants count
  await (supabase.rpc as any)("increment_applicants_count", {
    job_id: application.job_id,
  });

  return true;
}

export async function updateApplicationStatus(
  id: string,
  status: JobApplication["status"],
  notes?: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("job_applications") as any)
    .update({ status, notes })
    .eq("id", id);

  if (error) {
    console.error("Error updating application status:", error);
    return false;
  }
  return true;
}

// =====================================================
// Ad Placements
// =====================================================

export interface AdPlacement {
  id: string;
  name: string;
  position: string;
  size?: string;
  price_monthly?: number;
  price_weekly?: number;
  price_daily?: number;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export async function getAdPlacements(
  activeOnly: boolean = true
): Promise<AdPlacement[]> {
  const supabase = getSupabase();
  let query = (supabase.from("ad_placements") as any)
    .select("*")
    .order("display_order", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching ad placements:", error);
    return [];
  }
  return data || [];
}

export async function createAdPlacement(
  placement: Omit<AdPlacement, "id">
): Promise<AdPlacement | null> {
  const supabase = getSupabase();
  const { data, error } = await (supabase.from("ad_placements") as any)
    .insert(placement)
    .select()
    .single();

  if (error) {
    console.error("Error creating ad placement:", error);
    return null;
  }
  return data;
}

export async function updateAdPlacement(
  id: string,
  updates: Partial<AdPlacement>
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await (supabase.from("ad_placements") as any)
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating ad placement:", error);
    return false;
  }
  return true;
}

// =====================================================
// Advertisements
// =====================================================

export interface Advertisement {
  id: string;
  placement_id: string;
  advertiser_name: string;
  advertiser_email?: string;
  advertiser_phone?: string;
  image_url: string;
  target_url: string;
  alt_text?: string;
  impressions: number;
  clicks: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
  placement?: AdPlacement;
}

export async function getActiveAdvertisements(
  position?: string
): Promise<Advertisement[]> {
  const supabase = getSupabase();
  let query = (supabase.from("advertisements") as any)
    .select(
      `
      *,
      placement:ad_placements (*)
    `
    )
    .eq("is_active", true)
    .lte("start_date", new Date().toISOString().split("T")[0])
    .gte("end_date", new Date().toISOString().split("T")[0]);

  if (position) {
    query = query.eq("placement.position", position);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching advertisements:", error);
    return [];
  }
  return data || [];
}

export async function trackAdImpression(adId: string): Promise<void> {
  const supabase = getSupabase();
  await (supabase.rpc as any)("increment_ad_impressions", { ad_id: adId });
}

export async function trackAdClick(adId: string): Promise<void> {
  const supabase = getSupabase();
  await (supabase.rpc as any)("increment_ad_clicks", { ad_id: adId });
}
