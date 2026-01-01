import { PostgrestError, AuthError } from "@supabase/supabase-js";

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

// Map Supabase error codes to user-friendly messages
const errorMessages: Record<string, string> = {
  // Auth errors
  invalid_credentials: "Email atau password salah",
  email_not_confirmed: "Email belum dikonfirmasi. Silakan cek inbox Anda",
  user_not_found: "Pengguna tidak ditemukan",
  user_already_exists: "Email sudah terdaftar",
  weak_password: "Password terlalu lemah. Gunakan minimal 6 karakter",
  invalid_email: "Format email tidak valid",
  email_taken: "Email sudah digunakan",
  phone_taken: "Nomor telepon sudah digunakan",
  signup_disabled: "Pendaftaran sementara ditutup",
  session_expired: "Sesi telah berakhir. Silakan login kembali",
  invalid_token: "Token tidak valid atau sudah kadaluarsa",

  // Database errors
  "23505": "Data sudah ada. Tidak dapat membuat duplikat",
  "23503": "Data terkait tidak ditemukan",
  "23502": "Data wajib tidak boleh kosong",
  "42501": "Anda tidak memiliki izin untuk melakukan aksi ini",
  "42P01": "Tabel tidak ditemukan",
  PGRST116: "Data tidak ditemukan",
  PGRST301: "Terlalu banyak permintaan. Coba lagi nanti",

  // Storage errors
  "storage/object-not-found": "File tidak ditemukan",
  "storage/unauthorized": "Tidak memiliki izin untuk mengakses file",
  "storage/invalid-file-type": "Tipe file tidak didukung",
  "storage/file-too-large": "Ukuran file terlalu besar",

  // Network errors
  network_error: "Koneksi internet bermasalah. Periksa koneksi Anda",
  timeout: "Permintaan timeout. Coba lagi",

  // Default
  unknown: "Terjadi kesalahan. Silakan coba lagi",
};

export function handlePostgrestError(error: PostgrestError): AppError {
  const code = error.code || "unknown";
  const message =
    errorMessages[code] || error.message || errorMessages["unknown"];

  return {
    code,
    message,
    details: error.details || error.hint,
  };
}

export function handleAuthError(error: AuthError): AppError {
  // Extract error code from message or status
  let code = "unknown";

  if (error.message.includes("Invalid login credentials")) {
    code = "invalid_credentials";
  } else if (error.message.includes("Email not confirmed")) {
    code = "email_not_confirmed";
  } else if (error.message.includes("User not found")) {
    code = "user_not_found";
  } else if (error.message.includes("User already registered")) {
    code = "user_already_exists";
  } else if (error.message.includes("Password should be")) {
    code = "weak_password";
  } else if (error.message.includes("Invalid email")) {
    code = "invalid_email";
  } else if (
    error.message.includes("session_expired") ||
    error.message.includes("JWT expired")
  ) {
    code = "session_expired";
  }

  const message =
    errorMessages[code] || error.message || errorMessages["unknown"];

  return {
    code,
    message,
  };
}

export function handleStorageError(error: Error): AppError {
  let code = "unknown";

  if (error.message.includes("not found")) {
    code = "storage/object-not-found";
  } else if (
    error.message.includes("unauthorized") ||
    error.message.includes("permission")
  ) {
    code = "storage/unauthorized";
  } else if (error.message.includes("file type")) {
    code = "storage/invalid-file-type";
  } else if (
    error.message.includes("too large") ||
    error.message.includes("size")
  ) {
    code = "storage/file-too-large";
  }

  const message =
    errorMessages[code] || error.message || errorMessages["unknown"];

  return {
    code,
    message,
  };
}

export function handleNetworkError(error: Error): AppError {
  let code = "network_error";

  if (error.message.includes("timeout")) {
    code = "timeout";
  }

  return {
    code,
    message: errorMessages[code],
  };
}

// Generic error handler
export function handleError(error: unknown): AppError {
  if (!error) {
    return { code: "unknown", message: errorMessages["unknown"] };
  }

  // PostgrestError
  if (
    typeof error === "object" &&
    "code" in error &&
    "message" in error &&
    "details" in error
  ) {
    return handlePostgrestError(error as PostgrestError);
  }

  // AuthError
  if (typeof error === "object" && "status" in error && "message" in error) {
    return handleAuthError(error as AuthError);
  }

  // Standard Error
  if (error instanceof Error) {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return handleNetworkError(error);
    }
    return {
      code: "unknown",
      message: error.message || errorMessages["unknown"],
    };
  }

  // String error
  if (typeof error === "string") {
    return {
      code: "unknown",
      message: error,
    };
  }

  return { code: "unknown", message: errorMessages["unknown"] };
}

// Toast-friendly error message
export function getErrorMessage(error: unknown): string {
  return handleError(error).message;
}

// Check if error is a specific type
export function isAuthError(error: unknown): boolean {
  const appError = handleError(error);
  return [
    "invalid_credentials",
    "email_not_confirmed",
    "user_not_found",
    "user_already_exists",
    "weak_password",
    "invalid_email",
    "session_expired",
    "invalid_token",
  ].includes(appError.code);
}

export function isPermissionError(error: unknown): boolean {
  const appError = handleError(error);
  return appError.code === "42501" || appError.code === "storage/unauthorized";
}

export function isNotFoundError(error: unknown): boolean {
  const appError = handleError(error);
  return (
    appError.code === "PGRST116" || appError.code === "storage/object-not-found"
  );
}

export function isDuplicateError(error: unknown): boolean {
  const appError = handleError(error);
  return appError.code === "23505";
}
