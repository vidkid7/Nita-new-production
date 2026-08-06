import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import {
  DoodleCross,
  DoodleHeart,
  DoodleSparkle,
  DoodleStar,
} from './TestimonialArtworks';

const benefits = [
  'Free OPD for Registered Doctors',
  '50% Off Lab Tests',
  'Priority Queue Access',
  'Discounts on Packages',
];

export function HealthCardBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-700 text-white overflow-hidden relative">
      {/* clinical plus-dot texture */}
      <div className="absolute inset-0 plus-pattern opacity-50 pointer-events-none" />

      {/* top ECG trace */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-8 w-full text-white/10"
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 18 H380 L420 4 L460 26 L500 10 L540 18 H1440"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="160 40"
          className="animate-ecg-flow"
        />
      </svg>

      {/* ambient glows */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-300/[0.06] blur-3xl pointer-events-none" />

      {/* floating doodles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <DoodleHeart className="spark-float absolute left-[6%] top-[20%] h-6 w-6" stroke="rgba(153,246,228,0.3)" soft="rgba(153,246,228,0.1)" />
        <DoodleSparkle className="spark-float anim-delay-2 absolute right-[5%] top-[28%] h-5 w-5" stroke="rgba(94,234,212,0.4)" soft="rgba(94,234,212,0.12)" />
        <DoodleSparkle className="spark-float anim-delay-3 absolute left-[9%] bottom-[16%] h-6 w-6" stroke="rgba(153,246,228,0.4)" soft="rgba(153,246,228,0.12)" />
        <DoodleHeart className="heart-beat absolute right-[7%] bottom-[20%] h-6 w-6" stroke="rgba(94,234,212,0.35)" soft="rgba(94,234,212,0.1)" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full max-w-xl">
            {/* kicker + chip */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-200 backdrop-blur-sm">
                <DoodleCross className="h-3.5 w-3.5" stroke="#5eead4" soft="rgba(94,234,212,0.2)" />
                Smart Health Card
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-vital-ping" />
                Smart Benefits
              </span>
            </div>

            <h2 className="mb-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
              Get Your <span className="text-teal-300">Nita</span> Health Card
            </h2>
            <p className="mb-6 max-w-lg text-base text-primary-200">
              Exclusive benefits for doctors, staff, and partner organization members. Apply online
              and enjoy healthcare privileges starting immediately.
            </p>

            {/* benefits */}
            <div className="mb-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-primary-100 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-400/20 ring-1 ring-teal-300/30">
                    <FiCheck className="h-3 w-3 text-teal-200" />
                  </span>
                  {b}
                </span>
              ))}
            </div>

            <Link
              href="/health-card"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 font-bold text-primary-700 shadow-[0_12px_30px_-10px_rgba(1,173,165,0.7)] transition-all duration-300 hover:bg-primary-50 hover:shadow-[0_16px_40px_-10px_rgba(1,173,165,0.9)]"
            >
              Apply for Health Card
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Smart card visual */}
          <div className="relative flex-shrink-0 pt-8 lg:pt-0">
            {/* floating doodles around card */}
            <DoodleHeart className="spark-float absolute -right-3 -top-5 z-10 h-6 w-6" stroke="rgba(153,246,228,0.5)" soft="rgba(153,246,228,0.15)" />
            <DoodleSparkle className="spark-float anim-delay-2 absolute -left-4 bottom-16 z-10 h-5 w-5" stroke="rgba(94,234,212,0.5)" soft="rgba(94,234,212,0.15)" />
            <DoodleStar className="heart-beat absolute -right-5 top-20 z-10 h-5 w-5" stroke="rgba(251,191,36,0.6)" soft="rgba(251,191,36,0.15)" />

            {/* card + pulse rings */}
            <div className="relative">
              <span className="pulse-ring absolute left-1/2 top-1/2 h-64 w-64 rounded-full border-2 border-teal-300/30" aria-hidden="true" />
              <span className="pulse-ring absolute left-1/2 top-1/2 h-64 w-64 rounded-full border-2 border-teal-300/20 anim-delay-2" aria-hidden="true" />

              <div className="group relative w-80 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-primary-500 via-primary-400 to-teal-300 p-6 shadow-[0_30px_70px_-20px_rgba(1,173,165,0.65)] ring-1 ring-white/25 sm:w-96">
                {/* card sheen */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />
                {/* shine sweep */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                {/* brand + contactless */}
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <DoodleCross className="h-7 w-7" stroke="#0d9488" soft="rgba(13,148,136,0.25)" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary-950/60">
                        Nita Clinics
                      </p>
                      <p className="text-sm font-bold leading-tight text-primary-950">
                        Smart Health Card
                      </p>
                    </div>
                  </div>
                  {/* contactless waves */}
                  <svg className="h-6 w-6 text-primary-950/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 5.5C11 8.6 11 15.4 7 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M10.5 8.5C12.8 10.4 12.8 13.6 10.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="13.8" cy="12" r="1.2" fill="currentColor" />
                  </svg>
                </div>

                {/* EMV chip */}
                <div className="relative mt-6 mb-5 inline-block h-9 w-12 overflow-hidden rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 ring-1 ring-amber-700/30">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="border-r border-b border-amber-700/25 last:border-b-0" />
                    ))}
                  </div>
                  <div className="absolute inset-[6px] rounded-[4px] border border-amber-700/40" />
                </div>

                {/* ECG trace across card */}
                <svg className="relative mb-5 h-8 w-full" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M0 24 H90 L105 12 L120 32 L135 18 L150 24 H300"
                    fill="none"
                    stroke="rgba(1,77,73,0.55)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="100 20"
                    className="animate-ecg-flow"
                  />
                </svg>

                {/* member info */}
                <div className="relative flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-widest text-primary-950/55">Card Holder</p>
                    <p className="truncate font-semibold text-primary-950">Member Name</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] tracking-widest text-primary-950/55">
                      NITA·HC·2026·0001
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[9px] uppercase tracking-widest text-primary-950/55">Valid Until</p>
                    <p className="text-xs font-bold text-primary-950">12/26</p>
                    <span className="mt-1 inline-block rounded-md bg-primary-900/85 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-teal-200">
                      HEALTH+
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* status pill under card */}
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-vital-ping" />
                Card Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
