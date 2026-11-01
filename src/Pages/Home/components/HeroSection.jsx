import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../styles/hero.css";

const LOGO_SRC = "/images/Noir-Bistro-logo.png";

// 14 cells: 5 cols x 3 rows, with the centre cell (index 2) spanning 2 rows
const CELL_COUNT = 14;
const CENTER_INDEX = 2;

gsap.registerPlugin(useGSAP);

export default function HeroSection() {
    const sectionRef = useRef(null);
    const logoRef = useRef(null);
    const sheenRef = useRef(null);
    const spotRef = useRef(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const logo = logoRef.current;
            if (!section || !logo) return;

            const cells = Array.from(
                section.querySelectorAll(".hero-grid__cell")
            );
            const sheen = sheenRef.current;
            const spot = spotRef.current;

            const mm = gsap.matchMedia();

            mm.add(
                {
                    reduce: "(prefers-reduced-motion: reduce)",
                    fine: "(hover: hover) and (pointer: fine)",
                    all: "(min-width: 0px)",
                },
                (context) => {
                    const { reduce, fine } = context.conditions;

                    if (reduce) {
                        gsap.set(logo, { opacity: 1 });
                        return;
                    }

                    /* ── Distance of every cell from the centre cell ── */
                    const center = cells[CENTER_INDEX];
                    const cr = center.getBoundingClientRect();
                    const cx = cr.left + cr.width / 2;
                    const cy = cr.top + cr.height / 2;

                    const dists = cells.map((el) => {
                        const r = el.getBoundingClientRect();
                        return Math.hypot(
                            r.left + r.width / 2 - cx,
                            r.top + r.height / 2 - cy
                        );
                    });
                    const maxD =
                        Math.max(
                            ...dists.filter((_, i) => cells[i].offsetParent)
                        ) || 1;

                    /* ── Entrance: grid ripples out from the centre ── */
                    const tl = gsap.timeline({
                        defaults: { ease: "power3.out" },
                    });

                    tl.fromTo(
                        cells,
                        { opacity: 0, scale: 0.9 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 1,
                            delay: (i) => (dists[i] / maxD) * 0.9,
                        },
                        0.1
                    )
                        .fromTo(
                            logo,
                            {
                                opacity: 0,
                                y: 30,
                                scale: 0.94,
                                filter: "blur(8px)",
                            },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                filter: "blur(0px)",
                                duration: 1.4,
                                clearProps: "filter",
                                onComplete: () =>
                                    logo.classList.add(
                                        "hero-grid__logo-wrap--breathing"
                                    ),
                            },
                            0.45
                        )
                        /* soft light sweep across the whole grid */
                        .fromTo(
                            sheen,
                            { xPercent: -120, skewX: -12, opacity: 0 },
                            {
                                xPercent: 260,
                                opacity: 1,
                                duration: 2.4,
                                ease: "power2.inOut",
                            },
                            0.9
                        )
                        .to(sheen, { opacity: 0, duration: 0.6 }, 2.7);

                    /* ── Pointer spotlight (desktop only) ── */
                    let removeListeners = () => { };

                    if (fine && spot) {
                        gsap.set(spot, {
                            xPercent: -50,
                            yPercent: -50,
                            x: section.offsetWidth / 2,
                            y: section.offsetHeight / 2,
                        });

                        const qx = gsap.quickTo(spot, "x", {
                            duration: 0.9,
                            ease: "power3.out",
                        });
                        const qy = gsap.quickTo(spot, "y", {
                            duration: 0.9,
                            ease: "power3.out",
                        });

                        const onMove = (e) => {
                            const r = section.getBoundingClientRect();
                            qx(e.clientX - r.left);
                            qy(e.clientY - r.top);
                        };
                        const onEnter = () =>
                            gsap.to(spot, {
                                opacity: 1,
                                duration: 0.6,
                                overwrite: "auto",
                            });
                        const onLeave = () =>
                            gsap.to(spot, {
                                opacity: 0,
                                duration: 0.8,
                                overwrite: "auto",
                            });

                        section.addEventListener("pointermove", onMove);
                        section.addEventListener("pointerenter", onEnter);
                        section.addEventListener("pointerleave", onLeave);

                        removeListeners = () => {
                            section.removeEventListener("pointermove", onMove);
                            section.removeEventListener(
                                "pointerenter",
                                onEnter
                            );
                            section.removeEventListener(
                                "pointerleave",
                                onLeave
                            );
                        };
                    }

                    return () => {
                        removeListeners();
                        logo.classList.remove("hero-grid__logo-wrap--breathing");
                    };
                }
            );

            return () => mm.revert();
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
            {/* Red gradient cells separated by thin black gutters */}
            <div className="hero-grid__cells" aria-hidden={false}>
                {Array.from({ length: CELL_COUNT }, (_, i) =>
                    i === CENTER_INDEX ? (
                        <div
                            key={i}
                            className="hero-grid__cell hero-grid__cell--center"
                        >
                            <div ref={logoRef} className="hero-grid__logo-wrap">
                                <img
                                    src={LOGO_SRC}
                                    alt="Noir Bistro"
                                    fetchPriority="high"
                                    draggable="false"
                                    className="hero-grid__logo"
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            key={i}
                            className="hero-grid__cell"
                            aria-hidden="true"
                        />
                    )
                )}
            </div>

            {/* Light layers */}
            <div ref={sheenRef} className="hero-grid__sheen" aria-hidden="true" />
            <div ref={spotRef} className="hero-grid__spot" aria-hidden="true" />

        </section>
    );
}