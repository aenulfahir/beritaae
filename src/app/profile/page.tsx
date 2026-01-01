"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateProfile, uploadAvatar } from "@/lib/supabase/services/profiles";
import { compressImage, formatFileSize } from "@/lib/utils/image-compressor";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Camera,
  Loader2,
  CheckCircle2,
  LogOut,
  Settings,
  Bookmark,
  Bell,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Facebook,
  Link as LinkIcon,
  Calendar,
  Shield,
  ImageIcon,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const SOCIAL_PLATFORMS = [
  {
    key: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
  },
  {
    key: "twitter",
    label: "Twitter/X",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@channel",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/username",
  },
];

export default function ProfilePage() {
  const {
    user,
    profile,
    isLoading: authLoading,
    signOut,
    refreshProfile,
  } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<{
    original: number;
    compressed: number;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/profile");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setSocialLinks(profile.social_links || {});
    }
  }, [profile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Show compression info
    try {
      const compressed = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
      });
      setCompressionInfo({
        original: file.size,
        compressed: compressed.size,
      });
    } catch {
      // Ignore compression preview error
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploadingAvatar(true);
    setError(null);

    try {
      // Compress image
      const compressedBlob = await compressImage(selectedFile, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
      });

      // Upload to storage
      const { url, error: uploadError } = await uploadAvatar(
        user.id,
        compressedBlob,
        selectedFile.name
      );

      if (uploadError || !url) {
        setError(
          "Gagal mengupload foto. Pastikan storage bucket 'avatars' sudah dibuat."
        );
        setIsUploadingAvatar(false);
        return;
      }

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile(user.id, {
        avatar_url: url,
      });

      if (updateError) {
        setError("Gagal menyimpan foto profil");
        setIsUploadingAvatar(false);
        return;
      }

      // Refresh profile and clear preview
      await refreshProfile();
      setAvatarPreview(null);
      setSelectedFile(null);
      setCompressionInfo(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Terjadi kesalahan saat mengupload foto");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const cancelAvatarUpload = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSocialLinkChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Filter out empty social links
      const filteredSocialLinks = Object.fromEntries(
        Object.entries(socialLinks).filter(([, value]) => value.trim() !== "")
      );

      const { error: updateError } = await updateProfile(user.id, {
        full_name: fullName,
        bio,
        social_links: filteredSocialLinks,
      });

      if (updateError) {
        setError("Gagal menyimpan perubahan");
      } else {
        setSuccess(true);
        await refreshProfile();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "editor":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "author":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const activeSocialLinks = Object.entries(profile.social_links || {}).filter(
    ([, value]) => value && value.trim() !== ""
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 py-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <StaggerContainer className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <StaggerItem>
              <Card className="overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <CardContent className="p-6 -mt-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                        <AvatarImage
                          src={avatarPreview || profile.avatar_url || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {getInitials(profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        aria-label="Pilih foto profil"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-lg transition-all hover:scale-105"
                        title="Ubah foto profil"
                        aria-label="Ubah foto profil"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>

                    <h2 className="text-xl font-bold">
                      {profile.full_name || "User"}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                      {profile.email}
                    </p>
                    <Badge
                      variant="outline"
                      className={`${getRoleBadgeColor(
                        profile.role
                      )} capitalize`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role}
                    </Badge>

                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    {/* Social Links Display */}
                    {activeSocialLinks.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {activeSocialLinks.map(([key, value]) => {
                          const platform = SOCIAL_PLATFORMS.find(
                            (p) => p.key === key
                          );
                          const Icon = platform?.icon || LinkIcon;
                          return (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                              title={platform?.label || key}
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Quick Links */}
            <StaggerItem>
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Link
                      href="/saved"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                      <span>Artikel Tersimpan</span>
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Notifikasi</span>
                    </Link>
                    {(profile.role === "admin" ||
                      profile.role === "editor" ||
                      profile.role === "author") && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Dashboard Admin</span>
                      </Link>
                    )}
                    <Separator className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Account Stats */}
            <StaggerItem>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Informasi Akun
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member sejak</span>
                    <span className="ml-auto font-medium">
                      {new Date(profile.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar Upload Preview */}
            {avatarPreview && (
              <ScrollReveal>
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Image
                          src={avatarPreview}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Foto Baru Dipilih</h4>
                        {compressionInfo && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <ImageIcon className="h-3 w-3 inline mr-1" />
                            {formatFileSize(compressionInfo.original)} →{" "}
                            {formatFileSize(compressionInfo.compressed)}
                            <span className="text-green-600 ml-1">
                              (-
                              {Math.round(
                                (1 -
                                  compressionInfo.compressed /
                                    compressionInfo.original) *
                                  100
                              )}
                              %)
                            </span>
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAvatarUpload}
                            disabled={isUploadingAvatar}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Mengupload...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Foto
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelAvatarUpload}
                            disabled={isUploadingAvatar}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Batal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Success/Error Messages */}
            {error && (
              <ScrollReveal>
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              </ScrollReveal>
            )}

            {success && (
              <ScrollReveal>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Profil berhasil diperbarui
                </div>
              </ScrollReveal>
            )}

            {/* Edit Profile Tabs */}
            <StaggerItem>
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <CardHeader className="pb-0">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </TabsTrigger>
                      <TabsTrigger value="social">
                        <Globe className="h-4 w-4 mr-2" />
                        Sosial Media
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  <form onSubmit={handleSubmit}>
                    <CardContent className="pt-6">
                      <TabsContent value="profile" className="mt-0 space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              className="pl-10 h-11 bg-muted"
                              disabled
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Email tidak dapat diubah
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fullName">Nama Lengkap</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Nama lengkap Anda"
                              className="pl-10 h-11"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Ceritakan sedikit tentang diri Anda... (maks. 500 karakter)"
                            className="min-h-[120px] resize-none"
                            value={bio}
                            onChange={(e) =>
                              setBio(e.target.value.slice(0, 500))
                            }
                            disabled={isLoading}
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {bio.length}/500 karakter
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="social" className="mt-0 space-y-4">
                        <CardDescription className="mb-4">
                          Tambahkan link sosial media Anda agar pembaca dapat
                          terhubung dengan Anda.
                        </CardDescription>

                        {SOCIAL_PLATFORMS.map((platform) => {
                          const Icon = platform.icon;
                          return (
                            <div key={platform.key} className="space-y-2">
                              <Label
                                htmlFor={platform.key}
                                className="flex items-center gap-2"
                              >
                                <Icon className="h-4 w-4" />
                                {platform.label}
                              </Label>
                              <Input
                                id={platform.key}
                                type="url"
                                placeholder={platform.placeholder}
                                value={socialLinks[platform.key] || ""}
                                onChange={(e) =>
                                  handleSocialLinkChange(
                                    platform.key,
                                    e.target.value
                                  )
                                }
                                disabled={isLoading}
                                className="h-10"
                              />
                            </div>
                          );
                        })}
                      </TabsContent>
                    </CardContent>

                    <div className="px-6 pb-6">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Tabs>
              </Card>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </div>
  );
}
