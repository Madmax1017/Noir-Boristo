import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dishes from "./data/dishes";
import DishCard from "./components/DishCard";
import DishesTitle from "./components/DishesTitle";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Anton has no Devanagari glyphs, so Marathi needs its own font stack.
   Load "Noto Sans Devanagari" (or Mukta) on your site for best results. */
const MARATHI_FONT =
    '"Noto Sans Devanagari", "Mukta", "Nirmala UI", "Mangal", sans-serif';

const SWIPE_DISTANCE = 50; // px needed to count as a swipe
const pad = (n) => String(n).padStart(2, "0");
const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Square + dot = veg, square + triangle = non-veg */
const DietMark = ({ veg }) => (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
        <rect
            x="2"
            y="2"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
        />
        {veg ? (
            <circle cx="12" cy="12" r="5" fill="currentColor" />
        ) : (
            <path d="M12 6l6 11H6z" fill="currentColor" />
        )}
    </svg>
);

const Arrow = ({ flip = false }) => (
    <svg
        viewBox="0 0 24 24"
        className={`h-6 w-6 ${flip ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        aria-hidden="true"
    >
        <path d="M3 12h17M14 6l6 6-6 6" />
    </svg>
);

export default function SignatureDishes() {
    const sectionRef = useRef(null);

    const [index, setIndex] = useState(0);

    const indexRef = useRef(0);
    const dirRef = useRef(1); // 1 = next, -1 = previous
    const busyRef = useRef(false);
    const firstRunRef = useRef(true);
    const inViewRef = useRef(false);
    const goRef = useRef(() => { });
    const dragRef = useRef({ active: false, x: 0, y: 0, dx: 0, dy: 0 });

    const dish = dishes[index];
    indexRef.current = index;

    const getParts = () => {
        const section = sectionRef.current;
        const frame = section.querySelector("[data-frame]");
        return {
            section,
            frame,
            img: frame.querySelector("img"),
            wm: section.querySelector("[data-wm]"),
            texts: Array.from(section.querySelectorAll("[data-text]")),
        };
    };

    /* ── Entrance animation: runs on mount and after every slide change ── */
    const { contextSafe } = useGSAP(
        () => {
            if (!sectionRef.current) return;

            const { section, frame, img, wm, texts } = getParts();
            const dir = dirRef.current;
            const isFirst = firstRunRef.current;
            firstRunRef.current = false;

            if (prefersReducedMotion()) {
                gsap.set([frame, img, wm, ...texts], { clearProps: "all" });
                busyRef.current = false;
                return;
            }

            busyRef.current = true;

            const tl = gsap.timeline({
                defaults: { ease: "power4.out" },
                scrollTrigger: isFirst
                    ? { trigger: section, start: "top 70%", once: true }
                    : undefined,
                onComplete: () => {
                    busyRef.current = false;
                },
            });

            tl.fromTo(
                frame,
                {
                    clipPath:
                        dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1,
                    ease: "expo.inOut",
                },
                0
            )
                .fromTo(
                    img,
                    { scale: 1.25, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.3, ease: "power3.out" },
                    0.1
                )
                .fromTo(
                    wm,
                    { opacity: 0, xPercent: dir * 10 },
                    { opacity: 1, xPercent: 0, duration: 1.1 },
                    0.1
                )
                .fromTo(
                    texts,
                    { yPercent: 115 },
                    { yPercent: 0, duration: 0.8, stagger: 0.07 },
                    0.35
                );
        },
        { scope: sectionRef, dependencies: [index] }
    );

    /* ── Exit animation, then swap the dish ── */
    const goTo = contextSafe((dir) => {
        if (busyRef.current) return;
        busyRef.current = true;
        dirRef.current = dir;

        const next = (indexRef.current + dir + dishes.length) % dishes.length;

        if (prefersReducedMotion()) {
            setIndex(next);
            return;
        }

        const { frame, wm, texts } = getParts();

        gsap.timeline({
            defaults: { ease: "power3.in" },
            onComplete: () => setIndex(next),
        })
            .to(texts, { yPercent: -115, duration: 0.45, stagger: 0.04 }, 0)
            .to(
                frame,
                {
                    x: 0,
                    clipPath:
                        dir > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
                    duration: 0.6,
                    ease: "expo.in",
                },
                0.05
            )
            .to(wm, { opacity: 0, xPercent: -dir * 10, duration: 0.5 }, 0);
    });

    goRef.current = goTo;

    /* ── Touch / pointer swipe ── */
    const onPointerDown = contextSafe((e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragRef.current = {
            active: true,
            x: e.clientX,
            y: e.clientY,
            dx: 0,
            dy: 0,
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    });

    const onPointerMove = contextSafe((e) => {
        const d = dragRef.current;
        if (!d.active || busyRef.current) return;
        d.dx = e.clientX - d.x;
        d.dy = e.clientY - d.y;

        // Photo follows the finger a little for tactile feedback
        if (Math.abs(d.dx) > Math.abs(d.dy)) {
            gsap.to(getParts().frame, {
                x: d.dx * 0.35,
                duration: 0.25,
                ease: "power3.out",
                overwrite: "auto",
            });
        }
    });

    const endDrag = contextSafe((e) => {
        const d = dragRef.current;
        if (!d.active) return;
        d.active = false;
        e.currentTarget.releasePointerCapture?.(e.pointerId);

        const isSwipe =
            Math.abs(d.dx) > SWIPE_DISTANCE &&
            Math.abs(d.dx) > Math.abs(d.dy) * 1.2;

        if (isSwipe && !busyRef.current) {
            goTo(d.dx < 0 ? 1 : -1); // swipe left = next
        } else {
            gsap.to(getParts().frame, {
                x: 0,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
            });
        }
    });

    /* ── Keyboard arrows (only while the section is on screen) ── */
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                inViewRef.current = entry.isIntersecting;
            },
            { threshold: 0.4 }
        );
        io.observe(section);

        const onKeyDown = (e) => {
            if (!inViewRef.current) return;
            const tag = e.target?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
            if (e.key === "ArrowRight") goRef.current(1);
            else if (e.key === "ArrowLeft") goRef.current(-1);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            io.disconnect();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    /* ── Preload neighbouring images so swaps never flash blank ── */
    useEffect(() => {
        [1, -1].forEach((step) => {
            const n = dishes[(index + step + dishes.length) % dishes.length];
            const img = new Image();
            img.src = n.image;
        });
    }, [index]);

    const isVeg = dish.category === "VEG";

    return (
        <>
            <DishesTitle />

            <section
                ref={sectionRef}
                id="menu"
                aria-roledescription="carousel"
                aria-label="Noir Bistro signature dishes"
                className="relative flex min-h-[100svh] flex-col overflow-hidden bg-noir-red text-noir-black"
            >
                {/* Navigation arrows */}
                <div className="relative z-10 flex justify-end gap-2 px-5 pt-6 sm:gap-3 sm:px-10 sm:pt-10">
                    <button
                        type="button"
                        onClick={() => goTo(-1)}
                        aria-label="Previous dish"
                        className="grid h-12 w-12 place-items-center border-4 border-noir-black transition-colors duration-200 hover:bg-noir-black hover:text-noir-red focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-noir-black sm:h-14 sm:w-14"
                    >
                        <Arrow flip />
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(1)}
                        aria-label="Next dish"
                        className="grid h-12 w-12 place-items-center border-4 border-noir-black bg-noir-black text-noir-red transition-transform duration-200 hover:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-noir-black sm:h-14 sm:w-14"
                    >
                        <Arrow />
                    </button>
                </div>

                {/* Stage: swipeable dish */}
                <div
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${dishes.length}`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className="relative flex flex-1 cursor-grab touch-pan-y select-none items-center justify-center py-6 active:cursor-grabbing"
                >
                    <DishCard dish={dish} />
                </div>

                {/* Footer: counter (left) + dish details (right) */}
                <div className="relative z-10 flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-10">
                    <p className="font-anton leading-none">
                        <span className="block overflow-hidden py-1">
                            <span
                                data-text
                                className="block text-[clamp(3rem,9vw,7rem)]"
                            >
                                {pad(index + 1)}
                                <span className="ml-2 text-[0.4em]">
                                    / {pad(dishes.length)}
                                </span>
                            </span>
                        </span>
                    </p>

                    <div className="ml-auto flex max-w-[60%] flex-col items-end text-right sm:max-w-[50%]">
                        <span className="block overflow-hidden py-1">
                            <span
                                data-text
                                className="flex items-center gap-2 font-anton text-lg uppercase tracking-wide sm:text-xl"
                            >
                                <DietMark veg={isVeg} />
                                {dish.category}
                            </span>
                        </span>

                        <h3 className="block overflow-hidden py-1">
                            <span
                                data-text
                                className="block font-anton text-[clamp(1.75rem,4.5vw,4rem)] uppercase leading-[0.95]"
                            >
                                {dish.displayName}
                            </span>
                        </h3>

                        <span className="block overflow-hidden py-1">
                            <span
                                data-text
                                lang="mr"
                                style={{ fontFamily: MARATHI_FONT }}
                                className="block text-[clamp(1.1rem,2.4vw,1.75rem)] font-semibold leading-snug"
                            >
                                {dish.marathiName}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Screen-reader announcement on slide change */}
                <p className="sr-only" aria-live="polite">
                    {`Dish ${index + 1} of ${dishes.length}: ${dish.name}, ${dish.category}`}
                </p>
            </section>
        </>
    );
}