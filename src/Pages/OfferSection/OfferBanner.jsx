import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./offers.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pad = (n) => String(n).padStart(2, "0");

/* "BUY 1 + GET 1 FREE" -> ["BUY 1 +", "GET 1 FREE"] so it breaks cleanly */
const splitHighlight = (text) =>
    text.includes("+")
        ? text
            .split(/\s*\+\s*/)
            .map((part, i, all) => (i < all.length - 1 ? `${part} +` : part))
        : [text];

/* File names with spaces / brackets are safe to pass straight in */
const safeSrc = (src) => (src.includes("%") ? src : encodeURI(src));

/**
 * Reusable promo card.
 *
 * title        "TUESDAY OFFER!"
 * subtitle     "12AM TO 6PM"
 * highlight    "20% OFF" | "BUY 1 + GET 1 FREE"
 * description  "ANY CHINESE FOOD" | "ANY PIZZA"
 * imageSrc     photo path
 * badgeText    text inside the round stamp
 * index/total  optional counter ("01 / 02")
 * reverse      mirror the layout (photo on the left)
 * ctaHref / ctaLabel  optional button
 */
export default function OfferBanner({
    title,
    subtitle,
    highlight,
    description,
    imageSrc,
    badgeText,
    index,
    total,
    reverse = false,
    ctaHref = "#full-menu",
    ctaLabel = "View menu",
}) {
    const cardRef = useRef(null);
    const headingId = useId();
    const [imgFailed, setImgFailed] = useState(false);

    const lines = splitHighlight(highlight);

    useGSAP(
        () => {
            const card = cardRef.current;
            if (!card) return;

            const mm = gsap.matchMedia();

            mm.add(
                {
                    motion: "(prefers-reduced-motion: no-preference)",
                    desktop: "(min-width: 1024px)",
                },
                (context) => {
                    const { motion, desktop } = context.conditions;
                    if (!motion) return; // reduced motion: content simply shows

                    const reveal = card.querySelector("[data-offer-reveal]");
                    const parallax = card.querySelector("[data-offer-parallax]");

                    /* Entrance: card lifts in, lines slide up out of their masks,
                       the photo rolls open top to bottom */
                    gsap
                        .timeline({
                            defaults: { ease: "power4.out" },
                            scrollTrigger: {
                                trigger: card,
                                start: "top 75%",
                                once: true,
                            },
                            onComplete: () =>
                                gsap.set(reveal, { clearProps: "clipPath" }),
                        })
                        .from(card, { opacity: 0, y: 60, duration: 1 })
                        .from(
                            card.querySelectorAll("[data-offer-line]"),
                            { yPercent: 110, duration: 1.1, stagger: 0.12 },
                            0.15
                        )
                        .fromTo(
                            reveal,
                            { clipPath: "inset(0% 0% 100% 0%)" },
                            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 },
                            0.2
                        )
                        .from(parallax, { scale: 1.3, duration: 1.8 }, "<")
                        .from(
                            card.querySelectorAll("[data-offer-badge]"),
                            {
                                scale: 0,
                                rotation: -120,
                                duration: 1,
                                ease: "back.out(1.6)",
                            },
                            "-=0.9"
                        )
                        .from(
                            card.querySelectorAll("[data-offer-fade]"),
                            { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 },
                            0.5
                        );

                    /* Parallax: the dish drifts inside its frame while scrolling */
                    if (parallax) {
                        gsap.fromTo(
                            parallax,
                            { yPercent: desktop ? -9 : -6 },
                            {
                                yPercent: desktop ? 9 : 6,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: card.querySelector("[data-offer-media]"),
                                    start: "top bottom",
                                    end: "bottom top",
                                    scrub: true,
                                },
                            }
                        );
                    }
                }
            );

            // Reverts every tween and ScrollTrigger made above on unmount
            return () => mm.revert();
        },
        { scope: cardRef }
    );

    return (
        <article
            ref={cardRef}
            aria-labelledby={headingId}
            className={`offer-card ${reverse ? "offer-card--reverse" : ""}`}
        >
            {/* Typography side */}
            <div className="offer-card__copy">
                <div>
                    {index !== undefined && (
                        <p
                            data-offer-fade
                            className="mb-6 flex items-center gap-4 font-anton text-lg tracking-widest"
                        >
                            {pad(index)}
                            {total !== undefined && ` / ${pad(total)}`}
                            <span
                                aria-hidden="true"
                                className="h-px flex-1 bg-noir-red/60"
                            />
                        </p>
                    )}

                    <p className="offer-title font-anton uppercase text-white/90">
                        <span className="block overflow-hidden pb-1">
                            <span data-offer-line className="block">
                                {title}
                            </span>
                        </span>
                    </p>

                    <h3
                        id={headingId}
                        className="offer-highlight mt-3 font-anton text-noir-red"
                    >
                        {lines.map((line) => (
                            <span
                                key={line}
                                className="block overflow-hidden pb-[0.04em]"
                            >
                                <span data-offer-line className="block">
                                    {line}
                                </span>
                            </span>
                        ))}
                    </h3>

                    <p className="offer-desc mt-4 font-anton uppercase text-white/90">
                        <span className="block overflow-hidden pb-1">
                            <span data-offer-line className="block">
                                {description}
                            </span>
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                    <p data-offer-fade className="offer-detail offer-time text-noir-red">
                        {subtitle}
                    </p>

                    <a data-offer-fade href={ctaHref} className="offer-cta offer-detail">
                        {ctaLabel}
                        <span aria-hidden="true" className="offer-cta__arrow">
                            &#8599;
                        </span>
                    </a>
                </div>

                {index !== undefined && (
                    <span
                        aria-hidden="true"
                        className="offer-card__num offer-outline font-anton"
                    >
                        {pad(index)}
                    </span>
                )}
            </div>

            {/* Photography side */}
            <div className="offer-card__media" data-offer-media>
                <div className="offer-frame">
                    <span aria-hidden="true" className="offer-frame__line" />

                    <div data-offer-reveal className="offer-frame__clip">
                        <div data-offer-parallax className="offer-frame__parallax">
                            {imgFailed ? (
                                <div className="offer-frame__fallback font-anton text-3xl uppercase">
                                    {description}
                                </div>
                            ) : (
                                <img
                                    src={safeSrc(imageSrc)}
                                    alt={`${description} at Noir Bistro`}
                                    loading="lazy"
                                    draggable="false"
                                    onError={() => setImgFailed(true)}
                                    className="offer-frame__img"
                                />
                            )}
                        </div>
                    </div>

                    {badgeText && (
                        <div
                            data-offer-badge
                            aria-hidden="true"
                            className="offer-badge font-anton text-xl sm:text-2xl"
                        >
                            {badgeText}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}