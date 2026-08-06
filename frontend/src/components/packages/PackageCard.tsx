'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiCheckCircle, FiTag } from 'react-icons/fi';
import { ArrowRight } from 'lucide-react';
import { addToCart } from '@/lib/cart';

// Curated Unsplash images per package category
const CATEGORY_IMAGES: Record<string, string> = {
  female_general:
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=80',
  female_premium:
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
  male_general:
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80',
  male_premium:
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
  tuberculosis:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  pediatrics:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  gynecology:
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
  orthopedics:
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80',
  default:
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&q=80',
};

const CATEGORY_ICONS: Record<string, string> = {
  female_general: '♀',
  female_premium: '♀',
  male_general: '♂',
  male_premium: '♂',
  tuberculosis: '🫁',
  pediatrics: '👶',
  gynecology: '🩺',
  orthopedics: '🦴',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  female_general: 'from-rose-600 to-pink-700',
  female_premium: 'from-rose-700 to-primary-800',
  male_general: 'from-primary-600 to-primary-700',
  male_premium: 'from-primary-700 to-primary-900',
  tuberculosis: 'from-emerald-600 to-teal-700',
  pediatrics: 'from-primary-500 to-primary-600',
  gynecology: 'from-pink-600 to-rose-700',
  orthopedics: 'from-indigo-600 to-blue-700',
  default: 'from-primary-600 to-primary-800',
};

interface PackageCardProps {
  id?: string;
  name: string;
  category?: string;
  targetGroup?: string;
  ageLabel?: string;
  originalPrice: number;
  discountedPrice: number;
  currency?: string;
  description?: string;
  tests?: string[];
  ctaLabel?: string;
  ctaLink?: string;
  freeDoctorConsultation?: boolean;
}

export function PackageCard({
  id,
  name,
  category,
  targetGroup,
  ageLabel,
  originalPrice,
  discountedPrice,
  currency = 'NPR',
  description,
  tests = [],
  ctaLabel = 'Book Check-up',
  ctaLink,
  freeDoctorConsultation = true,
}: PackageCardProps) {
  const [added, setAdded] = useState(false);

  const discountPct =
    originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;
  const isPremium = category?.includes('premium');
  const savings = originalPrice - discountedPrice;

  const catKey = category || 'default';
  const image = CATEGORY_IMAGES[catKey] ?? CATEGORY_IMAGES.default;
  const icon = CATEGORY_ICONS[catKey] ?? '🏥';
  const gradient = CATEGORY_GRADIENTS[catKey] ?? CATEGORY_GRADIENTS.default;

  const bookingLink =
    ctaLink ||
    `/appointments/book?package=${encodeURIComponent(name)}&amount=${discountedPrice}&type=package`;

  const handleAddToCart = () => {
    addToCart({
      id: id || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      category,
      amount: discountedPrice,
    });
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(2,132,199,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative flex flex-col h-full bg-white rounded-2xl border border-neutral-100 shadow-md overflow-hidden"
    >
      {/* ── Image with gradient overlay (compact height) ── */}
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-75`} />

        {/* Premium ribbon (top-right) */}
        {isPremium && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl tracking-wide uppercase shadow-md flex items-center gap-1 z-10">
            <span aria-hidden>★</span> Most Popular
          </div>
        )}

        {/* Discount badge (top-left) */}
        {discountPct > 0 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-red-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow z-10">
            <FiTag className="w-3 h-3" /> {discountPct}% OFF
          </div>
        )}

        {/* Category icon bottom-left */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-2xl drop-shadow-md" aria-hidden>
            {icon}
          </span>
        </div>
      </div>

      {/* ── Free Doctor Consultation highlight (BELOW image, no overlap) ── */}
      {freeDoctorConsultation && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide px-4 py-2 flex items-center justify-center gap-1.5 flex-shrink-0">
          <span aria-hidden>👨‍⚕️</span> Free Doctor Consultation Included
        </div>
      )}

      {/* ── Title + meta block (clean, on white) ── */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        {(targetGroup || ageLabel) && (
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">
            {[targetGroup, ageLabel].filter(Boolean).join(' · ')}
          </p>
        )}
        <h3 className="font-heading font-bold text-neutral-900 text-base leading-snug line-clamp-2 min-h-[2.6rem]">
          {name}
        </h3>
      </div>

      {/* ── Pricing strip ── */}
      <div
        className={`px-5 py-3 bg-gradient-to-r ${gradient} flex items-center justify-between flex-shrink-0`}
      >
        <div>
          <p className="text-xs text-white/70 line-through leading-tight">
            {currency} {originalPrice.toLocaleString()}
          </p>
          <p className="text-xl font-extrabold text-white leading-tight">
            {currency} {discountedPrice.toLocaleString()}
          </p>
        </div>
        {savings > 0 && (
          <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Save {currency} {savings.toLocaleString()}
          </div>
        )}
      </div>

      {/* ── Description ── */}
      {description ? (
        <div className="px-5 pt-4 pb-1 flex-shrink-0">
          <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2">{description}</p>
        </div>
      ) : null}

      {/* ── Trust strip ── */}
      <div className="px-5 pt-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 flex-shrink-0">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Same-day Reports
        </span>
        <span className="h-3 w-px bg-neutral-200" />
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> NABL-grade Lab
        </span>
      </div>

      {/* ── Tests list ── */}
      <div className="flex-1 px-5 py-4">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2.5">
          Tests Included ({tests.length})
        </p>
        {tests.length > 0 ? (
          <ul className="grid grid-cols-1 gap-1.5">
            {tests.slice(0, 6).map((test) => (
              <li
                key={test}
                className="flex items-center gap-2 text-xs text-neutral-600"
              >
                <FiCheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />
                <span className="truncate">{test}</span>
              </li>
            ))}
            {tests.length > 6 && (
              <li className="text-xs text-neutral-400 pl-5">
                +{tests.length - 6} more tests
              </li>
            )}
          </ul>
        ) : (
          <p className="text-xs text-neutral-400">Tests included will be updated shortly.</p>
        )}
      </div>

      {/* ── CTA block ── */}
      <div className="px-5 pb-5 space-y-2 border-t border-neutral-50 pt-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={bookingLink}
            className="inline-flex items-center justify-center gap-1 border border-primary-200 text-primary-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-colors ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {added ? (
              <>
                <FiCheckCircle className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <FiShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
        <Link
          href={bookingLink}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 py-1"
        >
          Book Online <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.article>
  );
}
