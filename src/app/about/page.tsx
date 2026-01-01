import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Users,
  Award,
  Globe,
  Target,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { getPublicCompanyData } from "@/lib/supabase/services/admin-data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Tentang BeritaAE - Portal berita terdepan Indonesia dengan informasi terkini, akurat, dan terpercaya.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export default async function AboutPage() {
  const { profile, team } = await getPublicCompanyData();

  const stats = [
    { icon: Users, label: "Pembaca Aktif", value: "2.5M+" },
    { icon: Newspaper, label: "Artikel Terbit", value: "50K+" },
    { icon: Globe, label: "Jangkauan", value: "34 Provinsi" },
    { icon: TrendingUp, label: "Pertumbuhan", value: "150%" },
  ];

  const values = [
    {
      icon: Target,
      title: "Akurat",
      desc: "Setiap berita diverifikasi dengan standar jurnalistik tinggi",
    },
    {
      icon: Award,
      title: "Terpercaya",
      desc: "Menjunjung tinggi integritas dan independensi",
    },
    {
      icon: Globe,
      title: "Inklusif",
      desc: "Menjangkau seluruh lapisan masyarakat Indonesia",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="max-w-3xl">
              <Badge className="mb-4">Tentang Kami</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {profile?.tagline || "Menyajikan Berita"}{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Terkini & Terpercaya
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {profile?.description ||
                  "BeritaAE adalah portal berita digital terdepan di Indonesia yang berkomitmen menyajikan informasi akurat, cepat, dan berimbang untuk seluruh masyarakat Indonesia."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"
                  alt="Newsroom"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                    Didirikan {profile?.founded_year || 2020}
                  </Badge>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
                <div className="space-y-4 text-muted-foreground">
                  {profile?.history ? (
                    <p>{profile.history}</p>
                  ) : (
                    <>
                      <p>
                        BeritaAE lahir dari kebutuhan masyarakat Indonesia akan
                        sumber berita yang dapat diandalkan di era digital.
                        Didirikan pada tahun 2020, kami memulai perjalanan
                        dengan visi sederhana: menyajikan berita yang benar.
                      </p>
                      <p>
                        Dengan tim jurnalis berpengalaman dan teknologi terkini,
                        kami terus berinovasi dalam cara penyampaian berita.
                        Dari teks hingga multimedia interaktif, kami berkomitmen
                        memberikan pengalaman membaca terbaik.
                      </p>
                      <p>
                        Saat ini, BeritaAE telah menjadi salah satu portal
                        berita terbesar di Indonesia dengan jutaan pembaca setia
                        dari 34 provinsi.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      {(profile?.vision || profile?.mission) && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {profile?.vision && (
                <ScrollReveal>
                  <Card className="border-0 shadow-lg h-full">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-4">Visi</h3>
                      <p className="text-muted-foreground">{profile.vision}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
              {profile?.mission && (
                <ScrollReveal delay={0.1}>
                  <Card className="border-0 shadow-lg h-full">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-4">Misi</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {profile.mission}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Prinsip yang menjadi fondasi setiap karya jurnalistik kami
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Tim Redaksi</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Orang-orang hebat di balik setiap berita yang kami sajikan
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.slice(0, 8).map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 0.1}>
                  <div className="text-center group">
                    <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-background shadow-lg group-hover:ring-primary/20 transition-all">
                      {member.avatar_url ? (
                        <Image
                          src={member.avatar_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {profile && (profile.address || profile.phone || profile.email) && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {profile.address && (
                <ScrollReveal>
                  <Card className="border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Alamat</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {profile.address}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
              {profile.phone && (
                <ScrollReveal delay={0.1}>
                  <Card className="border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Telepon</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.phone}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
              {profile.email && (
                <ScrollReveal delay={0.2}>
                  <Card className="border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.email}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
