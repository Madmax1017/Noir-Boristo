// src/pages/Contact/components/OrderHeading.jsx

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  { text: "GOOD FOOD.", size: "clamp(3.2rem, 9vw, 9rem)" },
  { text: "JUST A", size: "clamp(3.2rem, 9vw, 9rem)" },
  { text: "MESSAGE AWAY.", size: "clamp(3.2rem, 9vw, 9rem)" },
];

export default function OrderHeading() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Staggered mask-reveal for each line
      gsap.utils.toArray(".contact-headline-inner").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top 82%",
            },
          }
        );
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef}>
      <h2 className="contact-headline">
        {LINES.map((line, i) => (
          <span className="contact-headline-line" key={i}>
            <span
              className="contact-headline-inner"
              style={{ fontSize: line.size }}
            >
              {line.text}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}