import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Single source of truth for the Tuesday offers.
 * OfferSection imports this so both components always show the same content.
 */
export const TUESDAY_OFFERS = [
    {
        id: "chinese",
        headline: "20% OFF",
        detail: "on any Chinese food",
        time: "12 AM to 6 PM",
    },
    {
        id: "pizza",
        headline: "Buy 1 Get 1 Free",
        detail: "on any pizza",
        time: "12 AM to 6 PM",
    },
];

const FOCUSABLE =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-screen Tuesday offers modal.
 * Mount it only while open: {isOpen && <OfferBanner onClose={...} />}
 * It plays its own exit animation, then calls onClose to unmount.
 */
const OfferBanner = ({ onClose }) => {
    const panelRef = useRef(null);
    const closeBtnRef = useRef(null);
    const tlRef = useRef(null);
    const closingRef = useRef(false);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    /* Entrance timeline. Reversing it is the exit. */
    useGSAP(
        () => {
            const tl = gsap.timeline({
                defaults: { ease: "power4.out" },
                onReverseComplete: () => onCloseRef.current?.(),
            });

            tl.fromTo(
                panelRef.current,
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" }
            )
                .from(
                    "[data-wm]",
                    { opacity: 0, yPercent: 14, duration: 1.1, stagger: 0.12 },
                    "-=0.4"
                )
                .from(
                    "[data-line]",
                    { yPercent: 110, duration: 0.8, stagger: 0.09 },
                    "-=0.95"
                )
                .from(
                    "[data-card]",
                    { y: 70, opacity: 0, duration: 0.8, stagger: 0.14 },
                    "-=0.55"
                )
                .from("[data-chrome]", { opacity: 0, duration: 0.4 }, "-=0.5");

            // Near-instant for people who prefer reduced motion.
            if (prefersReducedMotion()) tl.timeScale(50);

            tlRef.current = tl;
        },
        { scope: panelRef }
    );

    const requestClose = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;

        if (tlRef.current) {
            tlRef.current.timeScale(prefersReducedMotion() ? 50 : 1.4).reverse();
        } else {
            onCloseRef.current?.();
        }
    }, []);

    /* ESC to close, Tab focus trap, scroll lock, focus return. */
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                requestClose();
                return;
            }

            if (e.key === "Tab" && panelRef.current) {
                const items = panelRef.current.querySelectorAll(FOCUSABLE);
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [requestClose]);

    return createPortal(
        <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-banner-title"
            aria-describedby="offer-banner-desc"
            className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-noir-red text-noir-black"
        >
            {/* Background watermark poster details (decorative) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none overflow-hidden font-anton uppercase leading-none text-noir-black/10"
            >
                <span
                    data-wm
                    className="absolute -right-[4vw] -top-[3vw] block rotate-6 text-[34vw]"
                >
                    20%
                </span>
                <span
                    data-wm
                    className="absolute -left-[3vw] top-[38%] block -rotate-6 text-[26vw]"
                >
                    B1G1
                </span>
                <span
                    data-wm
                    className="absolute -bottom-[4vw] right-[2vw] block text-[20vw]"
                >
                    Tuesday
                </span>
            </div>

            <div className="relative mx-auto flex min-h-full w-full max-w-7xl flex-col px-5 py-5 sm:px-10 sm:py-8">
                {/* Top bar */}
                <div data-chrome className="flex items-center justify-between">
                    <span className="font-anton text-2xl uppercase tracking-wide sm:text-3xl">
                        Noir Bistro
                    </span>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={requestClose}
                        aria-label="Close Tuesday offers"
                        className="grid h-12 w-12 place-items-center bg-noir-black text-noir-red transition-transform duration-200 hover:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-noir-black"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="square"
                            aria-hidden="true"
                        >
                            <path d="M4 4l16 16M20 4L4 20" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-center gap-8 py-8 sm:gap-12 sm:py-12">
                    <h2
                        id="offer-banner-title"
                        className="font-anton text-[clamp(4rem,16vw,13rem)] uppercase leading-[0.85]"
                    >
                        <span className="block overflow-hidden">
                            <span data-line className="block">
                                Tuesday
                            </span>
                        </span>
                        <span className="block overflow-hidden">
                            <span data-line className="block">
                                Offers
                            </span>
                        </span>
                    </h2>

                    <p id="offer-banner-desc" className="sr-only">
                        Two offers available on Tuesdays from 12 AM to 6 PM: 20% off any
                        Chinese food, and buy 1 get 1 free on any pizza.
                    </p>

                    <ul className="grid gap-5 md:grid-cols-2 md:gap-8">
                        {TUESDAY_OFFERS.map((offer) => (
                            <li
                                key={offer.id}
                                data-card
                                className="flex flex-col justify-between gap-8 border-4 border-noir-black p-6 sm:p-8"
                            >
                                <h3 className="font-anton text-[clamp(3.25rem,8vw,7rem)] uppercase leading-[0.9]">
                                    {offer.headline}
                                </h3>
                                <div>
                                    <p className="font-anton text-2xl uppercase tracking-wide sm:text-4xl">
                                        {offer.detail}
                                    </p>
                                    <p className="mt-4 inline-block bg-noir-black px-4 py-2 font-anton text-xl uppercase tracking-wide text-noir-red sm:text-2xl">
                                        {offer.time}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OfferBanner;