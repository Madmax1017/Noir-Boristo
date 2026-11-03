import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import OfferBanner from "./OfferBanner";
import "./offers.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const OFFERS = [
    {
        id: "chinese",
        title: "TUESDAY OFFER!",
        subtitle: "12AM TO 6PM",
        highlight: "20% OFF",
        description: "ANY CHINESE FOOD",
        imageSrc: "/images/1.jpg",
        badgeText: "Tuesday",
    },
    {
        id: "pizza",
        title: "TUESDAY OFFER!",
        subtitle: "12AM TO 6PM",
        highlight: "BUY 1 + GET 1 FREE",
        description: "ANY PIZZA",
        imageSrc: "/images/CALIFORNIA CHICKEN PIZZA ( NON-VEG ).jpg",
        badgeText: "Tuesday",
    },
];

export default function OfferSection() {
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            if (!section) return;

            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                /* Header: rule draws, eyebrow wipes open, headline slides up */
                gsap
                    .timeline({
                        defaults: { ease: "power4.out" },
                        scrollTrigger: {
                            trigger: "[data-head]",
                            start: "top 80%",
                            once: true,
                        },
                    })
                    .from("[data-head-rule]", {
                        scaleX: 0,
                        transformOrigin: "left center",
                        duration: 1.4,
                        ease: "power4.inOut",
                    })
                    .from(
                        "[data-head-clip]",
                        { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2 },
                        0.15
                    )
                    .from(
                        "[data-head-line]",
                        { yPercent: 110, duration: 1.2, stagger: 0.12 },
                        0.25
                    )
                    .from(
                        "[data-head-fade]",
                        { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 },
                        0.7
                    );

                /* The giant outlined word drifts slower than the page */
                gsap.fromTo(
                    "[data-bg-word]",
                    { yPercent: -12 },
                    {
                        yPercent: 12,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section
            id="offers"
            ref={sectionRef}
            aria-labelledby="offers-title"
            className="offer-section overflow-x-clip bg-noir-red text-noir-black"
        >
            <div className="offer-section__grain" aria-hidden="true" />

            <span
                data-bg-word
                aria-hidden="true"
                className="offer-bg-word offer-outline font-anton uppercase"
            >
                Offers
            </span>

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-32">
                {/* Cinematic intro header */}
                <header data-head>
                    <div
                        data-head-rule
                        aria-hidden="true"
                        className="h-[3px] w-full bg-noir-black"
                    />

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                        <div>
                            <p
                                data-head-clip
                                className="offer-detail text-noir-black"
                            >
                                Exclusive Promos /
                            </p>

                            <h2
                                id="offers-title"
                                className="mt-3 font-anton text-[clamp(3.75rem,13vw,11rem)] uppercase leading-[0.85]"
                            >
                                <span className="block overflow-hidden pb-[0.05em]">
                                    <span data-head-line className="block">
                                        Special
                                    </span>
                                </span>
                                <span className="block overflow-hidden pb-[0.05em]">
                                    <span data-head-line className="block">
                                        Deals
                                    </span>
                                </span>
                            </h2>
                        </div>

                        <p
                            data-head-fade
                            className="offer-detail flex items-center gap-3 pb-2 text-noir-black"
                        >
                            Tuesday / 12AM to 6PM
                            <span aria-hidden="true" className="text-2xl leading-none">
                                &#8599;
                            </span>
                        </p>
                    </div>
                </header>

                {/* Promo cards */}
                <div className="mt-14 flex flex-col gap-12 sm:mt-20 sm:gap-20">
                    {OFFERS.map((offer, i) => (
                        <OfferBanner
                            key={offer.id}
                            {...offer}
                            index={i + 1}
                            total={OFFERS.length}
                            reverse={i % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}