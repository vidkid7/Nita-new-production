'use client';

import { useEffect, useState } from 'react';
import { BrandLoader } from './BrandLoader';
import { WelcomeAdModal } from './WelcomeAdModal';

/**
 * Mounts the brand-themed full-screen loader on first paint and removes it
 * after the page has finished its initial hydration. The two-step welcome ads
 * are revealed *at the same instant* the loader starts fading out, so the ads
 * appear seamlessly during the loader's fade-off (no after-the-fact modal).
 * The ads show again on every page load / hard refresh.
 */
export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    // Wait for two animation frames + a small delay so the hero / chrome
    // have a chance to render, then fade the loader into the welcome ads.
    const t = window.setTimeout(() => {
      setReady(true);
      setShowAds(true);
    }, 700);
    return () => {
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <BrandLoader done={ready} />
      <WelcomeAdModal visible={showAds} />
      {children}
    </>
  );
}
