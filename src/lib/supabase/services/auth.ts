import { createClient } from "@/lib/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

// Sign up with email and password
export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return {
    user: authData?.user ?? null,
    error,
  };
}

// Sign in with email and password
export async function signInWithEmail(data: SignInData): Promise<AuthResult> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return {
    user: authData?.user ?? null,
    error,
  };
}

// Sign in with OAuth provider
export async function signInWithOAuth(
  provider: "google" | "github"
): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { error };
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Get current session
export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Reset password
export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  return { error };
}

// Update password
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error };
}

// Update user email
export async function updateEmail(
  newEmail: string
): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  return { error };
}

// Resend confirmation email
export async function resendConfirmationEmail(
  email: string
): Promise<{ error: AuthError | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { error };
}
