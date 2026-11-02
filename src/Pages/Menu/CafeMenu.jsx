import { useEffect, useRef, useState } from "react";
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
        { name: "VEG COLESLAW MELT", price: "129/-" },
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

const SIZES = [
    { key: "p", short: "P", label: "Personal" },
    { key: "m", short: "M", label: "Medium" },
    { key: "l", short: "L", label: "Large" },
];

const PLACEHOLDER = "/images/ambience/placeholder-dish.jpg";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────── LINE ILLUSTRATIONS (solid black strokes) ─────────────────── */

const Art = ({ children }) => (
    <svg
        data-art
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-full w-full"
    >
        {children}
    </svg>
);

const FriesArt = () => (
    <Art>
        <path d="M44 62L40 32M52 62L50 22M60 62L62 30M68 62L72 20M76 62L82 34" />
        <path d="M32 62H88L82 106H38Z" />
        <path d="M36 80H84" />
    </Art>
);

const BurgerArt = () => (
    <Art>
        <path d="M24 52C24 30 44 20 60 20C76 20 96 30 96 52Z" />
        <path d="M46 34l4 2M62 28l4 2M74 38l4 2M56 42l4 2" />
        <path d="M22 62q6.33 7 12.67 0t12.67 0t12.67 0t12.67 0t12.67 0t12.67 0" />
        <path d="M27 70H93a5 5 0 0 1 0 10H27a5 5 0 0 1 0-10Z" />
        <path d="M24 88H96V92C96 100 90 104 82 104H38C30 104 24 100 24 92Z" />
    </Art>
);

const SandwichArt = () => (
    <Art>
        <path d="M48 18q4-5 0-10M60 14q4-5 0-10M72 18q4-5 0-10" />
        <path d="M18 90L60 28L102 90Z" />
        <path d="M26 78q8.5 7 17 0t17 0t17 0t17 0" />
        <path d="M38 62H82" />
    </Art>
);

const RollArt = () => (
    <Art>
        <g transform="rotate(-28 60 60)">
            <path d="M34 44H86A10 16 0 0 1 86 76H34" />
            <ellipse cx="34" cy="60" rx="10" ry="16" />
            <ellipse cx="34" cy="60" rx="4.5" ry="8" />
            <path d="M62 44Q58 60 62 76" />
        </g>
    </Art>
);

const PizzaArt = () => (
    <Art>
        <path d="M60 108L22 34Q60 14 98 34Z" />
        <path d="M27 44Q60 26 93 44" />
        <circle cx="48" cy="58" r="6" />
        <circle cx="69" cy="58" r="5.5" />
        <circle cx="60" cy="82" r="5" />
    </Art>
);

const PastaArt = () => (
    <Art>
        <path d="M22 66H98C98 90 82 104 60 104C38 104 22 90 22 66Z" />
        <path d="M32 66C32 52 44 52 44 62S56 72 58 58S72 46 74 60S86 70 88 66" />
        <path d="M40 58C42 40 58 38 60 50S76 44 78 56" />
        <path d="M86 12V28a6 6 0 0 0 12 0V12M92 34V56" />
    </Art>
);

const SipsArt = () => (
    <Art>
        <path d="M38 36H82L76 106H44Z" />
        <path d="M41 56H79" />
        <path d="M64 30L72 8H86" />
        <path d="M48 70h10v10H48ZM62 84h10v10H62Z" />
        <circle cx="38" cy="36" r="9" />
        <path d="M29 36H47M38 27V45" />
    </Art>
);

const SweetArt = () => (
    <Art>
        <ellipse cx="60" cy="90" rx="42" ry="8" />
        <path d="M32 80C32 52 88 52 88 80Z" />
        <path d="M48 66v8a3 3 0 0 0 6 0v-6M66 64v10a3 3 0 0 0 6 0v-8" />
        <circle cx="60" cy="48" r="5" />
        <path d="M60 43q4-10 10-12" />
    </Art>
);

/* ─────────────────────────── SECTIONS & IMAGES ─────────────────────────── */

const SECTIONS = [
    {
        id: "bites",
        tab: "Bites",
        title: "Bites",
        Art: FriesArt,
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
        Art: BurgerArt,
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
        Art: SandwichArt,
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.grillsVegSandwiches },
            { label: "Non-veg", veg: false, items: cafeMenuData.grillsNonVegSandwiches },
        ],
    },
    {
        id: "rolls",
        tab: "Rolls",
        title: "Rolls",
        Art: RollArt,
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.rollsVeg },
            { label: "Non-veg", veg: false, items: cafeMenuData.rollsNonVeg },
        ],
    },
    {
        id: "pizza",
        tab: "Pizza",
        title: "Pizza",
        Art: PizzaArt,
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
        Art: PastaArt,
        groups: [
            { label: "Veg", veg: true, items: cafeMenuData.pastaVeg },
            { label: "Non-veg", veg: false, items: cafeMenuData.pastaNonVeg },
        ],
    },
    {
        id: "sips",
        tab: "Sips",
        title: "Sips",
        Art: SipsArt,
        groups: [{ items: cafeMenuData.sips }],
    },
    {
        id: "sweet",
        tab: "Sweet",
        title: "Sweet",
        subtitle: "Indulgence",
        Art: SweetArt,
        groups: [{ items: cafeMenuData.indulgenceAndSweet }],
    },
];

const BANDS = {
    stacks: [
        { alt: "Noir Bistro burger", shape: "circle", className: "w-[min(72vw,24rem)]" },
        { alt: "Noir Bistro fries", shape: "arch", className: "w-[min(56vw,17rem)] md:-ml-12" },
    ],
    rolls: [
        { alt: "Noir Bistro roll", shape: "arch", className: "w-[min(56vw,16rem)]" },
        { alt: "Noir Bistro pizza", shape: "circle", className: "w-[min(72vw,26rem)] md:-ml-12" },
        { alt: "Noir Bistro sandwich", shape: "arch", className: "w-[min(56vw,16rem)] md:-ml-12" },
    ],
    pasta: [
        { alt: "Noir Bistro pasta", shape: "circle", className: "w-[min(72vw,22rem)]" },
        { alt: "Noir Bistro drinks", shape: "circle", className: "w-[min(46vw,13rem)] md:-ml-8 md:mb-4" },
    ],
};

/* ─────────────────────────── SMALL PARTS ─────────────────────────── */

const Dot = ({ veg }) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
        <circle
            cx="12"
            cy="12"
            r="9"
            fill={veg ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="3"
        />
    </svg>
);

const DoubleRule = () => (
    <div aria-hidden="true">
        <div className="border-t-[3px] border-noir-black" />
        <div className="mt-[3px] border-t border-noir-black" />
    </div>
);

const Ring = ({ id, text, className = "" }) => (
    <svg
        data-ring
        viewBox="0 0 200 200"
        aria-hidden="true"
        className={`pointer-events-none absolute ${className}`}
    >
        <defs>
            <path
                id={id}
                d="M100 100m-88 0a88 88 0 1 1 176 0a88 88 0 1 1-176 0"
            />
        </defs>
        <text
            className="font-anton"
            fill="currentColor"
            fontSize="10.5"
            letterSpacing="1.9"
        >
            <textPath href={`#${id}`} textLength="548" lengthAdjust="spacing">
                {text}
            </textPath>
        </text>
    </svg>
);

const RING_TEXT = "NOIR BISTRO • CONTINENTAL MENU • ".repeat(3);

const FramedImage = ({
    src = PLACEHOLDER,
    alt,
    shape = "circle",
    className = "",
}) => {
    const [failed, setFailed] = useState(false);
    const isArch = shape === "arch";

    return (
        <figure
            data-circle
            className={`relative shrink-0 overflow-hidden border-[3px] border-noir-black bg-noir-black/10 ${isArch
                    ? "aspect-[3/4] rounded-t-full rounded-b-[2rem]"
                    : "aspect-square rounded-full"
                } ${className}`}
        >
            {failed ? (
                <div className="grid h-full w-full place-items-center p-6 text-center font-anton text-xl uppercase tracking-wide">
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
        </figure>
    );
};

const ImageBand = ({ images }) => (
    <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-center gap-6 px-5 py-6 sm:px-10 sm:py-10 md:flex-nowrap md:gap-0">
        {images.map((img) => (
            <FramedImage key={img.alt} {...img} />
        ))}
    </div>
);

const Price = ({ value }) => {
    const [amount, suffix] = value.split("/");
    return (
        <span className="whitespace-nowrap">
            <span className="font-anton text-3xl leading-none sm:text-4xl">
                {amount}
            </span>
            {suffix !== undefined && (
                <span
                    className="ml-0.5 font-anton text-sm font-medium"
                >
                    /{suffix}
                </span>
            )}
        </span>
    );
};

const itemNameClass =
    "text-lg font-anton uppercase tracking-[0.05em] sm:text-xl";

const ItemList = ({ items }) => (
    <ul>
        {items.map((item) => (
            <li
                key={item.name}
                data-item
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-noir-black/30 py-4"
            >
                <span className={itemNameClass}>
                    {item.name}
                </span>
                <Price value={item.price} />
            </li>
        ))}
    </ul>
);

const SizePrice = ({ value }) =>
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
            <tr className="font-anton text-sm font-medium">
                <th scope="col" className="py-2 pr-2">
                    <span className="sr-only">Pizza</span>
                </th>
                {SIZES.map((s) => (
                    <th
                        key={s.key}
                        scope="col"
                        className="w-14 py-2 text-right font-anton font-medium sm:w-24"
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
                    className="border-t border-noir-black/30"
                >
                    <th
                        scope="row"
                        className={`py-4 pr-2 text-left ${itemNameClass}`}
                    >
                        {item.name}
                    </th>
                    {SIZES.map((s) => (
                        <td
                            key={s.key}
                            className="py-4 text-right font-anton text-2xl sm:text-3xl"
                        >
                            <SizePrice value={item[s.key]} />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const CategoryBadge = ({ section }) => {
    const { id, title, subtitle, Art: Illustration } = section;

    return (
        <div
            data-badge
            className="relative mx-auto aspect-square w-[min(72vw,24rem)] lg:w-full lg:max-w-[26rem]"
        >
            <Ring
                id={`ring-${id}`}
                text={RING_TEXT}
                className="-inset-[9%] h-[118%] w-[118%]"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-[3px] border-noir-black">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 rounded-full border border-noir-black/40"
                />

                <div className="h-[42%] w-[42%]">
                    <Illustration />
                </div>

                <h2
                    id={`cafe-${id}-title`}
                    className="mt-1 font-anton text-[clamp(2.75rem,7vw,5rem)] uppercase leading-[0.9]"
                >
                    <span className="block overflow-hidden pb-[0.05em]">
                        <span data-line className="block">
                            {title}
                        </span>
                    </span>
                </h2>

                {subtitle && (
                    <p
                        data-fade
                        className="font-anton text-xl font-semibold uppercase tracking-wider"
                    >
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────── COMPONENT ───────────────────────────── */

export default function CafeMenu({ topOffset = 0 }) {
    const rootRef = useRef(null);
    const navRef = useRef(null);
    const tabsRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabRefs = useRef({});
    const lockRef = useRef(false);
    const indicatorReadyRef = useRef(false);

    const [active, setActive] = useState(SECTIONS[0].id);
    const [navHeight, setNavHeight] = useState(0);
    const activeRef = useRef(active);
    activeRef.current = active;

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const update = () => setNavHeight(nav.offsetHeight);
        update();

        const ro = new ResizeObserver(update);
        ro.observe(nav);
        return () => ro.disconnect();
    }, []);

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

    const { contextSafe } = useGSAP(
        () => {
            const root = rootRef.current;
            const mm = gsap.matchMedia();

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
                gsap.timeline({ defaults: { ease: "power4.out" } })
                    .from("[data-hero-line]", {
                        yPercent: 115,
                        duration: 1.1,
                        stagger: 0.12,
                    })
                    .from(
                        "[data-hero-ring]",
                        { opacity: 0, scale: 0.85, duration: 1.2 },
                        0.2
                    )
                    .from(
                        "[data-hero-fade]",
                        { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 },
                        "-=0.6"
                    );

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

                gsap.utils.toArray("[data-section]").forEach((sec) => {
                    const badge = sec.querySelector("[data-badge]");
                    const ring = sec.querySelector("[data-ring]");
                    const art = sec.querySelector("[data-art]");
                    const strokes = art
                        ? Array.from(art.querySelectorAll("path,circle,ellipse"))
                        : [];

                    gsap.set(strokes, {
                        strokeDasharray: (i, el) => el.getTotalLength(),
                        strokeDashoffset: (i, el) => el.getTotalLength(),
                    });

                    gsap
                        .timeline({
                            defaults: { ease: "power4.out" },
                            scrollTrigger: {
                                trigger: sec,
                                start: "top 70%",
                                once: true,
                            },
                        })
                        .from(badge, {
                            scale: 0.65,
                            opacity: 0,
                            duration: 1.3,
                            ease: "expo.out",
                        })
                        .from(
                            ring,
                            { opacity: 0, scale: 0.85, duration: 1.4 },
                            0.1
                        )
                        .to(
                            strokes,
                            {
                                strokeDashoffset: 0,
                                duration: 1.5,
                                stagger: 0.08,
                                ease: "power2.inOut",
                                clearProps: "strokeDasharray,strokeDashoffset",
                            },
                            0.35
                        )
                        .from(
                            sec.querySelectorAll("[data-line]"),
                            { yPercent: 115, duration: 0.9 },
                            0.6
                        )
                        .from(
                            sec.querySelectorAll("[data-fade]"),
                            { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 },
                            0.8
                        );
                });

                gsap.utils.toArray("[data-ring]").forEach((ring) => {
                    gsap.to(ring, {
                        rotation: 140,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ring.closest("section, header"),
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    });
                });

                gsap.utils.toArray("[data-group]").forEach((group) => {
                    gsap
                        .timeline({
                            scrollTrigger: {
                                trigger: group,
                                start: "top 82%",
                                once: true,
                            },
                        })
                        .from(group.querySelectorAll("[data-rule]"), {
                            scaleX: 0,
                            transformOrigin: "left center",
                            duration: 0.9,
                            ease: "power3.inOut",
                        })
                        .from(
                            group.querySelectorAll("[data-item]"),
                            {
                                opacity: 0,
                                y: 28,
                                duration: 0.8,
                                stagger: 0.06,
                                ease: "power3.out",
                            },
                            0.15
                        );
                });

                gsap.utils.toArray("[data-circle]").forEach((fig) => {
                    gsap.fromTo(
                        fig,
                        { clipPath: "circle(0% at 50% 50%)" },
                        {
                            clipPath: "circle(75% at 50% 50%)",
                            duration: 1.4,
                            ease: "expo.inOut",
                            clearProps: "clipPath",
                            scrollTrigger: {
                                trigger: fig,
                                start: "top 88%",
                                once: true,
                            },
                        }
                    );

                    const img = fig.querySelector("[data-parallax]");
                    if (img) {
                        gsap.fromTo(
                            img,
                            { yPercent: -5 },
                            {
                                yPercent: 5,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: fig,
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            }
                        );
                    }
                });
            });

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
        <div
            ref={rootRef}
            className="overflow-x-clip bg-noir-red text-noir-black"
        >
        {/* Hero */}
        <header className="mx-auto max-w-7xl px-5 pb-12 pt-20 sm:px-10 sm:pb-16 sm:pt-28">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <h1 className="font-anton text-[clamp(3.5rem,11vw,10rem)] uppercase leading-[0.82]">
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span data-hero-line className="block">
                                    Continental
                                </span>
                            </span>
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span data-hero-line className="block">
                                    Menu
                                </span>
                            </span>
                        </h1>

                        <ul
                            className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-anton text-base font-medium uppercase tracking-wider"
                        >
                            <li data-hero-fade className="flex items-center gap-2">
                                <Dot veg />
                                Veg
                            </li>
                            <li data-hero-fade className="flex items-center gap-2">
                                <Dot veg={false} />
                                Non-veg
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <div
                            data-hero-ring
                            className="relative mx-auto w-[min(72vw,24rem)]"
                        >
                            <Ring
                                id="ring-hero"
                                text={RING_TEXT}
                                className="-inset-[9%] h-[118%] w-[118%]"
                            />
                            <FramedImage
                                alt="Noir Bistro signature dish"
                                shape="circle"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </header>
            {/* Sticky category tabs */}
            <nav
                ref={navRef}
                aria-label="Menu categories"
                style={{ top: topOffset }}
                className="sticky z-30 border-y-2 border-noir-black bg-noir-red/95 backdrop-blur"
            >
                <div
                    ref={tabsRef}
                    className="relative mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
                >
                    <span
                        ref={indicatorRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-2 left-0 top-2 w-0 rounded-full bg-noir-black"
                    />

                    {SECTIONS.map((s) => (
                        <button
                            key={s.id}
                            ref={(el) => {
                                tabRefs.current[s.id] = el;
                            }}
                            type="button"
                            onClick={() => goToSection(s.id)}
                            aria-current={active === s.id ? "true" : undefined}
                            className={`relative z-10 shrink-0 rounded-full px-5 py-2 font-anton text-lg uppercase tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir-black sm:text-xl ${active === s.id
                                    ? "text-noir-red"
                                    : "text-noir-black hover:bg-noir-black/10"
                                }`}
                        >
                            {s.tab}
                        </button>
                    ))}
                </div>

                <div
                    data-progress
                    aria-hidden="true"
                    className="h-[3px] origin-left scale-x-0 bg-noir-black"
                />
            </nav>

            {/* Menu sections */}
            <main>
                {SECTIONS.map((s, i) => {
                    const flip = i % 2 === 1;

                    return (
                        <div key={s.id}>
                            <section
                                id={`cafe-${s.id}`}
                                data-section={s.id}
                                aria-labelledby={`cafe-${s.id}-title`}
                                className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24"
                            >
                                <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                                    {/* Circular category badge (sticky on desktop) */}
                                    <div
                                        className={`lg:col-span-5 lg:self-stretch ${flip ? "lg:order-2" : ""
                                            }`}
                                    >
                                        <div
                                            style={{ top: topOffset + navHeight + 32 }}
                                            className="lg:sticky"
                                        >
                                            <CategoryBadge section={s} />
                                        </div>
                                    </div>

                                    {/* Menu items */}
                                    <div
                                        className={`flex flex-col gap-12 lg:col-span-7 ${flip ? "lg:order-1" : ""
                                            }`}
                                    >
                                        {s.groups.map((group, gi) => (
                                            <div key={group.label || gi} data-group>
                                                <div data-rule>
                                                    <DoubleRule />
                                                </div>

                                                {group.label && (
                                                    <div
                                                        data-item
                                                        className="flex items-center gap-3 py-4"
                                                    >
                                                        <Dot veg={group.veg} />
                                                        <h3 className="font-anton text-3xl uppercase tracking-wide">
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
                                                    <ItemList items={group.items} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {BANDS[s.id] && <ImageBand images={BANDS[s.id]} />}
                        </div>
                    );
                })}
            </main>

            <div className="h-16 sm:h-24" />
        </div>
    );
}