"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import {
  createClient,
  resetClient,
  ensureSessionInitialized,
} from "@/lib/supabase/client";
import { Profile } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isReady: boolean; // New: indicates auth state is fully initialized
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (
    provider: "google" | "github",
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Use ref to track last session token to prevent unnecessary updates
  const lastSessionTokenRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Memoize supabase client to prevent re-creation
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string, retryCount = 0): Promise<Profile | null> => {
      const maxRetries = 3;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          // If profile doesn't exist, try to create it
          if (error.code === "PGRST116") {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { data: newProfile, error: createError } = await (
                supabase as any
              )
                .from("profiles")
                .insert({
                  id: user.id,
                  email: user.email,
                  full_name:
                    user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "User",
                  role: "member",
                })
                .select()
                .single();

              if (createError) {
                console.error("Error creating profile:", createError.message);
                return null;
              }
              return newProfile as Profile;
            }
          }

          // Retry on network/connection errors
          if (
            retryCount < maxRetries &&
            (error.message?.includes("network") ||
              error.message?.includes("fetch") ||
              error.message?.includes("Failed"))
          ) {
            await new Promise((resolve) =>
              setTimeout(resolve, 500 * (retryCount + 1)),
            );
            return fetchProfile(userId, retryCount + 1);
          }

          console.error("Error fetching profile:", error.message);
          return null;
        }

        return data as Profile;
      } catch (err) {
        // Retry on unexpected errors
        if (retryCount < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500 * (retryCount + 1)),
          );
          return fetchProfile(userId, retryCount + 1);
        }
        console.error("Exception fetching profile:", err);
        return null;
      }
    },
    [supabase],
  );

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  // Refresh session manually - useful when session might be stale
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn("[Auth] Session refresh error:", error.message);
        // If refresh fails, try to get current session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
        }
      } else if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        if (data.session.user) {
          const profileData = await fetchProfile(data.session.user.id);
          setProfile(profileData);
        }
      }
    } catch (err) {
      console.error("[Auth] Failed to refresh session:", err);
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      // Prevent double initialization
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      try {
        // Ensure session is initialized first
        await ensureSessionInitialized();

        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        // If session error, try to refresh
        if (sessionError) {
          console.warn("[Auth] Initial session error:", sessionError.message);
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData.session && mounted) {
            lastSessionTokenRef.current = refreshData.session.access_token;
            setSession(refreshData.session);
            setUser(refreshData.session.user);
            const profileData = await fetchProfile(refreshData.session.user.id);
            if (mounted) setProfile(profileData);
          }
        } else {
          lastSessionTokenRef.current = initialSession?.access_token ?? null;
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            const profileData = await fetchProfile(initialSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsReady(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      console.log("[Auth] State change:", event, currentSession?.user?.email);

      const newToken = currentSession?.access_token ?? null;

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          lastSessionTokenRef.current = newToken;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            // Small delay to allow database trigger to create profile
            await new Promise((resolve) => setTimeout(resolve, 500));
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
          setIsLoading(false);
          break;

        case "SIGNED_OUT":
          lastSessionTokenRef.current = null;
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          break;

        case "USER_UPDATED":
          if (currentSession?.user) {
            setUser(currentSession.user);
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) setProfile(profileData);
          }
          break;

        default:
          // Skip if token hasn't changed
          if (newToken === lastSessionTokenRef.current) {
            return;
          }

          lastSessionTokenRef.current = newToken;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          } else {
            setProfile(null);
          }

          setIsLoading(false);
      }
    });

    // Periodic session check to handle stale sessions
    const sessionCheckInterval = setInterval(async () => {
      if (!mounted) return;

      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        // If we have a user but session is invalid, try to refresh
        if (user && (!currentSession || error)) {
          console.log("[Auth] Session check: refreshing stale session");
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData.session && mounted) {
            setSession(refreshData.session);
            setUser(refreshData.session.user);
          } else if (mounted) {
            // Session truly expired, clear state
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.warn("[Auth] Session check error:", err);
      }
    }, 60000); // Check every minute

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [supabase, fetchProfile, user]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    [supabase],
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    },
    [supabase],
  );

  const signInWithOAuth = useCallback(
    async (provider: "google" | "github") => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      resetClient(); // Reset client to clear any stale state
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase, router]);

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      isReady,
      signIn,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
      refreshSession,
    }),
    [
      user,
      profile,
      session,
      isLoading,
      isReady,
      signIn,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
