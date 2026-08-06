'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { get, PaginatedResponse } from '@/lib/api';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';
import { FlowerDrawing, BabyDrawing, LungsDrawing } from '@/components/home/SpecialistArtworks';
import { JsonLd } from '@/components/seo/JsonLd';
import type { SpecialistPageData, FallbackDoctor } from '@/lib/specialist-data';
import { BRAND } from '@/lib/brand';

/* Slug → specialty doodle mapping (homepage clinical motif) */
const SPECIALTY_ART: Record<
  string,
  { Artwork: (p: { className?: string; stroke: string; soft: string }) => JSX.Element; stroke: string; soft: string }
> = {
  'gynecology-obstetrics': { Artwork: FlowerDrawing, stroke: '#e11d48', soft: '#ffe4e6' },
  pediatrics: { Artwork: BabyDrawing, stroke: '#0d9488', soft: '#ccfbf1' },
  tuberculosis: { Artwork: LungsDrawing, stroke: '#059669', soft: '#d1fae5' },
};

type ApiDoctor = {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  experience?: number;
  phone?: string;
};

function toDoctorCardProps(d: ApiDoctor | FallbackDoctor, slug: string) {
  const isFallback = 'images' in d;
  return {
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    qualification: d.qualification || 'Specialist',
    experience: 'experience' in d ? d.experience : undefined,
    rating: 'rating' in d ? d.rating : 4.8,
    availableDays: 'availableDays' in d ? d.availableDays : 'Mon – Fri',
    bio: 'bio' in d ? d.bio : undefined,
    phone: 'phone' in d ? d.phone : undefined,
    isTopRated: 'isTopRated' in d ? d.isTopRated : false,
    images: isFallback
      ? (d as FallbackDoctor).images
      : (d as ApiDoctor).photo
      ? [(d as ApiDoctor).photo as string]
      : [],
    bookingHref: `/appointments/book?specialty=${slug}&doctor=${encodeURIComponent(d.name)}`,
  };
}

export function SpecialistDetailPage({
  slug,
  data,
}: {
  slug: string;
  data: SpecialistPageData;
}) {
  const [apiDoctors, setApiDoctors] = useState<ApiDoctor[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  function openDoctorModal(d: ApiDoctor | FallbackDoctor, images: string[]) {
    setSelectedDoctor({
      name: d.name,
      specialization: d.specialization,
      qualification: d.qualification || 'Specialist',
      experience: 'experience' in d ? d.experience : undefined,
      rating: 'rating' in d ? (d as FallbackDoctor).rating : 4.8,
      availableDays: 'availableDays' in d ? (d as FallbackDoctor).availableDays : 'Mon – Fri',
      bio: d.bio,
      phone: 'phone' in d ? (d as FallbackDoctor).phone : '+977 01-4533361',
      isTopRated: 'isTopRated' in d ? !!(d as FallbackDoctor).isTopRated : false,
      images,
      bookingHref: `/appointments/book?doctor=${encodeURIComponent(d.name)}&specialty=${encodeURIComponent(slug)}`,
      highlights: [d.specialization, d.qualification || ''].filter(Boolean),
    });
  }

  useEffect(() => {
    get<PaginatedResponse<ApiDoctor>>('doctors', {
      params: { page: 1, limit: 50, sortBy: 'name', sortOrder: 'asc' },
    })
      .then((res) => { setApiDoctors(res.data || []); })
      .catch(() => setApiDoctors([]))
      .finally(() => setApiLoaded(true));
  }, []);

  const slugKeywords = useMemo(() => slug.split('-'), [slug]);

  const filteredApiDoctors = useMemo(
    () =>
      apiDoctors.filter((d) =>
        slugKeywords.some((kw) => d.specialization.toLowerCase().includes(kw))
      ),
    [apiDoctors, slugKeywords]
  );

  // Use real API doctors if found, otherwise use rich fallback data
  const displayDoctors = apiLoaded && filteredApiDoctors.length
    ? filteredApiDoctors.map((d) => toDoctorCardProps(d, slug))
    : data.fallbackDoctors.map((d) => toDoctorCardProps(d, slug));

  const art = SPECIALTY_ART[slug] ?? SPECIALTY_ART['gynecology-obstetrics'];

  const physicianSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    name: data.heading,
    description: data.description,
    areaServed: 'Kathmandu, Nepal',
    provider: {
      '@type': 'MedicalOrganization',
      name: BRAND.name,
      url: BRAND.siteUrl,
    },
  };

  return (
    <>
      <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <JsonLd data={physicianSchema} />

      {/* ── Hero banner ── */}
      <section className="py-12 md:py-16 lg:py-20 bg-primary-950 text-white relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center">
        <VideoHeroBackground
          src={data.heroVideo.src}
          poster={data.heroVideo.poster}
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-primary-700/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white/90 border border-white/15">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <art.Artwork className="h-5 w-5" stroke="#ffffff" soft="#ffffff" />
              </span>
              Specialist Clinic
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
              {data.heading}
            </h1>
            <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">{data.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/appointments/book?specialty=${slug}`}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Book Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                Call Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Conditions treated ── */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-rose-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="What We Treat"
            title="Conditions"
            highlight="we care for"
            subtitle="A focused list of the concerns our specialists regularly support."
            className="mb-10"
          />
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {data.conditions.map((condition, i) => (
              <motion.span
                key={condition}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.5)]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-md">
                  <FiCheckCircle className="h-3 w-3" strokeWidth={3} />
                </span>
                {condition}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctors grid ── */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 left-[-4rem] h-64 w-80 rounded-full bg-teal-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Our Team"
            title={`${data.heading}`}
            highlight="specialists"
            subtitle="Our experienced consultants are available for in-person and online appointments. Click Book Now to reserve your slot."
            className="mb-12"
          />

          {!apiLoaded ? (
            /* Skeleton loader */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="rounded-3xl border border-neutral-200/70 bg-white shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-neutral-100 to-neutral-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-neutral-200 rounded w-2/3" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-10 bg-neutral-200 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayDoctors.map((doc) => {
                const rawDoc = apiLoaded && filteredApiDoctors.length
                  ? filteredApiDoctors.find((d) => d.id === doc.id) as ApiDoctor | undefined
                  : data.fallbackDoctors.find((d) => d.id === doc.id) as FallbackDoctor | undefined;
                return (
                  <DoctorCard
                    key={doc.id}
                    images={doc.images}
                    name={doc.name}
                    specialization={doc.specialization}
                    qualification={doc.qualification}
                    experience={doc.experience}
                    rating={doc.rating}
                    availableDays={doc.availableDays}
                    bio={doc.bio}
                    phone={doc.phone}
                    isTopRated={doc.isTopRated}
                    bookingHref={doc.bookingHref}
                    onViewProfile={rawDoc ? () => openDoctorModal(rawDoc, doc.images) : undefined}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Procedures ── */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 right-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="What We Offer"
            title="Procedures"
            highlight="& Tests"
            subtitle="Everything we provide within this specialty — all under one roof."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {data.procedures.map((procedure, i) => (
              <motion.div
                key={procedure}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white px-4 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200/70 hover:bg-primary-50/40 hover:shadow-[0_14px_30px_-16px_rgba(1,173,165,0.5)]"
              >
                <span className={`relative flex h-2.5 w-2.5 shrink-0 rounded-full ${data.accentColor} transition-transform duration-300 group-hover:scale-150`} />
                <span className="text-neutral-700 text-sm font-medium transition-colors group-hover:text-primary-800">{procedure}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-teal-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked"
            highlight="Questions"
            subtitle="Answers to the questions patients ask us most often."
            className="mb-10"
          />

          <div className="space-y-3">
            {data.faq.map((item, index) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                className="group overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200/70 hover:shadow-[0_16px_36px_-18px_rgba(1,173,165,0.45)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq((prev) => (prev === index ? null : index))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-primary-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <FiChevronDown
                    className={`w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180 text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-neutral-600 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        tone="dark"
        title="Need Expert"
        highlight="Consultation?"
        subtitle={`Book an appointment with our ${data.heading.toLowerCase()} team today. Same-day slots are often available.`}
        actions={[
          { label: 'Book Appointment', href: `/appointments/book?specialty=${slug}`, icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </>
  );
}
