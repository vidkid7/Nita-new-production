'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * Brand-themed loading screen for Nita Clinics.
 * Features the actual Nita logo with sonar rings, an animated ECG trace,
 * brand name, tagline, and a circular progress ring.
 * Fades out automatically once `done` becomes true (or after `minDurationMs`).
 */
export function BrandLoader({
  done,
  minDurationMs = 1100,
}: {
  done: boolean;
  minDurationMs?: number;
}) {
  const [visible, setVisible] = useState(true);

  // Keep the loader visible for at least `minDurationMs` so it doesn't flash.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setVisible(false), minDurationMs);
    return () => clearTimeout(t);
  }, [done, minDurationMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="brand-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white overflow-hidden"
          aria-live="polite"
          role="status"
        >
          {/* ambient glows */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl animate-vital-ping" />
            <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary-400/15 blur-3xl animate-vital-ping anim-delay-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[28rem] w-[28rem] rounded-full bg-primary-300/10 blur-3xl" />
            <div className="absolute inset-0 plus-pattern opacity-[0.07]" />
          </div>

          {/* animated ECG trace along the top */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full text-white/15"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 28 H560 L600 12 L640 36 L680 6 L720 36 L760 28 H1440"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="160 40"
              className="animate-ecg-flow"
            />
          </svg>

          {/* logo with sonar rings + circular progress */}
          <div className="relative">
            {/* sonar ring 1 */}
            <span
              className="pulse-ring absolute left-1/2 top-1/2 h-40 w-40 rounded-full border-2"
              style={{ borderColor: 'rgba(93, 225, 216, 0.45)' }}
              aria-hidden="true"
            />
            {/* sonar ring 2 */}
            <span
              className="pulse-ring absolute left-1/2 top-1/2 h-40 w-40 rounded-full border-2 anim-delay-2"
              style={{ borderColor: 'rgba(93, 225, 216, 0.35)' }}
              aria-hidden="true"
            />
            {/* sonar ring 3 */}
            <span
              className="pulse-ring absolute left-1/2 top-1/2 h-40 w-40 rounded-full border anim-delay-3"
              style={{ borderColor: 'rgba(93, 225, 216, 0.25)' }}
              aria-hidden="true"
            />

            {/* rotating circular progress ring */}
            <svg
              className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="brand-loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5de1d8" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#5de1d8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5de1d8" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#brand-loader-grad)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray="70 220"
                className="origin-center animate-[brand-loader-spin_1.6s_linear_infinite]"
              />
            </svg>

            {/* logo disc — actual brand logo on a white card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white p-5 shadow-[0_0_80px_-10px_rgba(93,225,216,0.55)] ring-1 ring-white/30"
            >
              <Image
                src="/logo.png"
                alt="Nita Clinics"
                width={96}
                height={96}
                priority
                className="h-full w-full object-contain"
              />
            </motion.div>

            {/* tiny floating sparkles around the logo */}
            <span
              className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary-300 spark-float"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-2 -left-2 h-1.5 w-1.5 rounded-full bg-primary-200 spark-float anim-delay-2"
              aria-hidden="true"
            />
            <span
              className="absolute top-1/2 -right-3 h-1 w-1 rounded-full bg-primary-300 spark-float anim-delay-3"
              aria-hidden="true"
            />
          </div>

          {/* brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 font-heading text-3xl md:text-4xl font-bold tracking-tight text-white"
          >
            Nita{' '}
            <span className="bg-gradient-to-r from-primary-300 via-cyan-200 to-primary-300 bg-clip-text text-transparent">
              Clinics
            </span>
          </motion.h1>

          {/* divider with heart */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-3 flex items-center gap-2 origin-center"
            aria-hidden="true"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary-300/60" />
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-primary-300 heart-beat" fill="currentColor">
              <path d="M12 21s-7-4.534-7-10a4 4 0 0 1 7-2.646A4 4 0 0 1 19 11c0 5.466-7 10-7 10z" />
            </svg>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary-300/60" />
          </motion.div>

          {/* tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.4em] text-primary-200/90 font-medium"
          >
            We Care Your Health
          </motion.p>

          {/* progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-10 flex items-center gap-2"
            aria-hidden="true"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary-300 pulse-dot"
              style={{ animationDelay: '0s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary-300 pulse-dot"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary-300 pulse-dot"
              style={{ animationDelay: '0.4s' }}
            />
          </motion.div>

          {/* bottom ECG trace */}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-white/10"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
