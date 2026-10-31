// src/pages/Contact/ContactSection.jsx

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OrderHeading from "./components/OrderHeading";
import OrderOptions from "./components/OrderOptions";
import "./styles/contact.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const kickerRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const ruleTopRef = useRef(null);
  const ruleMidRef = useRef(null);
  const graphicRef = useRef(null);
  const taglineRef = useRef(null);
  const taglineSubRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Badge + kicker fade
      gsap.fromTo(
        [badgeRef.current, kickerRef.current],
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Top rule
      gsap.fromTo(
        ruleTopRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ruleTopRef.current, start: "top 88%" },
        }
      );

      // Copy
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 0.55,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: copyRef.current, start: "top 86%" },
        }
      );

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 90%" },
        }
      );

      // Mid rule
      gsap.fromTo(
        ruleMidRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ruleMidRef.current, start: "top 90%" },
        }
      );

      // Graphic block
      gsap.fromTo(
        graphicRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: graphicRef.current, start: "top 85%" },
        }
      );

      // Tagline
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: taglineRef.current, start: "top 92%" },
        }
      );

      gsap.fromTo(
        taglineSubRef.current,
        { opacity: 0 },
        {
          opacity: 0.4,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: taglineSubRef.current, start: "top 94%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-section relative overflow-hidden"
    >
      {/* Giant background number */}
      <div className="contact-bg-number" aria-hidden="true">
        05
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-28 pb-16 md:px-14 lg:px-20 md:pt-40 lg:pt-48 md:pb-20">
        {/* ── Row 1: Badge + Kicker ───────────────────── */}
        <div className="flex items-center gap-5 mb-10">
          <div ref={badgeRef} className="contact-badge">
            05
          </div>
          <p ref={kickerRef} className="contact-kicker">
            ORDER / CONTACT
          </p>
        </div>

        {/* ── Row 2: Headline ─────────────────────────── */}
        <OrderHeading />

        {/* ── Rule ────────────────────────────────────── */}
        <div ref={ruleTopRef} className="contact-rule mt-12 md:mt-16" aria-hidden="true" />

        {/* ── Row 3: Asymmetric — copy left, CTA right ─ */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6 items-end">
          {/* Copy — offset to column 2 */}
          <div className="lg:col-span-5 lg:col-start-1">
            <p ref={copyRef} className="contact-copy">
              Your next favourite meal is just a message away.
              Good food is closer than you think.
            </p>
          </div>

          {/* CTA — pushed right */}
          <div className="lg:col-span-4 lg:col-start-9 lg:flex lg:justify-end">
            <button
              ref={ctaRef}
              onClick={() => setIsOpen(true)}
              className="order-trigger"
              aria-haspopup="dialog"
            >
              <span>ORDER NOW</span>
              <span className="cta-arrow text-xl">↗</span>
            </button>
          </div>
        </div>

        {/* ── Rule ────────────────────────────────────── */}
        <div ref={ruleMidRef} className="contact-rule mt-16 md:mt-24" aria-hidden="true" />

        {/* ── Row 4: Graphic block + tagline ──────────── */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6 items-end">
          {/* Noir logo */}
          <div className="lg:col-span-4">
            <img
              ref={graphicRef}
              src="/images/Noir-Bistro-logo.png"
              alt="Noir Bistro"
              className="h-28 md:h-36 w-auto object-contain"
            />
          </div>

          {/* Tagline */}
          <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-3 md:items-end md:text-right">
            <p ref={taglineRef} className="contact-tagline text-2xl md:text-3xl lg:text-4xl leading-tight">
              GOOD FOOD. GOOD PEOPLE. NOIR.
            </p>
            <p ref={taglineSubRef} className="text-[10px] tracking-[0.25em] text-[#0A0A0A] opacity-40">
              MADE FOR THE MOMENT.
            </p>
          </div>
        </div>

        {/* ── Bottom Sub-Footer Bar ───────────────────── */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-[#0A0A0A]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-[0.15em] opacity-80">
          <p>© {new Date().getFullYear()} NOIR BISTRO. ALL RIGHTS RESERVED.</p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/noirbistro.in?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Noir Bistro Instagram"
              className="group flex items-center gap-2 font-bold transition-opacity hover:opacity-60"
            >
              <span>INSTAGRAM</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M7 7H17V17" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Order Modal ───────────────────────────── */}
      <OrderOptions isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}