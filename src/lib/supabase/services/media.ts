import { createClient } from "../client";
import { SupabaseClient } from "@supabase/supabase-js";

// Create fresh client for each operation to ensure auth token is current
function getSupabase(): SupabaseClient {
  return createClient();
}

export interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  size: number;
  url: string;
  bucket: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaStats {
  total: number;
  images: number;
  videos: number;
  documents: number;
  totalSize: number;
}

// Determine file type from mime type or extension
function getFileType(name: string, mimeType?: string): MediaFile["type"] {
  const ext = name.split(".").pop()?.toLowerCase() || "";

  if (mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    )
      return "document";
  }

  // Fallback to extension
  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
  const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
  const audioExts = ["mp3", "wav", "ogg", "m4a", "flac"];
  const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  if (audioExts.includes(ext)) return "audio";
  if (docExts.includes(ext)) return "document";

  return "document";
}

// Get public URL for a file
export function getMediaPublicUrl(bucket: string, path: string): string {
  const supabase = getSupabase();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// List all media files from storage buckets
export async function listMediaFiles(bucket?: string): Promise<MediaFile[]> {
  const supabase = getSupabase();
  const buckets = bucket ? [bucket] : ["media", "article-thumbnails"];
  const allFiles: MediaFile[] = [];

  for (const bucketName of buckets) {
    try {
      const { data, error } = await supabase.storage.from(bucketName).list("", {
        limit: 500,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        console.error(`Error listing files from ${bucketName}:`, error);
        continue;
      }

      if (data) {
        for (const file of data) {
          // Skip folders (they have no size or metadata)
          if (!file.metadata || file.id === null) continue;

          const fileType = getFileType(file.name, file.metadata?.mimetype);
          const publicUrl = getMediaPublicUrl(bucketName, file.name);

          allFiles.push({
            id: file.id || `${bucketName}-${file.name}`,
            name: file.name,
            type: fileType,
            size: file.metadata?.size || 0,
            url: publicUrl,
            bucket: bucketName,
            path: file.name,
            createdAt: file.created_at || new Date().toISOString(),
            updatedAt:
              file.updated_at || file.created_at || new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`Error accessing bucket ${bucketName}:`, err);
    }
  }

  // Sort by created date descending
  return allFiles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Get media statistics
export async function getMediaStats(): Promise<MediaStats> {
  const files = await listMediaFiles();

  return {
    total: files.length,
    images: files.filter((f) => f.type === "image").length,
    videos: files.filter((f) => f.type === "video").length,
    documents: files.filter((f) => f.type === "document" || f.type === "audio")
      .length,
    totalSize: files.reduce((acc, f) => acc + f.size, 0),
  };
}

// Upload media file
export async function uploadMediaFile(
  file: File,
  folder?: string
): Promise<MediaFile | null> {
  const supabase = getSupabase();

  const fileExt = file.name.split(".").pop();
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = folder
    ? `${folder}/${timestamp}-${sanitizedName}`
    : `${timestamp}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from("media")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading media file:", error);
    return null;
  }

  const publicUrl = getMediaPublicUrl("media", data.path);
  const fileType = getFileType(file.name, file.type);

  return {
    id: data.id || `media-${data.path}`,
    name: file.name,
    type: fileType,
    size: file.size,
    url: publicUrl,
    bucket: "media",
    path: data.path,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Delete media file
export async function deleteMediaFile(
  bucket: string,
  path: string
): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Error deleting media file:", error);
    return false;
  }

  return true;
}

// Delete multiple media files
export async function deleteMediaFiles(
  files: { bucket: string; path: string }[]
): Promise<boolean> {
  const supabase = getSupabase();

  // Group files by bucket
  const filesByBucket = files.reduce((acc, file) => {
    if (!acc[file.bucket]) acc[file.bucket] = [];
    acc[file.bucket].push(file.path);
    return acc;
  }, {} as Record<string, string[]>);

  let success = true;

  for (const [bucket, paths] of Object.entries(filesByBucket)) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error(`Error deleting files from ${bucket}:`, error);
      success = false;
    }
  }

  return success;
}

// Copy URL to clipboard (utility function)
export function copyMediaUrl(url: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(url)
    .then(() => true)
    .catch(() => false);
}
