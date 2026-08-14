/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { ambientSound } from './audio';
import CustomCursor from './components/CustomCursor';

const NAV_LINKS = [
  { label: 'Story', href: '#' },
  { label: 'Jobs', href: '#' },
  { label: 'Message', href: '#' },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zeal.py0?igsh=cWRsODNsYzh0OGM1&igsi=cWRsODNsYzh0OGM1',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/sAsHwAt24',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/54CEadmbtP',
  },
];

const BG_IMAGE_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85';

const PORTRAIT_URL = 'https://i.ibb.co/8L0164p6/0228c2d361dd.png';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  const toggleAmbientAudio = () => {
    const nextState = ambientSound.toggle();
    setIsAudioActive(nextState);
  };

  return (
    <main
      id="hero-root"
      className="relative h-[100dvh] w-full overflow-hidden bg-black font-hn text-cream select-none"
    >
      {/* Custom Theme-matched Minimalist Cursor */}
      <CustomCursor />

      {/* Background Image (full-bleed, behind everything) */}
      <img
        id="bg-image"
        src={BG_IMAGE_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover anim-fade-in"
      />

      {/* Marquee Name Track (z-10, behind cutout portrait) */}
      <div
        id="marquee-wrapper"
        className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up pointer-events-none select-none"
        style={{ animationDelay: '500ms' }}
      >
        <div
          id="marquee-track"
          className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream tracking-tight font-medium"
        >
          <span className="inline-block pr-[6vw]">
            Sashwat &mdash; Shreyyam&nbsp;
          </span>
          <span className="inline-block pr-[6vw]">
            Sashwat &mdash; Shreyyam&nbsp;
          </span>
        </div>
      </div>

      {/* Horizontal Cream Rule (z-10, above footer) */}
      <div
        id="cream-rule"
        className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream anim-line"
        style={{ animationDelay: '1200ms' }}
      />

      {/* Front Portrait Cutout (z-20, above marquee) */}
      <img
        id="front-portrait"
        src={PORTRAIT_URL}
        alt="Portrait"
        className="absolute bottom-0 inset-x-0 h-[99.95vh] w-full object-contain object-bottom pointer-events-none z-20 anim-rise-in"
        style={{
          animationDelay: '300ms',
          filter: 'brightness(1.09) saturate(0.75) contrast(1.04)',
        }}
      />

      {/* Header Chrome (z-30) */}
      <header
        id="app-header"
        className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8"
      >
        {/* Brand / Logo */}
        <a
          id="brand-logo"
          href="#"
          className="font-hn text-lg tracking-wide text-cream hover:opacity-60 transition-opacity duration-300 anim-fade-up"
          style={{ animationDelay: '800ms' }}
        >
          Zeal
        </a>

        {/* Desktop Header Cluster */}
        <div className="hidden sm:flex items-start gap-16 lg:gap-24">
          {/* Year */}
          <div
            id="header-year"
            className="text-sm text-cream anim-fade-up"
            style={{ animationDelay: '900ms' }}
          >
            2026
          </div>

          {/* Site Navigation */}
          <nav
            id="desktop-nav"
            className="flex flex-col gap-0.5 text-sm"
            aria-label="Site Index"
          >
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.label}
                id={`desktop-nav-${link.label.toLowerCase()}`}
                href={link.href}
                className="text-cream hover:opacity-60 transition-opacity duration-300 anim-fade-up"
                style={{ animationDelay: `${1000 + index * 80}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div
            id="desktop-social"
            className="flex flex-col gap-0.5 text-sm"
            aria-label="Find Me"
          >
            {SOCIAL_LINKS.map((link, index) => (
              <a
                key={link.label}
                id={`desktop-social-${link.label.toLowerCase()}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-cream hover:opacity-60 transition-opacity duration-300 anim-fade-up"
                style={{ animationDelay: `${1150 + index * 80}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Hamburger Button (sm:hidden, z-50) */}
        <button
          id="mobile-menu-btn"
          type="button"
          aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="sm:hidden relative z-50 flex h-10 w-10 items-center justify-center anim-fade-up focus:outline-none"
          style={{ animationDelay: '900ms' }}
        >
          <div className="relative flex h-4 w-6 flex-col justify-between items-center">
            <span
              className={`h-[1.5px] w-6 bg-cream transform transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isDrawerOpen ? 'translate-y-[7.25px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-cream transition-opacity duration-300 ${
                isDrawerOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-cream transform transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isDrawerOpen ? '-translate-y-[7.25px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </header>

      {/* Mobile Drawer (sm:hidden) */}
      {/* Backdrop */}
      <div
        id="mobile-drawer-backdrop"
        onClick={() => setIsDrawerOpen(false)}
        className={`sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        id="mobile-drawer-panel"
        className={`sm:hidden fixed right-0 top-0 bottom-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 flex flex-col justify-between transform transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button Inside Drawer */}
        <button
          id="mobile-drawer-close"
          type="button"
          aria-label="Close drawer"
          onClick={() => setIsDrawerOpen(false)}
          className={`absolute right-6 top-6 text-cream transition-all duration-300 ${
            isDrawerOpen ? 'rotate-0 opacity-100 delay-300' : 'rotate-90 opacity-0'
          }`}
        >
          <X size={26} strokeWidth={1.5} />
        </button>

        {/* Top Section: Site Index */}
        <div className="pt-8">
          <div
            id="mobile-site-index"
            className={`text-xs uppercase tracking-[0.2em] text-cream/50 transition-all duration-500 ${
              isDrawerOpen
                ? 'opacity-100 translate-y-0 delay-[250ms]'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Site Index
          </div>
          <nav className="flex flex-col gap-5 mt-6" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.label}
                id={`mobile-nav-${link.label.toLowerCase()}`}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className={`text-4xl font-hn text-cream hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isDrawerOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transitionDelay: isDrawerOpen ? `${300 + index * 80}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Find Me */}
        <div className="pt-8 mt-auto">
          <div
            id="mobile-find-me"
            className={`text-xs uppercase tracking-[0.2em] text-cream/50 transition-all duration-500 ${
              isDrawerOpen
                ? 'opacity-100 translate-y-0 delay-[500ms]'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Find Me
          </div>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream mt-4"
            aria-label="Mobile Social Links"
          >
            {SOCIAL_LINKS.map((link, index) => (
              <a
                key={link.label}
                id={`mobile-social-${link.label.toLowerCase()}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`hover:opacity-60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isDrawerOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isDrawerOpen ? `${550 + index * 60}ms` : '0ms',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Chrome (z-30 / sm:z-10) */}
      <footer
        id="app-footer"
        className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream pointer-events-none"
      >
        {/* Footer Left (three lines) */}
        <div
          id="footer-left"
          className="flex flex-col anim-fade-up pointer-events-auto"
          style={{ animationDelay: '1400ms' }}
        >
          <span>Visuals Composer</span>
          <span>Digital Crafter</span>
          <span>Philomath</span>
        </div>

        {/* Footer Center - Ambient Audio Toggle */}
        <div
          id="footer-audio-toggle-container"
          className="anim-fade-up pointer-events-auto"
          style={{ animationDelay: '1480ms' }}
        >
          <button
            id="ambient-audio-toggle"
            type="button"
            onClick={toggleAmbientAudio}
            aria-pressed={isAudioActive}
            aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Play atmospheric ambient soundscape'}
            className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer ${
              isAudioActive
                ? 'border-cream/40 bg-cream/10 text-cream shadow-[0_0_16px_rgba(239,238,233,0.15)]'
                : 'border-cream/15 bg-black/40 text-cream/60 hover:text-cream hover:border-cream/35 hover:bg-black/60'
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 size={13} strokeWidth={1.75} className="text-cream shrink-0" />
                <div className="flex items-center gap-[2.5px] h-3 px-0.5" aria-hidden="true">
                  <span className="w-[2px] bg-cream rounded-full anim-soundwave-1" />
                  <span className="w-[2px] bg-cream rounded-full anim-soundwave-2" />
                  <span className="w-[2px] bg-cream rounded-full anim-soundwave-3" />
                </div>
                <span className="text-[11px] tracking-wider uppercase">Ambient ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} strokeWidth={1.75} className="opacity-70 group-hover:opacity-100 shrink-0" />
                <span className="text-[11px] tracking-wider uppercase opacity-80 group-hover:opacity-100">Ambient</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Right (two lines, right-aligned) */}
        <div
          id="footer-right"
          className="flex flex-col text-right anim-fade-up pointer-events-auto"
          style={{ animationDelay: '1550ms' }}
        >
          <span>A homage to</span>
          <span>Sashwat Shreyyam</span>
        </div>
      </footer>
    </main>
  );
}
