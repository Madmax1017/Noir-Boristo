import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import CafeMenu from "./CafeMenu"; // or "./menu/CafeMenu"
import ChineseMenu from "./ChineseMenu";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TABS = [
    { id: "cafe",  label: "Continental Menu" },
    { id: "chinese",  label: "Chinese Menu" },
];

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * topOffset: height (px) of your site's fixed navbar, if any.
 * The toggle bar sticks just below it, and the menus' own sticky
 * category tabs stick just below the toggle bar.
 */
export default function MenuSection({ topOffset = 0 }) {
    const sectionRef = useRef(null);
    const barRef = useRef(null);
    const indicatorRef = useRef(null);
    const panelRef = useRef(null);
    const tabRefs = useRef({});

    const [activeTab, setActiveTab] = useState("cafe");
    const [barHeight, setBarHeight] = useState(0);

    const activeTabRef = useRef("cafe");
    const dirRef = useRef(1); // 1 = moving to the right tab, -1 = to the left
    const busyRef = useRef(false);
    const firstRunRef = useRef(true);

    activeTabRef.current = activeTab;

    /* Measure the toggle bar so the menus' sticky tabs sit right under it */
    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        const update = () => setBarHeight(bar.offsetHeight);
        update();

        const ro = new ResizeObserver(update);
        ro.observe(bar);
        return () => ro.disconnect();
    }, []);

    /* ── Entrance of the newly selected menu ── */
    const { contextSafe } = useGSAP(
        () => {
            if (firstRunRef.current) {
                firstRunRef.current = false;
                gsap.set(panelRef.current, { opacity: 1, x: 0 });
                return;
            }

            // The new menu changes the page height, so re-measure triggers
            ScrollTrigger.refresh();

            if (prefersReducedMotion()) {
                busyRef.current = false;
                gsap.set(panelRef.current, { opacity: 1, x: 0 });
                return;
            }

            gsap.fromTo(
                panelRef.current,
                { opacity: 0, x: dirRef.current * 40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    clearProps: "all",
                    onComplete: () => {
                        busyRef.current = false;
                    },
                }
            );
        },
        { scope: sectionRef, dependencies: [activeTab] }
    );

    /* ── Exit animation, then swap the menu ── */
    const switchTo = contextSafe((id) => {
        if (id === activeTabRef.current) return;

        const ids = TABS.map((t) => t.id);
        const dir = ids.indexOf(id) > ids.indexOf(activeTabRef.current) ? 1 : -1;
        dirRef.current = dir;
        busyRef.current = true;

        const swap = () => {
            // If the reader is deep in the old menu, start the new one at its top
            const sectionTop =
                sectionRef.current?.getBoundingClientRect().top +
                window.scrollY -
                topOffset;
            if (window.scrollY > (sectionTop || 0)) {
                window.scrollTo({ top: sectionTop || 0, behavior: "instant" });
            }
            setActiveTab(id);
        };

        const reduce = prefersReducedMotion();

        // Slide the red block to the chosen tab
        gsap.to(indicatorRef.current, {
            xPercent: ids.indexOf(id) * 100,
            duration: reduce ? 0 : 0.4,
            ease: "power3.out",
        });

        // Safety fallback so panel is never left blank
        setTimeout(() => {
            busyRef.current = false;
            if (panelRef.current) {
                gsap.set(panelRef.current, { opacity: 1, x: 0 });
            }
        }, 500);

        if (reduce) {
            swap();
            return;
        }

        gsap.to(panelRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: swap,
        });
    });

    /* Arrow keys / Home / End move between tabs (ARIA tabs pattern) */
    const onTabKeyDown = (e) => {
        const ids = TABS.map((t) => t.id);
        const current = ids.indexOf(activeTabRef.current);
        let next = null;

        if (e.key === "ArrowRight") next = (current + 1) % ids.length;
        else if (e.key === "ArrowLeft")
            next = (current - 1 + ids.length) % ids.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = ids.length - 1;

        if (next === null) return;
        e.preventDefault();
        switchTo(ids[next]);
        tabRefs.current[ids[next]]?.focus();
    };

    const stickyTop = topOffset + barHeight;

    return (
        <section
            id="full-menu"
            ref={sectionRef}
            aria-label="Noir Bistro menus"
            className="min-h-screen bg-noir-black text-noir-red pt-24 sm:pt-28 lg:pt-32"
        >
            {/* Sticky toggle bar */}
            <div
                ref={barRef}
                style={{ top: topOffset }}
                className="sticky z-40 border-b border-noir-red/30 bg-noir-black/95 backdrop-blur"
            >
                <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 sm:py-4">
                    <div
                        role="tablist"
                        aria-label="Choose a menu"
                        onKeyDown={onTabKeyDown}
                        className="relative grid grid-cols-2 border-4 border-noir-red"
                    >
                        {/* Sliding red block behind the active tab */}
                        <span
                            ref={indicatorRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-noir-red"
                        />

                        {TABS.map((tab) => {
                            const selected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    ref={(el) => {
                                        tabRefs.current[tab.id] = el;
                                    }}
                                    id={`menu-tab-${tab.id}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls="menu-panel"
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => switchTo(tab.id)}
                                    className={`relative z-10 flex items-center justify-center gap-2 px-2 py-3 font-anton text-lg uppercase tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-noir-black sm:gap-3 sm:py-4 sm:text-3xl ${selected
                                        ? "text-noir-black"
                                        : "text-noir-red hover:bg-noir-red/10"
                                        }`}
                                >
                                    <span aria-hidden="true">{tab.emoji}</span>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Active menu */}
            <div
                ref={panelRef}
                id="menu-panel"
                role="tabpanel"
                aria-labelledby={`menu-tab-${activeTab}`}
            >
                {activeTab === "cafe" ? (
                    <CafeMenu topOffset={stickyTop} />
                ) : (
                    <ChineseMenu topOffset={stickyTop} />
                )}
            </div>
        </section>
    );
}