import { createClient } from "../server";
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(
        "[categories-server] Error fetching categories:",
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[categories-server] Exception fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(
        "[categories-server] Error fetching category:",
        JSON.stringify(error, null, 2)
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error("[categories-server] Exception fetching category:", error);
    return null;
  }
}
