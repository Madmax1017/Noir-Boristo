// src/pages/About/AboutSection.jsx

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/about.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Text panel elements — staggered reveal
      const textEls = [
        eyebrowRef.current,
        titleRef.current,
        descRef.current,
        ctaRef.current,
      ];

      textEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: i === 0 ? 0.5 : i === 2 ? 0.6 : 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );
      });

      // Image reveal — subtle scale
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-split">
        {/* ── Left: text panel ──────────────────── */}
        <div className="about-panel">
          <p ref={eyebrowRef} className="about-eyebrow">
            THE STORY OF NOIR
          </p>

          <h2 ref={titleRef} className="about-title">
            OUR STORY
          </h2>

          <p ref={descRef} className="about-desc">
            At Noir, great food meets great company. Discover bold flavours, a
            distinctive atmosphere and moments that deserve to be savoured.
          </p>

          <a ref={ctaRef} href="#ambience" className="about-cta">
            <span>DISCOVER NOIR</span>
            <span className="cta-arrow">↗</span>
          </a>
        </div>

        {/* ── Right: image panel ───────────────── */}
        <div className="about-image-panel">
          <img
            ref={imageRef}
            src="/images/ambience/_DSC9886.jpg"
            alt="The atmosphere inside Noir Bistro"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}