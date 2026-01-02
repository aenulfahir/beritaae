import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

// Singleton instance for browser client
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

// Check if we're in build/prerender phase (no env vars available)
const isBuildTime = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !supabaseUrl || !supabaseKey;
};

export function createClient() {
  // Return existing client if available
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Support multiple key naming conventions
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build/SSR without env vars, return a mock client
  // This allows static page generation to complete
  if (!supabaseUrl || !supabaseKey) {
    // Only log once in development
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Supabase Client] Using mock client - env vars not available"
      );
    }
    return createMockBrowserClient();
  }

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return browserClient;
}

// Mock client for SSR/build-time
function createMockBrowserClient() {
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
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  };

  return {
    from: () => mockQuery(),
    storage: mockStorage,
    auth: mockAuth,
    rpc: () => Promise.resolve(mockResponse),
  } as unknown as ReturnType<typeof createBrowserClient<Database>>;
}
