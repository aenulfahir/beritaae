import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

// Singleton instance for browser client
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

// Track if client is being initialized to prevent race conditions
let clientInitPromise: Promise<
  ReturnType<typeof createBrowserClient<Database>>
> | null = null;

export function createClient() {
  // Return existing client if available (singleton pattern)
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
        "[Supabase Client] Using mock client - env vars not available",
      );
    }
    return createMockBrowserClient();
  }

  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-client-info": "supabase-js-web",
      },
    },
    // Add connection retry settings
    db: {
      schema: "public",
    },
  });
  return browserClient;
}

// Helper to get client with session check - use this for authenticated operations
export async function getClientWithSession() {
  const client = createClient();

  // Ensure session is fresh
  try {
    const {
      data: { session },
      error,
    } = await client.auth.getSession();
    if (error) {
      console.warn("[Supabase] Session check error:", error.message);
    }
    return { client, session };
  } catch (err) {
    console.warn("[Supabase] Failed to check session:", err);
    return { client, session: null };
  }
}

// Helper for retrying failed requests
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 500,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
}

// Reset client (useful for logout or when session becomes invalid)
export function resetClient() {
  browserClient = null;
  clientInitPromise = null;
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
