import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

// Check if we're in build/prerender phase
const isBuildTime =
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support multiple key naming conventions
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, return a mock client that won't throw
  if (!supabaseUrl || !supabaseKey) {
    // Only log in non-build scenarios
    if (process.env.NODE_ENV !== "production") {
      console.error("[Supabase Server] Missing environment variables");
    }
    // Return a minimal mock for build-time static generation
    // This allows pages to build without actual Supabase connection
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

// Mock client for build-time static generation
function createMockClient() {
  const mockResponse = { data: null, error: null };
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => mockQuery(),
    update: () => mockQuery(),
    delete: () => mockQuery(),
    eq: () => mockQuery(),
    neq: () => mockQuery(),
    gt: () => mockQuery(),
    gte: () => mockQuery(),
    lt: () => mockQuery(),
    lte: () => mockQuery(),
    like: () => mockQuery(),
    ilike: () => mockQuery(),
    is: () => mockQuery(),
    in: () => mockQuery(),
    contains: () => mockQuery(),
    containedBy: () => mockQuery(),
    range: () => mockQuery(),
    order: () => mockQuery(),
    limit: () => mockQuery(),
    single: () => Promise.resolve(mockResponse),
    maybeSingle: () => Promise.resolve(mockResponse),
    then: (resolve: (value: typeof mockResponse) => void) =>
      Promise.resolve(mockResponse).then(resolve),
  });

  const mockStorage = {
    from: () => ({
      list: () => Promise.resolve({ data: [], error: null }),
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      remove: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  };

  const mockAuth = {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  };

  return {
    from: () => mockQuery(),
    storage: mockStorage,
    auth: mockAuth,
    rpc: () => Promise.resolve(mockResponse),
  } as unknown as ReturnType<typeof createServerClient<Database>>;
}
