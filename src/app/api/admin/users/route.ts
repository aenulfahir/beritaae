import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Update user role
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { userId, action, value } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    let updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (action === "role") {
      updateData.role = value;
    } else if (action === "status") {
      updateData.status = value;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in user update API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
