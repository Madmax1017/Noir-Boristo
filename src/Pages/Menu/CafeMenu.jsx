import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/* ───────────────────────────── DATA ───────────────────────────── */

const cafeMenuData = {
    bitesVeg: [
        { name: "CLASSIC FRIES", price: "120/-" },
        { name: "PERI PERI FRIES", price: "140/-" },
        { name: "CHEESE FRIES", price: "150/-" },
        { name: "GARLIC CHEESE STICKS", price: "169/-" },
    ],
    bitesNonVeg: [
        { name: "CHICKEN NUGGETS (6PIC)", price: "150/-" },
        { name: "CHICKEN NUGGETS (10PIC)", price: "250/-" },
        { name: "CRISPY CHICKEN FINGERS (8PIC)", price: "210/-" },
        { name: "CRISPY FRIED CHICKEN (2PIC)", price: "189/-" },
        { name: "CRISPY FRIED CHICKEN (4PIC)", price: "340/-" },
    ],
    stacksVegBurgers: [
        { name: "ALOO TIKKI BURGER", price: "69/-" },
        { name: "NOIR VEG BURGER", price: "139/-" },
        { name: "VEG COLESLAW BURGER", price: "139/-" },
        { name: "PERI PERI VEG BURGER", price: "149/-" },
    ],
    stacksNonVegBurgers: [
        { name: "NOIR CHICKEN BURGER", price: "169/-" },
        { name: "PERI PERI CHICKEN BURGER", price: "179/-" },
        { name: "SEEKH SALAMI BURGER", price: "189/-" },
        { name: "CHICKEN COLESLAW MELT", price: "159/-" },
    ],
    grillsVegSandwiches: [
        { name: "CORN CHEESE MELT", price: "119/-" },
        { name: "NOIR VEG GRILL", price: "129/-" },
        { name: "PANEER TIKKI GRILL", price: "139/-" },
        { name: "VEG COLESLAW MELT", price: "139/-" },
    ],
    grillsNonVegSandwiches: [
        { name: "NOIR CHICKEN GRILL", price: "149/-" },
        { name: "CHICKEN COLESLAW MELT", price: "159/-" },
        { name: "SPICY PERI PERI CHICKEN", price: "159/-" },
    ],
    rollsVeg: [
        { name: "ALOO TIKKI ROLL", price: "89/-" },
        { name: "CHILLI PANEER ROLL", price: "99/-" },
        { name: "TIKKA PANEER ROLL", price: "129/-" },
        { name: "PERI PERI VEG ROLL", price: "129/-" },
    ],
    rollsNonVeg: [
        { name: "CHICKEN TIKKA ROLL", price: "139/-" },
        { name: "PERI PERI CHICKEN ROLL", price: "139/-" },
        { name: "CHILLI CHICKEN ROLL", price: "139/-" },
        { name: "SCHEZWAN CHICKEN ROLL", price: "139/-" },
    ],
    vegPizza: [
        { name: "CHEESY MARGHERITA", p: "120", m: "199", l: "299" },
        { name: "TOMATO & CORN", p: "130", m: "199", l: "299" },
        { name: "SWEET HEART", p: "159", m: "279", l: "369" },
        { name: "MUSHROOM PAPRIKA", p: "159", m: "279", l: "369" },
        { name: "VEG PAPRIKA PIZZA", p: "159", m: "279", l: "369" },
        { name: "PANEER TIKKA", p: "159", m: "279", l: "369" },
        { name: "GARDEN SPECIAL", p: "189", m: "279", l: "369" },
        { name: "LOVER BITE", p: "189", m: "299", l: "399" },
        { name: "FAIRY PANEER PIZZA", p: "189", m: "299", l: "399" },
    ],
    nonVegPizza: [
        { name: "SEEKH KEBAB", p: "140", m: "229", l: "349" },
        { name: "CHICKEN SALAMI PIZZA", p: "140", m: "229", l: "349" },
        { name: "CHICKEN TIKKA", p: "169", m: "289", l: "399" },
        { name: "CALIFORNIA CHICKEN", p: "199", m: "299", l: "429" },
        { name: "MEAT BLAST", p: "199", m: "299", l: "429" },
        { name: "TEXAS CHICKEN", p: "199", m: "299", l: "429" },
        { name: "HOT CHICKEN", p: "199", m: "299", l: "499" },
        { name: "BUTTER CHICKEN PIZZA", p: "199", m: "299", l: "429" },
        { name: "NOIR BISTRO CHICKEN", p: "-", m: "-", l: "389" },
        { name: "NOIR SPECIAL PIZZA", p: "-", m: "-", l: "399" },
    ],
    pastaVeg: [
        { name: "CLASSIC RED PASTA", price: "159/-" },
        { name: "CREAMY WHITE PASTA", price: "169/-" },
        { name: "PESTO VEG PASTA", price: "199/-" },
    ],
    pastaNonVeg: [
        { name: "CLASSIC CHICKEN RED PASTA", price: "179/-" },
        { name: "CREAMY CHICKEN PASTA", price: "189/-" },
        { name: "PESTO CHICKEN PASTA", price: "249/-" },
    ],
    sips: [
        { name: "CLASSIC COLD COFFEE", price: "59/-" },
        { name: "THICK COLD COFFEE", price: "99/-" },
        { name: "NOIR MELON MOJITO", price: "99/-" },
        { name: "NOIR TANG", price: "99/-" },
        { name: "KITKAT SHAKE", price: "149/-" },
        { name: "OREO SHAKE", price: "149/-" },
    ],
    indulgenceAndSweet: [
        { name: "SIZZLING BROWNIE", price: "189/-" },
        { name: "CHOCOLATE LAVA", price: "110/-" },
        { name: "RED VELVET LAVA", price: "110/-" },
    ],
};

const SECTIONS = [
    {
        id: "bites",
        tab: "Bites",
        title: "Bites",
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.bitesVeg },
            { label: "Non-veg", veg: false, items: cafeMenuData.bitesNonVeg },
        ],
    },
    {
        id: "stacks",
        tab: "Stacks",
        title: "Stacks",
        subtitle: "Burgers",
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.stacksVegBurgers },
            { label: "Non-veg", veg: false, items: cafeMenuData.stacksNonVegBurgers },
        ],
    },
    {
        id: "grills",
        tab: "Grills",
        title: "Grills",
        subtitle: "Sandwiches",
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.grillsVegSandwiches },
            { label: "Non-veg", veg: false, items: cafeMenuData.grillsNonVegSandwiches },
        ],
    },
    {
        id: "rolls",
        tab: "Rolls",
        title: "Rolls",
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.rollsVeg },
            { label: "Non-veg", veg: false, items: cafeMenuData.rollsNonVeg },
        ],
    },
    {
        id: "pizza",
        tab: "Pizza",
        title: "Pizza",
        table: true,
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.vegPizza },
            { label: "Non-veg", veg: false, items: cafeMenuData.nonVegPizza },
        ],
    },
    {
        id: "pasta",
        tab: "Pasta",
        title: "Pasta",
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.pastaVeg },
            { label: "Non-veg", veg: false, items: cafeMenuData.pastaNonVeg },
        ],
    },
    {
        id: "sips",
        tab: "Sips",
        title: "Sips",
        groups: [{ items: cafeMenuData.sips }],
    },
    {
        id: "sweet",
        tab: "Sweet",
        title: "Indulgence & Sweet",
        groups: [{ items: cafeMenuData.indulgenceAndSweet }],
    },
];

const SIZES = [
    { key: "p", short: "P", label: "Personal" },
    { key: "m", short: "M", label: "Medium" },
    { key: "l", short: "L", label: "Large" },
];

/* Image bands that break up the text. Swap `src` for real photography. */
const PLACEHOLDER = "/images/ambience/placeholder-dish.jpg";

const BANDS = {
    stacks: [
        { src: PLACEHOLDER, alt: "Noir Bistro burger", className: "md:col-span-7 aspect-[16/10]" },
        { src: PLACEHOLDER, alt: "Noir Bistro fries", className: "md:col-span-5 aspect-[4/5]" },
    ],
    rolls: [
        { src: PLACEHOLDER, alt: "Noir Bistro roll", className: "md:col-span-4 aspect-[3/4]" },
        { src: PLACEHOLDER, alt: "Noir Bistro pizza", className: "md:col-span-4 aspect-[3/4] md:mt-12" },
        { src: PLACEHOLDER, alt: "Noir Bistro sandwich", className: "md:col-span-4 aspect-[3/4]" },
    ],
    pasta: [
        { src: PLACEHOLDER, alt: "Noir Bistro pasta", className: "md:col-span-5 aspect-[4/5]" },
        { src: PLACEHOLDER, alt: "Noir Bistro drinks", className: "md:col-span-7 aspect-[16/10] md:self-end" },
    ],
};

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────────────── SMALL PARTS ─────────────────────────── */

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

const MenuImage = ({ src = PLACEHOLDER, alt, className = "" }) => {
    const [failed, setFailed] = useState(false);

    return (
        <figure
            data-frame
            className={`relative overflow-hidden border border-noir-red/50 bg-noir-red/10 ${className}`}
        >
            {failed ? (
                <div className="grid h-full w-full place-items-center p-4 text-center font-anton text-xl uppercase tracking-wide text-noir-red/70">
                    {alt}
                </div>
            ) : (
                <img
                    data-parallax
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onError={() => setFailed(true)}
                    className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
                />
            )}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noir-black/70 to-transparent"
            />
        </figure>
    );
};

const ImageBand = ({ images }) => (
    <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-10 sm:py-12 md:grid-cols-12 md:gap-6">
        {images.map((img) => (
            <MenuImage key={img.alt} {...img} />
        ))}
    </div>
);

const ItemList = ({ items, columns }) => (
    <ul
        className={
            columns ? "md:grid md:grid-cols-2 md:gap-x-12" : undefined
        }
    >
        {items.map((item) => (
            <li
                key={item.name}
                data-item
                className="group flex items-baseline gap-3 py-3"
            >
                <span className="font-anton text-xl uppercase tracking-wide text-white/90 transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                    {item.name}
                </span>
                <span
                    aria-hidden="true"
                    className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-noir-red/40"
                />
                <span className="shrink-0 whitespace-nowrap font-anton text-xl text-noir-red sm:text-2xl">
                    {item.price}
                </span>
            </li>
        ))}
    </ul>
);

const Price = ({ value }) =>
    value === "-" ? (
        <>
            <span aria-hidden="true">&mdash;</span>
            <span className="sr-only">Not available</span>
        </>
    ) : (
        value
    );

const SizeTable = ({ caption, items }) => (
    <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
            <tr className="font-anton text-sm uppercase tracking-wide text-white/60">
                <th scope="col" className="py-2 pr-2 font-normal">
                    <span className="sr-only">Pizza</span>
                </th>
                {SIZES.map((s) => (
                    <th
                        key={s.key}
                        scope="col"
                        className="w-14 py-2 text-right font-normal sm:w-24"
                    >
                        <span aria-hidden="true" className="sm:hidden">
                            {s.short}
                        </span>
                        <span className="sr-only sm:not-sr-only">{s.label}</span>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {items.map((item) => (
                <tr
                    key={item.name}
                    data-item
                    className="group border-t border-noir-red/25"
                >
                    <th
                        scope="row"
                        className="py-3 pr-2 text-left font-anton text-lg font-normal uppercase tracking-wide text-white/90 transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl"
                    >
                        {item.name}
                    </th>
                    {SIZES.map((s) => (
                        <td
                            key={s.key}
                            className="py-3 text-right font-anton text-lg text-noir-red sm:text-2xl"
                        >
                            <Price value={item[s.key]} />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

/* ───────────────────────────── COMPONENT ───────────────────────────── */

/**
 * topOffset: height (px) of your site's fixed navbar, if any, so the
 * category tabs stick just below it.
 */
export default function CafeMenu({ topOffset = 0 }) {
    const rootRef = useRef(null);
    const navRef = useRef(null);
    const tabsRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabRefs = useRef({});
    const lockRef = useRef(false); // true while a tab click is scrolling the page
    const indicatorReadyRef = useRef(false);

    const [active, setActive] = useState(SECTIONS[0].id);
    const activeRef = useRef(active);
    activeRef.current = active;

    const placeIndicator = (animate) => {
        const tab = tabRefs.current[activeRef.current];
        const indicator = indicatorRef.current;
        if (!tab || !indicator) return;

        const props = { x: tab.offsetLeft, width: tab.offsetWidth };
        if (animate && !prefersReducedMotion()) {
            gsap.to(indicator, { ...props, duration: 0.5, ease: "power3.out" });
        } else {
            gsap.set(indicator, props);
        }
    };

    /* ── Page reveals, scroll tracking, progress bar ── */
    const { contextSafe } = useGSAP(
        () => {
            const root = rootRef.current;
            const mm = gsap.matchMedia();

            // Which section is on screen drives the active tab
            gsap.utils.toArray("[data-section]").forEach((el) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 45%",
                    end: "bottom 45%",
                    onToggle: (self) => {
                        if (self.isActive && !lockRef.current) {
                            setActive(el.dataset.section);
                        }
                    },
                });
            });

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // Hero intro
                gsap.timeline({ defaults: { ease: "power4.out" } })
                    .from("[data-hero-line]", {
                        yPercent: 115,
                        duration: 1.1,
                        stagger: 0.12,
                    })
                    .from(
                        "[data-hero-fade]",
                        { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 },
                        "-=0.6"
                    );

                // Page scroll progress under the tabs
                gsap.fromTo(
                    "[data-progress]",
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: root,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: true,
                        },
                    }
                );

                // Section headings
                gsap.utils.toArray("[data-section]").forEach((sec) => {
                    gsap
                        .timeline({
                            defaults: { ease: "power4.out" },
                            scrollTrigger: {
                                trigger: sec,
                                start: "top 75%",
                                once: true,
                            },
                        })
                        .from(sec.querySelector("[data-line]"), {
                            yPercent: 115,
                            duration: 1,
                        })
                        .from(
                            sec.querySelectorAll("[data-fade]"),
                            { opacity: 0, y: 16, duration: 0.6, stagger: 0.08 },
                            "-=0.6"
                        );
                });

                // Menu rows stagger in as each group scrolls into view
                gsap.utils.toArray("[data-group]").forEach((group) => {
                    gsap.from(group.querySelectorAll("[data-item]"), {
                        opacity: 0,
                        y: 24,
                        duration: 0.7,
                        stagger: 0.05,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: group,
                            start: "top 82%",
                            once: true,
                        },
                    });
                });

                // Image cards: wipe-in + gentle parallax
                gsap.utils.toArray("[data-frame]").forEach((frame) => {
                    gsap.from(frame, {
                        clipPath: "inset(0% 0% 100% 0%)",
                        duration: 1.1,
                        ease: "expo.inOut",
                        scrollTrigger: {
                            trigger: frame,
                            start: "top 85%",
                            once: true,
                        },
                    });

                    const img = frame.querySelector("[data-parallax]");
                    if (img) {
                        gsap.fromTo(
                            img,
                            { yPercent: -5 },
                            {
                                yPercent: 5,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: frame,
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            }
                        );
                    }
                });
            });

            // Keep the tab underline aligned after fonts load / resize
            placeIndicator(false);
            document.fonts?.ready.then(() => placeIndicator(false));
            const onResize = () => placeIndicator(false);
            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
                mm.revert();
            };
        },
        { scope: rootRef }
    );

    /* ── Active tab: slide the underline and keep the tab in view ── */
    useGSAP(
        () => {
            const tab = tabRefs.current[active];
            const container = tabsRef.current;
            if (!tab || !container) return;

            placeIndicator(indicatorReadyRef.current);
            indicatorReadyRef.current = true;

            container.scrollTo({
                left: tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2,
                behavior: prefersReducedMotion() ? "auto" : "smooth",
            });
        },
        { scope: rootRef, dependencies: [active] }
    );

    /* ── Tab click: smooth scroll to the section ── */
    const goToSection = contextSafe((id) => {
        const el = document.getElementById(`cafe-${id}`);
        if (!el) return;

        const offset = (navRef.current?.offsetHeight || 0) + topOffset;

        lockRef.current = true;
        setActive(id);

        if (prefersReducedMotion()) {
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - offset,
            });
            lockRef.current = false;
            return;
        }

        gsap.to(window, {
            scrollTo: { y: el, offsetY: offset },
            duration: 1.1,
            ease: "power3.inOut",
            onComplete: () => {
                lockRef.current = false;
            },
            onInterrupt: () => {
                lockRef.current = false;
            },
        });
    });

    return (
        <div ref={rootRef} className="bg-noir-black text-noir-red">
            {/* Hero */}
            <header className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-10 sm:pb-14 sm:pt-32">
                <h1 className="font-anton text-[clamp(5rem,22vw,17rem)] uppercase leading-[0.82]">
                    <span className="block overflow-hidden pb-[0.04em]">
                        <span data-hero-line className="block">
                            Cafe
                        </span>
                    </span>
                    <span className="block overflow-hidden pb-[0.04em]">
                        <span data-hero-line className="block">
                            Menu
                        </span>
                    </span>
                </h1>

                <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-anton text-xl uppercase tracking-wide">
                    <li data-hero-fade className="flex items-center gap-2">
                        <DietMark veg />
                        Veg
                    </li>
                    <li data-hero-fade className="flex items-center gap-2">
                        <DietMark veg={false} />
                        Non-veg
                    </li>
                </ul>
            </header>

            {/* Sticky category tabs */}
            <nav
                ref={navRef}
                aria-label="Menu categories"
                style={{ top: topOffset }}
                className="sticky z-30 border-b border-noir-red/30 bg-noir-black/90 backdrop-blur"
            >
                <div
                    ref={tabsRef}
                    className="relative mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
                >
                    {SECTIONS.map((s) => (
                        <button
                            key={s.id}
                            ref={(el) => {
                                tabRefs.current[s.id] = el;
                            }}
                            type="button"
                            onClick={() => goToSection(s.id)}
                            aria-current={active === s.id ? "true" : undefined}
                            className={`shrink-0 px-4 py-4 font-anton text-lg uppercase tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-noir-red sm:text-xl ${active === s.id
                                ? "text-noir-red"
                                : "text-white/50 hover:text-white"
                                }`}
                        >
                            {s.tab}
                        </button>
                    ))}

                    <span
                        ref={indicatorRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-noir-red"
                    />
                </div>

                <div
                    data-progress
                    aria-hidden="true"
                    className="h-[3px] origin-left scale-x-0 bg-noir-red"
                />
            </nav>

            {/* Menu sections */}
            <main>
                {SECTIONS.map((s) => (
                    <div key={s.id}>
                        <section
                            id={`cafe-${s.id}`}
                            data-section={s.id}
                            aria-labelledby={`cafe-${s.id}-title`}
                            className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24"
                        >
                            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                                <h2
                                    id={`cafe-${s.id}-title`}
                                    className="font-anton text-[clamp(3.5rem,12vw,9.5rem)] uppercase leading-[0.85]"
                                >
                                    <span className="block overflow-hidden pb-[0.04em]">
                                        <span data-line className="block">
                                            {s.title}
                                        </span>
                                    </span>
                                </h2>

                                {s.subtitle && (
                                    <p
                                        data-fade
                                        className="font-anton text-2xl uppercase tracking-wide text-white/60 sm:text-3xl"
                                    >
                                        {s.subtitle}
                                    </p>
                                )}
                            </div>

                            <div
                                className={`mt-10 grid gap-12 lg:gap-16 ${s.groups.length > 1 ? "lg:grid-cols-2" : ""
                                    }`}
                            >
                                {s.groups.map((group, i) => (
                                    <div
                                        key={group.label || i}
                                        data-group
                                        className="border-t-4 border-noir-red pt-4"
                                    >
                                        {group.label && (
                                            <div
                                                data-fade
                                                className="mb-2 flex items-center gap-3"
                                            >
                                                <DietMark veg={group.veg} />
                                                <h3 className="font-anton text-2xl uppercase tracking-wide sm:text-3xl">
                                                    {group.label}
                                                </h3>
                                            </div>
                                        )}

                                        {s.table ? (
                                            <SizeTable
                                                caption={`${group.label} pizza prices by size`}
                                                items={group.items}
                                            />
                                        ) : (
                                            <ItemList
                                                items={group.items}
                                                columns={s.groups.length === 1}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {BANDS[s.id] && <ImageBand images={BANDS[s.id]} />}
                    </div>
                ))}
            </main>

            <div className="h-16 sm:h-24" />
        </div>
    );
}