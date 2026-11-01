import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const dishes = [
    {
        id: 1,
        name: "Garden Special",
        displayName: "GARDEN SPECIAL",
        marathiName: "गार्डन स्पेशल",
        category: "VEG",
        image: "/images/dishes/_-GARDEN-SPECIAL-pizza.jpg",
        type: "pizza",
    },
    {
        id: 2,
        name: "Butter Lemon Chicken",
        displayName: "BUTTER LEMON CHICKEN",
        marathiName: "बटर लेमन चिकन",
        category: "NON-VEG",
        image: "/images/dishes/Butter-Lemon-Chicken.jpg",
        type: "starter",
    },
    {
        id: 3,
        name: "California Chicken Pizza",
        displayName: "CALIFORNIA CHICKEN PIZZA",
        marathiName: "कॅलिफोर्निया चिकन पिझ्झा",
        category: "NON-VEG",
        image: "/images/dishes/CALIFORNIYA-CHICKEN-NON-VEG-PIZZA.jpg",
        type: "pizza",
    },
    {
        id: 4,
        name: "Chicken Triple Fried Rice",
        displayName: "CHICKEN TRIPLE FRIED RICE",
        marathiName: "चिकन ट्रिपल फ्राइड राईस",
        category: "NON-VEG",
        image: "/images/dishes/Chicken-Triple-fried-rice-(-NON-VEG-).jpg",
        type: "rice",
    },
    {
        id: 5,
        name: "Dim Sum Noodles Soup",
        displayName: "DIM SUM NOODLES SOUP",
        marathiName: "डिम सम नूडल्स सूप",
        category: "NON-VEG",
        image: "/images/dishes/DIM-SUM-SOUP-NON-VEG.jpg",
        type: "soup",
    },
    {
        id: 6,
        name: "Noir Special Pizza",
        displayName: "NOIR SPECIAL PIZZA",
        marathiName: "न्वार स्पेशल पिझ्झा",
        category: "NON-VEG",
        image: "/images/dishes/NOIR-SPECIAL-PIZZA-NON---VEG.jpg",
        type: "pizza",
    },
];

/* Anton has no Devanagari glyphs, so Marathi needs its own font stack.
   Add "Noto Sans Devanagari" (or Mukta) to your site fonts for best results. */
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

export default function DishesSection() {
    const sectionRef = useRef(null);
    const frameRef = useRef(null);

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

    /* ── Entrance animation: runs on mount and after every slide change ── */
    const { contextSafe } = useGSAP(
        () => {
            const section = sectionRef.current;
            const frame = frameRef.current;
            if (!section || !frame) return;

            const img = frame.querySelector("img");
            const wm = section.querySelector("[data-wm]");
            const texts = Array.from(section.querySelectorAll("[data-text]"));
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

        const section = sectionRef.current;
        const frame = frameRef.current;
        const wm = section.querySelector("[data-wm]");
        const texts = Array.from(section.querySelectorAll("[data-text]"));

        gsap.timeline({
            defaults: { ease: "power3.in" },
            onComplete: () => setIndex(next),
        })
            .to(
                texts,
                { yPercent: -115, duration: 0.45, stagger: 0.04 },
                0
            )
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

        // Image follows the finger a little for tactile feedback
        if (Math.abs(d.dx) > Math.abs(d.dy)) {
            gsap.to(frameRef.current, {
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
            gsap.to(frameRef.current, {
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
        <section
            id="dishes"
            ref={sectionRef}
            aria-roledescription="carousel"
            aria-label="Noir Bistro dishes"
            className="relative flex min-h-[100svh] flex-col overflow-hidden bg-noir-red text-noir-black"
        >
            {/* Header: title + navigation */}
            <header className="relative z-10 flex items-start justify-between gap-4 px-5 pt-6 sm:px-10 sm:pt-10">
                <h2 className="font-anton text-4xl uppercase leading-none sm:text-6xl">
                    Our dishes
                </h2>

                <div className="flex gap-2 sm:gap-3">
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
            </header>

            {/* Stage: swipeable dish image */}
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
                {/* Watermark: the dish type */}
                <span
                    data-wm
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-anton text-[clamp(8rem,30vw,26rem)] uppercase leading-none text-noir-black/10"
                >
                    {dish.type}
                </span>

                <div
                    ref={frameRef}
                    className="relative aspect-[4/5] w-[min(78vw,calc(54svh*0.8),24rem)] overflow-hidden border-4 border-noir-black bg-noir-black md:aspect-square md:w-[min(54svh,34rem)]"
                >
                    <img
                        src={dish.image}
                        alt={dish.name}
                        draggable="false"
                        onDragStart={(e) => e.preventDefault()}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* Footer: counter (left) + dish details (right) */}
            <footer className="relative z-10 flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-10">
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
            </footer>

            {/* Screen-reader announcement on slide change */}
            <p className="sr-only" aria-live="polite">
                {`Dish ${index + 1} of ${dishes.length}: ${dish.name}, ${dish.category}`}
            </p>
        </section>
    );
}