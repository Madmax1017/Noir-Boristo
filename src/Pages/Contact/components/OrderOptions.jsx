// src/pages/Contact/components/OrderOptions.jsx

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const WHATSAPP_LINK = "https://wa.me/918793104431";
const CALL_LINK = "tel:+918793104431";

/* ── Inline SVG Icons ────────────────────────── */

function WhatsAppIcon({ size = 22 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function PhoneIcon({ size = 22 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/* ── Component ───────────────────────────────── */

export default function OrderOptions({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body-scroll-lock");
    } else {
      document.body.classList.remove("body-scroll-lock");
    }
    return () => document.body.classList.remove("body-scroll-lock");
  }, [isOpen]);

  // Escape key
  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") animatedClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleEscape]);

  // GSAP entrance
  useEffect(() => {
    if (!isOpen) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35 }
    )
      .fromTo(
        modalRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        "-=0.15"
      )
      .fromTo(
        ".order-option",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
        "-=0.2"
      )
      .fromTo(
        ".order-modal__footer",
        { opacity: 0 },
        { opacity: 0.35, duration: 0.4 },
        "-=0.15"
      );

    return () => tl.kill();
  }, [isOpen]);

  // Animated close
  const animatedClose = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(".order-option", {
      y: -15,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.in",
    })
      .to(
        modalRef.current,
        { y: -30, opacity: 0, scale: 0.97, duration: 0.3, ease: "power3.in" },
        "-=0.05"
      )
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.1"
      );
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="order-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]/90 px-4 py-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) animatedClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        className="order-modal w-full max-w-lg overflow-hidden"
      >
        {/* ── Red header ──────────────────────────── */}
        <div className="order-modal__header">
          <span className="order-modal__brand">NOIR BISTRO</span>
          <button
            onClick={animatedClose}
            aria-label="Close order options"
            className="order-modal__close"
          >
            ✕
          </button>
        </div>

        {/* ── Black body ──────────────────────────── */}
        <div className="order-modal__body">
          <h3
            id="order-dialog-title"
            className="font-anton text-3xl uppercase leading-tight tracking-wide text-[#EA0001] md:text-4xl"
          >
            HOW WOULD YOU
            <br />
            LIKE TO ORDER?
          </h3>

          <p className="mt-4 text-xs leading-relaxed text-[#EA0001]/45 tracking-wide">
            Ready to order? Choose how you'd like to reach us.
          </p>

          {/* ── Divider ───────────────────────────── */}
          <div
            className="mt-8 mb-8 h-px w-full bg-[#EA0001]/15"
            aria-hidden="true"
          />

          {/* ── Options ───────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* WhatsApp */}
            <div className="order-option">
              <div className="flex items-center gap-4">
                <div className="order-option__icon-wrap">
                  <WhatsAppIcon />
                </div>
                <div>
                  <h4 className="order-option__title">ORDER VIA WHATSAPP</h4>
                  <p className="order-option__desc">
                    Chat with us and place your order.
                  </p>
                </div>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="order-btn order-btn--primary mt-2"
              >
                CHAT ON WHATSAPP
                <span className="text-base">↗</span>
              </a>
            </div>

            {/* Call */}
            <div className="order-option">
              <div className="flex items-center gap-4">
                <div className="order-option__icon-wrap">
                  <PhoneIcon />
                </div>
                <div>
                  <h4 className="order-option__title">CALL NOIR BISTRO</h4>
                  <p className="order-option__desc">
                    Speak directly with our team.
                  </p>
                </div>
              </div>
              <a
                href={CALL_LINK}
                className="order-btn order-btn--secondary mt-2"
              >
                CALL NOW
                <span className="text-base">↗</span>
              </a>
            </div>
          </div>

          {/* ── Footer ────────────────────────────── */}
          <p className="order-modal__footer mt-10 text-center text-[10px] tracking-[0.3em] text-[#EA0001]/30">
            GOOD FOOD IS WAITING.
          </p>
        </div>
      </div>
    </div>
  );
}