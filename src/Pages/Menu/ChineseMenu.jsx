import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/* ───────────────────────────── DATA ───────────────────────────── */

const chineseMenuData = {
    soupsVeg: [
        { name: "Veg Manchow Soup", price: "149/-" },
        { name: "Veg Hot & Sour Soup", price: "149/-" },
        { name: "Lemon Garlic Soup", price: "175/-" },
        { name: "Mushroom Garlic Soup", price: "175/-" },
        { name: "Lung Fung Soup", price: "175/-" },
        { name: "Dim Sum Noodle Soup", price: "249/-" },
    ],
    soupsNonVeg: [
        { name: "Chicken Manchow Soup", price: "199/-" },
        { name: "Chicken Hot & Sour Soup", price: "199/-" },
        { name: "Chicken Lemon Garlic Soup", price: "229/-" },
        { name: "Egg Drop Soup", price: "199/-" },
        { name: "Chicken Lang Fung Soup", price: "229/-" },
        { name: "Chicken Dim Sum Noodle Soup", price: "229/-" },
    ],
    startersVeg: [
        { name: "Veg Manchurian", price: "249/-" },
        { name: "Baby Corn Manchurian", price: "249/-" },
        { name: "Paneer Manchurian", price: "249/-" },
        { name: "Flower Manchurian", price: "249/-" },
        { name: "Chilli Paneer", price: "269/-" },
        { name: "Chilli Mushroom", price: "269/-" },
        { name: "Chilli Potato", price: "199/-" },
        { name: "Chilli Flower", price: "199/-" },
        { name: "Veg Crispy", price: "249/-" },
        { name: "Paneer Crispy", price: "299/-" },
        { name: "Honey Chilli Potato", price: "249/-" },
        { name: "Veg Lollipop", price: "299/-" },
        { name: "Chilli Baby Corn", price: "249/-" },
        { name: "Butter Garlic Paneer", price: "299/-" },
        { name: "Cheese Corn Balls", price: "349/-" },
    ],
    startersNonVeg: [
        { name: "Chicken Manchurian", price: "299/-" },
        { name: "Prawns Manchurian", price: "349/-" },
        { name: "Egg Manchurian", price: "269/-" },
        { name: "Chilli Chicken", price: "299/-" },
        { name: "Chilli Egg", price: "269/-" },
        { name: "Chilli Prawns", price: "349/-" },
        { name: "Butter Garlic Prawns", price: "369/-" },
        { name: "Chicken Lollipop", price: "369/-" },
        { name: "Peri Peri Chicken Pops 8 pic", price: "299/-" },
        { name: "Honey Chilli Wings 8 pic", price: "369/-" },
        { name: "Tender Chicken", price: "299/-" },
        { name: "Fire Schezwan Chicken Wings 8 pic", price: "369/-" },
        { name: "Butter Lemon Chicken", price: "299/-" },
        { name: "Chicken Crispy", price: "299/-" },
    ],
    noodlesVeg: [
        { name: "Veg Hakka Noodles", price: "249/-" },
        { name: "Paneer Hakka Noodles", price: "269/-" },
        { name: "Mushroom Hakka Noodles", price: "269/-" },
        { name: "Veg Burnt Garlic Noodles", price: "249/-" },
        { name: "Veg Schezwan Noodles", price: "269/-" },
        { name: "Paneer Schezwan Noodles", price: "299/-" },
        { name: "Mushroom Schezwan Noodles", price: "269/-" },
        { name: "Veg Triple noodles", price: "299/-" },
    ],
    noodlesNonVeg: [
        { name: "Chicken Hakka Noodles", price: "299/-" },
        { name: "Egg Hakka Noodles", price: "269/-" },
        { name: "Prawns Hakka Noodles", price: "349/-" },
        { name: "Chicken Burnt Garlic Noodles", price: "299/-" },
        { name: "Chicken Schezwan Noodles", price: "329/-" },
        { name: "Egg Schezwan Noodles", price: "289/-" },
        { name: "Prawns Schezwan Noodles", price: "389/-" },
        { name: "Chicken Triple noodles", price: "389/-" },
    ],
    riceBowlsVeg: [
        { name: "Veg Fried Rice Bowl", price: "249/-" },
        { name: "Paneer Fried Rice Bowl", price: "269/-" },
        { name: "Mushroom Fried Rice Bowl", price: "269/-" },
        { name: "Veg Burnt Garlic Fried Rice Bowl", price: "249/-" },
        { name: "Veg Schezwan Fried Rice Bowl", price: "269/-" },
        { name: "Paneer Schezwan Fried Rice Bowl", price: "269/-" },
        { name: "Mushroom Schezwan Fried Rice Bowl", price: "269/-" },
        { name: "Paneer Chilli Rice Bowl", price: "349/-" },
        { name: "Mushroom Chilli Rice Bowl", price: "269/-" },
        { name: "Veg Manchurian Rice Bowl", price: "349/-" },
        { name: "Mushroom Manchurian Rice Bowl", price: "349/-" },
        { name: "Veg Triple tried Rice", price: "349/-" },
    ],
    riceBowlsNonVeg: [
        { name: "Chicken Fried Rice Bowl", price: "299/-" },
        { name: "Prawns Fried Rice Bowl", price: "349/-" },
        { name: "Egg Fried Rice Bowl", price: "269/-" },
        { name: "Chicken Burnt Garlic Fried Rice Bowl", price: "269/-" },
        { name: "Chicken Schezwan Fried Rice Bowl", price: "329/-" },
        { name: "Prawns Schezwan Fried Rice Bowl", price: "429/-" },
        { name: "Egg Schezwan Fried Rice Bowl", price: "299/-" },
        { name: "Chicken Chilli Rice Bowl", price: "389/-" },
        { name: "Prawns Chilli Rice Bowl", price: "429/-" },
        { name: "Egg Chilli Rice Bowl", price: "269/-" },
        { name: "Chicken Manchurian Rice Bowl", price: "389/-" },
        { name: "Egg Manchurian Rice Bowl", price: "389/-" },
        { name: "Chicken Triple fried rice", price: "389/-" },
        { name: "Paneer Manchurian Rice Bowl", price: "349/-" },
    ],
};

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

const SoupBowlArt = () => (
    <Art>
        <path d="M36 50q5-6 0-12t0-12M50 48q5-6 0-12t0-12" />
        <path d="M70 60L98 12M80 60L108 16" />
        <path d="M20 62C20 88 38 104 60 104C82 104 100 88 100 62" />
        <ellipse cx="60" cy="62" rx="40" ry="8" />
        <path d="M48 106H72" />
    </Art>
);

const SoupSpoonArt = () => (
    <Art>
        <path d="M34 50q5-6 0-12t0-12M48 48q5-6 0-12t0-12M62 50q5-6 0-12t0-12" />
        <path d="M20 62C20 88 38 104 60 104C82 104 100 88 100 62" />
        <ellipse cx="60" cy="62" rx="40" ry="8" />
        <ellipse cx="94" cy="26" rx="11" ry="8" transform="rotate(-35 94 26)" />
        <path d="M86 32L70 60" />
        <path d="M48 106H72" />
    </Art>
);

const DumplingArt = () => (
    <Art>
        <path d="M44 22q4-5 0-10t0-10M62 20q4-5 0-10t0-10" />
        <path d="M18 78C18 46 42 32 60 32C78 32 102 46 102 78C102 84 98 88 92 88H28C22 88 18 84 18 78Z" />
        <path d="M34 88Q32 72 38 58M48 88Q46 70 52 52M62 88Q62 68 66 50M76 88Q78 70 76 54M90 88Q94 76 88 64" />
        <path d="M14 98H106" />
    </Art>
);

const DrumstickArt = () => (
    <Art>
        <path d="M70 20C94 20 102 46 88 62C76 76 54 72 44 62C34 52 40 28 70 20Z" />
        <path d="M60 38Q72 34 82 42M56 52Q70 48 80 58" />
        <path d="M46 62L28 80" />
        <circle cx="22" cy="78" r="5" />
        <circle cx="30" cy="87" r="5" />
    </Art>
);

const NoodleBoxArt = () => (
    <Art>
        <path d="M30 56H90L82 106H38Z" />
        <path d="M26 56H94" />
        <path d="M34 76H86" />
        <path d="M42 56C42 44 50 44 50 50S58 56 60 48S70 42 72 52S78 56 80 50" />
        <path d="M38 56C40 34 80 34 82 56" />
        <path d="M72 46L98 10M82 48L108 14" />
    </Art>
);

const NoodleBowlArt = () => (
    <Art>
        <path d="M46 66C46 46 60 42 60 28M54 66C54 50 68 46 68 32M62 66C62 52 76 48 76 36" />
        <path d="M54 24L88 6M66 28L100 10" />
        <path d="M20 68C20 92 38 106 60 106C82 106 100 92 100 68" />
        <ellipse cx="60" cy="68" rx="40" ry="8" />
    </Art>
);

const RiceBowlArt = () => (
    <Art>
        <path d="M26 66C30 40 90 40 94 66" />
        <path d="M48 52l4 2M62 46l4 2M74 54l4 2M56 58l4 2M40 60l4 2" />
        <path d="M22 66C22 90 38 104 60 104C82 104 98 90 98 66" />
        <ellipse cx="60" cy="66" rx="38" ry="8" />
        <path d="M46 106H74" />
    </Art>
);

const RiceEggArt = () => (
    <Art>
        <path d="M70 68L108 28M80 70L114 36" />
        <path d="M26 66C30 44 90 44 94 66" />
        <circle cx="52" cy="50" r="11" />
        <circle cx="52" cy="50" r="4" />
        <path d="M22 66C22 90 38 104 60 104C82 104 98 90 98 66" />
        <ellipse cx="60" cy="66" rx="38" ry="8" />
        <path d="M46 106H74" />
    </Art>
);

/* ─────────────────────────── SECTIONS & IMAGES ─────────────────────────── */

const SECTIONS = [
    {
        id: "soups-veg",
        category: "soups",
        title: "Soups",
        veg: true,
        Art: SoupBowlArt,
        items: chineseMenuData.soupsVeg,
    },
    {
        id: "soups-nonveg",
        category: "soups",
        title: "Soups",
        veg: false,
        Art: SoupSpoonArt,
        items: chineseMenuData.soupsNonVeg,
    },
    {
        id: "starters-veg",
        category: "starters",
        title: "Starters",
        veg: true,
        Art: DumplingArt,
        items: chineseMenuData.startersVeg,
    },
    {
        id: "starters-nonveg",
        category: "starters",
        title: "Starters",
        veg: false,
        Art: DrumstickArt,
        items: chineseMenuData.startersNonVeg,
    },
    {
        id: "noodles-veg",
        category: "noodles",
        title: "Noodles",
        veg: true,
        Art: NoodleBoxArt,
        items: chineseMenuData.noodlesVeg,
    },
    {
        id: "noodles-nonveg",
        category: "noodles",
        title: "Noodles",
        veg: false,
        Art: NoodleBowlArt,
        items: chineseMenuData.noodlesNonVeg,
    },
    {
        id: "rice-veg",
        category: "rice",
        title: "Rice Bowls",
        veg: true,
        Art: RiceBowlArt,
        items: chineseMenuData.riceBowlsVeg,
    },
    {
        id: "rice-nonveg",
        category: "rice",
        title: "Rice Bowls",
        veg: false,
        Art: RiceEggArt,
        items: chineseMenuData.riceBowlsNonVeg,
    },
];

const TABS = [
    { id: "soups", label: "Soups", target: "soups-veg" },
    { id: "starters", label: "Starters", target: "starters-veg" },
    { id: "noodles", label: "Noodles", target: "noodles-veg" },
    { id: "rice", label: "Rice Bowls", target: "rice-veg" },
];

const BANDS = {
    "soups-nonveg": [
        { alt: "Noir Bistro soup", shape: "circle", className: "w-[min(72vw,24rem)]" },
        { alt: "Noir Bistro dim sum", shape: "arch", className: "w-[min(56vw,17rem)] md:-ml-12" },
    ],
    "starters-nonveg": [
        { alt: "Noir Bistro manchurian", shape: "arch", className: "w-[min(56vw,16rem)]" },
        { alt: "Noir Bistro chilli chicken", shape: "circle", className: "w-[min(72vw,26rem)] md:-ml-12" },
        { alt: "Noir Bistro wings", shape: "arch", className: "w-[min(56vw,16rem)] md:-ml-12" },
    ],
    "noodles-nonveg": [
        { alt: "Noir Bistro noodles", shape: "circle", className: "w-[min(72vw,22rem)]" },
        { alt: "Noir Bistro hakka noodles", shape: "circle", className: "w-[min(46vw,13rem)] md:-ml-8 md:mb-4" },
    ],
    "rice-nonveg": [
        { alt: "Noir Bistro rice bowl", shape: "arch", className: "w-[min(56vw,16rem)]" },
        { alt: "Noir Bistro fried rice", shape: "circle", className: "w-[min(72vw,24rem)] md:-ml-12" },
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

const RING_TEXT = "NOIR BISTRO • CHINESE MENU • ".repeat(3);

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

const CategoryBadge = ({ section }) => {
    const { id, title, veg, Art: Illustration } = section;
    const longTitle = title.length > 8;

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

                <div className="h-[40%] w-[40%]">
                    <Illustration />
                </div>

                <h2
                    id={`chinese-${id}-title`}
                    className={`mt-1 text-center font-anton uppercase leading-[0.9] ${longTitle
                            ? "text-[clamp(2.5rem,6vw,4.25rem)]"
                            : "text-[clamp(2.75rem,7vw,5rem)]"
                        }`}
                >
                    <span className="block overflow-hidden pb-[0.05em]">
                        <span data-line className="block">
                            {title}
                        </span>
                    </span>
                    <span className="sr-only">{veg ? " Veg" : " Non-veg"}</span>
                </h2>

                <p
                    data-fade
                    aria-hidden="true"
                    className="flex items-center gap-2 font-anton text-xl font-semibold uppercase tracking-wider"
                >
                    <Dot veg={veg} />
                    {veg ? "Veg" : "Non-veg"}
                </p>
            </div>
        </div>
    );
};

/* ───────────────────────────── COMPONENT ───────────────────────────── */

export default function ChineseMenu({ topOffset = 0 }) {
    const rootRef = useRef(null);
    const navRef = useRef(null);
    const tabsRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabRefs = useRef({});
    const lockRef = useRef(false);
    const indicatorReadyRef = useRef(false);

    const [active, setActive] = useState(TABS[0].id);
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
                            setActive(el.dataset.category);
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

    const goToSection = contextSafe((tab) => {
        const el = document.getElementById(`chinese-${tab.target}`);
        if (!el) return;

        const offset = (navRef.current?.offsetHeight || 0) + topOffset;

        lockRef.current = true;
        setActive(tab.id);

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
                <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <h1 className="font-anton text-[clamp(4.5rem,15vw,12rem)] uppercase leading-[0.82]">
                            <span className="block overflow-hidden pb-[0.04em]">
                                <span data-hero-line className="block">
                                    Chinese
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

                    <div className="lg:col-span-5">
                        <div
                            data-hero-ring
                            className="relative mx-auto w-[min(72vw,26rem)]"
                        >
                            <Ring
                                id="ring-hero"
                                text={RING_TEXT}
                                className="-inset-[9%] h-[118%] w-[118%]"
                            />
                            <FramedImage
                                alt="Noir Bistro signature Chinese dish"
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
                aria-label="Chinese menu categories"
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

                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            ref={(el) => {
                                tabRefs.current[tab.id] = el;
                            }}
                            type="button"
                            onClick={() => goToSection(tab)}
                            aria-current={active === tab.id ? "true" : undefined}
                            className={`relative z-10 shrink-0 rounded-full px-5 py-2 font-anton text-lg uppercase tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-noir-black sm:text-xl ${active === tab.id
                                    ? "text-noir-red"
                                    : "text-noir-black hover:bg-noir-black/10"
                                }`}
                        >
                            {tab.label}
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
                                id={`chinese-${s.id}`}
                                data-section={s.id}
                                data-category={s.category}
                                aria-labelledby={`chinese-${s.id}-title`}
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
                                        data-group
                                        className={`lg:col-span-7 ${flip ? "lg:order-1" : ""
                                            }`}
                                    >
                                        <div data-rule>
                                            <DoubleRule />
                                        </div>
                                        <ItemList items={s.items} />
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