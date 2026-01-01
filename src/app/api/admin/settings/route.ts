import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch site settings
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("company_profile")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
        { error: "Gagal mengambil pengaturan" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET settings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { type, ...settings } = body;

    // Validate type
    if (!["branding", "contact", "social"].includes(type)) {
      return NextResponse.json(
        { error: "Tipe pengaturan tidak valid" },
        { status: 400 }
      );
    }

    // Build update object based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (type === "branding") {
      updateData = {
        ...updateData,
        name: settings.name,
        tagline: settings.tagline,
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
      };
    } else if (type === "contact") {
      updateData = {
        ...updateData,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        email_editorial: settings.email_editorial,
        email_complaints: settings.email_complaints,
      };
    } else if (type === "social") {
      updateData = {
        ...updateData,
        facebook_url: settings.facebook_url,
        twitter_url: settings.twitter_url,
        instagram_url: settings.instagram_url,
        youtube_url: settings.youtube_url,
        linkedin_url: settings.linkedin_url,
        tiktok_url: settings.tiktok_url,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("company_profile")
      .update(updateData)
      .not("id", "is", null);

    if (error) {
      console.error("Error updating settings:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan pengaturan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT settings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
