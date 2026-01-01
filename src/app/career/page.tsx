import { Metadata } from "next";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Heart,
  Coffee,
  Laptop,
  GraduationCap,
  ArrowRight,
  Building2,
} from "lucide-react";
import { getPublicCareersData } from "@/lib/supabase/services/admin-data";

export const metadata: Metadata = {
  title: "Karir",
  description:
    "Bergabung dengan tim BeritaAE - Bangun karir di industri media digital terdepan Indonesia.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function CareerPage() {
  const { jobs, settings } = await getPublicCareersData();

  const benefits = [
    {
      icon: Heart,
      title: "Health Insurance",
      desc: "Asuransi kesehatan untuk karyawan & keluarga",
    },
    {
      icon: Coffee,
      title: "Free Snacks",
      desc: "Kopi, teh, dan camilan gratis setiap hari",
    },
    {
      icon: Laptop,
      title: "WFH Friendly",
      desc: "Fleksibilitas kerja dari rumah",
    },
    {
      icon: GraduationCap,
      title: "Learning Budget",
      desc: "Anggaran pengembangan skill setiap tahun",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10" />

        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-green-500">Karir</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {settings?.page_title || "Bangun Masa Depan"}{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Bersama Kami
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {settings?.page_description ||
                  "Bergabung dengan tim passionate yang berdedikasi menyajikan berita berkualitas untuk jutaan pembaca Indonesia."}
              </p>
              <Button
                size="lg"
                className="gap-2 bg-green-500 hover:bg-green-600"
                asChild
              >
                <a href="#lowongan">
                  Lihat Lowongan <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 border-y bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <benefit.icon className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="lowongan" className="py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Lowongan Terbuka</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Temukan posisi yang sesuai dengan keahlian dan passion Anda
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.length === 0 ? (
              <ScrollReveal>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Saat ini belum ada lowongan yang tersedia. Silakan cek
                    kembali nanti.
                  </CardContent>
                </Card>
              </ScrollReveal>
            ) : (
              jobs.map((job, index) => (
                <ScrollReveal key={job.id} delay={index * 0.05}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold group-hover:text-green-500 transition-colors">
                              {job.title}
                            </h3>
                            {job.level === "Senior" && (
                              <Badge className="bg-red-500 text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {job.department && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {job.department}
                              </span>
                            )}
                            {job.job_type && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.job_type}
                              </span>
                            )}
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                            )}
                          </div>
                          {job.salary_range && (
                            <p className="text-sm text-green-600 font-medium mt-2">
                              {job.salary_range}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="shrink-0 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-colors"
                          asChild
                        >
                          <a
                            href={`mailto:${
                              settings?.application_email ||
                              "karir@beritaae.com"
                            }?subject=Lamaran: ${job.title}`}
                          >
                            Apply Now
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white max-w-3xl mx-auto">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  Tidak Menemukan Posisi yang Cocok?
                </h2>
                <p className="text-white/80 mb-6">
                  Kirimkan CV Anda dan kami akan menghubungi jika ada posisi
                  yang sesuai.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <a
                    href={`mailto:${
                      settings?.application_email || "karir@beritaae.com"
                    }?subject=CV Umum`}
                  >
                    Kirim CV Umum
                  </a>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
