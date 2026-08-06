'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Phone, Stethoscope, Microscope, Zap, ScanLine, FlaskConical, Droplets, ClipboardList, Activity, HeartPulse } from 'lucide-react';
import { FiCalendar, FiCheckCircle, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { get } from '@/lib/api';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';

const WHAT_IS_INCLUDED = [
  { icon: Stethoscope, title: 'Clinical Assessment', desc: 'Thorough history of symptoms, exposure, and risk factors. Physician-led physical examination including chest auscultation.' },
  { icon: Microscope, title: 'Sputum AFB Smear', desc: 'Ziehl-Neelsen staining of sputum samples — first-line TB detection with same-day results.' },
  { icon: Zap, title: 'GeneXpert MTB/RIF', desc: 'WHO-endorsed rapid molecular test identifying M. tuberculosis and rifampicin resistance in under 2 hours.' },
  { icon: ScanLine, title: 'Digital Chest X-Ray', desc: 'High-resolution PA view chest X-ray with radiologist interpretation — detects pulmonary TB patterns.' },
  { icon: FlaskConical, title: 'TB Culture (if indicated)', desc: 'Gold-standard culture for drug sensitivity testing — guides DOTS therapy selection for drug-resistant cases.' },
  { icon: Droplets, title: 'TB IGRA Blood Test', desc: 'Interferon-Gamma Release Assay (QuantiFERON) for latent TB — no BCG interference, high specificity.' },
  { icon: ClipboardList, title: 'DOTS Treatment Plan', desc: 'Physician-initiated treatment aligned with NTCC/WHO guidelines, with structured follow-up monitoring schedule.' },
];

const SYMPTOMS = [
  'Persistent cough lasting 2+ weeks',
  'Blood in sputum (haemoptysis)',
  'Unexplained weight loss',
  'Prolonged low-grade fever',
  'Night sweats',
  'Chest pain and breathlessness',
  'Extreme fatigue and weakness',
  'Swollen lymph nodes (neck or armpit)',
];

const TESTS_INCLUDED = [
  'Sputum AFB Smear Microscopy (x2)',
  'GeneXpert MTB/RIF Assay',
  'Digital Chest X-Ray (PA View)',
  'TB QuantiFERON IGRA (Blood Test)',
  'Complete Blood Count (CBC)',
  'Erythrocyte Sedimentation Rate (ESR)',
  'C-Reactive Protein (CRP)',
  'LFT — Baseline before medication',
  'Culture & Drug Sensitivity (if MDR suspected)',
  'Physician Consultation & DOTS Planning',
];

const FAQS = [
  { q: 'How contagious is TB?', a: 'Pulmonary TB spreads through the air when an infected person coughs, sneezes, or speaks. Once treatment starts (usually 2–4 weeks), the risk of spreading significantly decreases.' },
  { q: 'Is TB treatment free in Nepal?', a: 'First-line anti-TB medicines are provided free under the National TB Control Program (NTCC). Our clinic coordinates with NTCC protocols. Consult us for full details on your specific case.' },
  { q: 'How long does TB treatment take?', a: 'Standard drug-sensitive TB treatment takes 6 months (2 months intensive + 4 months continuation). Drug-resistant TB (MDR-TB) may require 9–24 months.' },
  { q: 'Do I need to isolate during treatment?', a: 'Respiratory isolation is recommended for the first 2–4 weeks of treatment or until sputum smear converts to negative. Our team will advise on practical home isolation guidelines.' },
  { q: 'What is latent TB? Do I need treatment?', a: 'Latent TB means you carry the bacteria but are not sick and cannot spread it. IGRA or TST tests detect it. Treatment (preventive therapy) is recommended for high-risk individuals like healthcare workers, immunocompromised patients, and close contacts.' },
];

export default function TuberculosisCheckupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [packages, setPackages] = useState<
    { id: string; name: string; discountedPrice: number; tests: string[] }[]
  >([]);

  useEffect(() => {
    get<Array<Record<string, unknown>>>('packages?category=tuberculosis')
      .then((rows) => {
        setPackages(
          (rows || []).map((p) => ({
            id: String(p.id),
            name: String(p.name || ''),
            discountedPrice: Number(p.discountedPrice ?? 0),
            tests: Array.isArray(p.tests) ? (p.tests as string[]) : [],
          })),
        );
      })
      .catch(() => setPackages([]));
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 bg-primary-950 text-white relative overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/tb-xray-review.mp4"
          poster="/videos/hero/tb-xray-review.jpg"
          overlayClassName="from-emerald-950/[0.88] via-primary-950/[0.66] to-teal-900/[0.42]"
        />
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 rounded-full bg-teal-300 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/80 font-medium mb-5">
              <span className="text-lg">🫁</span> TB & Pulmonary Clinic
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-5 leading-tight">
              Tuberculosis Check-up
            </h1>
            <p className="text-emerald-50/90 text-lg max-w-2xl leading-relaxed">
              Complete TB screening pathway — sputum testing, GeneXpert molecular detection, 
              digital X-ray, IGRA blood test, and DOTS treatment planning aligned with NTCC guidelines.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/appointments/book?specialty=tuberculosis&type=checkup"
                className="inline-flex items-center gap-2 bg-white text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              >
                <FiCalendar className="w-4 h-4" />
                Book TB Check-up
              </Link>
              <a
                href="tel:+977014533361"
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                Call +977 01-4533361
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Urgency notice ── */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="container-custom py-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 font-medium">
              <span className="font-bold">Important:</span> If you have had a cough for 2+ weeks, unexplained weight loss, or night sweats, please seek evaluation promptly. Early diagnosis leads to significantly better outcomes. Priority same-day slots are available for suspected TB cases.
            </p>
          </div>
        </div>
      </div>

      {/* ── Image gallery ── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-3 gap-3 max-h-52 overflow-hidden rounded-2xl">
            {[
              'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80',
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
              'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80',
            ].map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="TB diagnosis lab" className="w-full h-52 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Full Program"
              title="What's"
              highlight="Included"
              subtitle="A complete TB screening and treatment pathway, aligned with NTCC and WHO guidelines."
            />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {WHAT_IS_INCLUDED.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_16px_36px_-16px_rgba(5,150,105,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm transition-colors group-hover:text-emerald-700">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Symptoms + Tests ── */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-emerald-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-amber-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Symptoms */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Warning Signs</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Symptoms to Watch</h2>
              <ul className="space-y-3">
                {SYMPTOMS.map((s) => (
                  <li key={s} className="group flex items-start gap-3 rounded-xl border border-neutral-200/60 bg-white px-3.5 py-2.5 text-sm text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_10px_22px_-14px_rgba(245,158,11,0.4)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                      <FiAlertCircle className="w-3.5 h-3.5" />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl border border-amber-200/70 bg-amber-50/70 p-4">
                <p className="text-xs text-amber-800 font-medium">
                  If you experience any 2+ of these symptoms for over 2 weeks, seek evaluation immediately. TB is curable when detected early.
                </p>
              </div>
            </motion.div>

            {/* Tests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <Microscope className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Laboratory</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Tests Included</h2>
              <ul className="space-y-2.5">
                {TESTS_INCLUDED.map((test) => (
                  <li key={test} className="group flex items-center gap-3 rounded-xl border border-neutral-200/60 bg-white px-3.5 py-2.5 text-sm text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_22px_-14px_rgba(5,150,105,0.4)]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      <FiCheckCircle className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    {test}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Pricing"
              title="Choose Your"
              highlight="Package"
            />
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {packages.length === 0 ? (
              <p className="col-span-full text-center text-neutral-500 text-sm py-8">
                No TB packages are published yet. Add them in the admin panel under Packages.
              </p>
            ) : (
              packages.map((pkg, i) => {
                const highlight = packages.length >= 3 && i === packages.length - 1;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      'rounded-2xl border p-6 flex flex-col',
                      highlight
                        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md'
                        : 'border-neutral-200 bg-white',
                    )}
                  >
                    {highlight && (
                      <span className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 w-fit uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                    <h3 className="font-heading font-bold text-neutral-900 text-sm mb-2">{pkg.name}</h3>
                    <p className="text-xs text-neutral-500 mb-4 flex-1">
                      {pkg.tests.length ? pkg.tests.join(' · ') : 'See clinic for included tests.'}
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 mb-4">
                      NRS {pkg.discountedPrice.toLocaleString()}
                    </p>
                    <Link
                      href={`/appointments/book?specialty=tuberculosis&type=checkup&package=${encodeURIComponent(pkg.name)}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Book This Package
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="FAQ"
              title="Common"
              highlight="Questions"
            />
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={item.q} className="group rounded-2xl border border-neutral-200/70 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200/70 hover:shadow-[0_16px_36px_-18px_rgba(5,150,105,0.45)]">
                <button
                  type="button"
                  onClick={() => setOpenFaq((p) => (p === i ? null : i))}
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-semibold text-neutral-800 hover:text-emerald-700 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={cn('w-5 h-5 flex-shrink-0 ml-3 transition-transform', openFaq === i && 'rotate-180 text-emerald-600')} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-neutral-600 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAFooter
        tone="dark"
        title="Don't delay —"
        highlight="TB is curable"
        subtitle="Early diagnosis and adherence to treatment leads to complete recovery. Priority appointments available."
        actions={[
          { label: 'Book TB Check-up', href: '/appointments/book?specialty=tuberculosis&type=checkup', icon: <Calendar className="h-4 w-4" /> },
          { label: 'Call Us', href: 'tel:+977014533361' },
        ]}
      />
    </main>
  );
}
