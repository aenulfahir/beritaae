import { createClient } from "../client";
import { Category } from "@/types";

function getSupabase() {
  return createClient();
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Admin functions
export async function createCategory(data: {
  name: string;
  slug: string;
  color?: string;
  description?: string;
}): Promise<Category | null> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: category, error } = await (supabase as any)
      .from("categories")
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return null;
    }

    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    color: string;
    description: string;
  }>
): Promise<Category | null> {
  const supabase = getSupabase();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: category, error } = await (supabase as any)
      .from("categories")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return null;
    }

    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}
