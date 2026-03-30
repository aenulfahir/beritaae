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
import { createClient, resetClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use ref to track last session token to prevent unnecessary updates
  const lastSessionTokenRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Memoize supabase client to prevent re-creation
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
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
          console.error("Error fetching profile:", error.message);
          return null;
        }

        return data as Profile;
      } catch (err) {
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

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      // Prevent double initialization
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        lastSessionTokenRef.current = initialSession?.access_token ?? null;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const profileData = await fetchProfile(initialSession.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
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

      // Handle INITIAL_SESSION - this fires first when page loads
      if (event === "INITIAL_SESSION") {
        lastSessionTokenRef.current = newToken;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) setProfile(profileData);
        }
        if (mounted) setIsLoading(false);
        return;
      }

      // For SIGNED_IN event (including OAuth), always process
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
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
        if (mounted) setIsLoading(false);
        return;
      }

      // Handle SIGNED_OUT
      if (event === "SIGNED_OUT") {
        lastSessionTokenRef.current = null;
        setSession(null);
        setUser(null);
        setProfile(null);
        if (mounted) setIsLoading(false);
        return;
      }

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

      if (mounted) setIsLoading(false);
    });

    // Fallback: ensure isLoading becomes false after 5 seconds max
    const loadingTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, [supabase, fetchProfile]);

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
      // Sign out from Supabase first
      await supabase.auth.signOut({ scope: "local" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // Always clear state regardless of signOut success
      setUser(null);
      setProfile(null);
      setSession(null);
      lastSessionTokenRef.current = null;
      resetClient();
      // Use window.location for a full page reload to clear all state
      window.location.href = "/";
    }
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      signIn,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
    }),
    [
      user,
      profile,
      session,
      isLoading,
      signIn,
      signUp,
      signInWithOAuth,
      signOut,
      refreshProfile,
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
