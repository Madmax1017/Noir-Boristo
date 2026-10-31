import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../styles/hero.css";

const LOGO_SRC = "/images/Noir-Bistro-logo.png";

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
    const sectionRef = useRef(null);
    const logoRef = useRef(null);
    const scanRef = useRef(null);

    useGSAP(
        () => {
            const prefersReduced = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            const logo = logoRef.current;
            const scan = scanRef.current;

            if (!logo) return;

            if (prefersReduced) {
                gsap.set(logo, { opacity: 1 });
                return;
            }

            /* ── Logo reveal ── */
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                logo,
                {
                    opacity: 0,
                    scale: 0.7,
                    rotation: -4,
                    filter: "blur(6px)",
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    filter: "blur(0px)",
                    duration: 1.6,
                    delay: 0.3,
                    onComplete: () => {
                        logo.classList.add("hero-grid__logo-wrap--breathing");
                    },
                }
            );

            /* ── Grid scan sweep ── */
            if (scan) {
                tl.fromTo(
                    scan,
                    { opacity: 0, backgroundPosition: "0% -30%" },
                    {
                        opacity: 1,
                        backgroundPosition: "0% 130%",
                        duration: 2.2,
                        ease: "power1.inOut",
                    },
                    0.5
                ).to(scan, { opacity: 0, duration: 0.4 });
            }
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="hero"
            aria-label="Noir Bistro — welcome"
            className="hero-grid"
        >
            {/* CSS grid-line background */}
            <div className="hero-grid__lines" aria-hidden="true" />

            {/* Scan-line sweep overlay */}
            <div
                ref={scanRef}
                className="hero-grid__scan"
                aria-hidden="true"
            />

            {/* Centred logo */}
            <div ref={logoRef} className="hero-grid__logo-wrap">
                <img
                    src={LOGO_SRC}
                    alt="Noir Bistro"
                    fetchpriority="high"
                    draggable="false"
                    className="hero-grid__logo"
                />
            </div>
        </section>
    );
}