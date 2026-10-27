import { useEffect, useState } from "react";

const HERO_IMAGE = "/images/noir-hero.jpg";

export default function HeroSection() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setLoaded(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <section
            id="home"
            className="relative flex min-h-[100svh] items-center overflow-hidden bg-noir-red px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-[6vw] lg:pt-36"
        >
            {/* Subtle editorial background numbering */}
            <div className="pointer-events-none absolute left-6 top-32 select-none font-anton text-[10rem] leading-none text-noir-black/[0.035] sm:left-10 sm:text-[16rem] lg:left-[5vw] lg:top-24 lg:text-[22rem]">
                N.
            </div>

            <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[7vw]">

                {/* LEFT COLUMN */}
                <div
                    className={`relative flex flex-col items-start transition-all duration-1000 ease-out ${
                        loaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                    }`}
                >
                    {/* Eyebrow */}
                    <div className="order-1 mb-6 flex items-center gap-3 sm:mb-8">
                        <span className="h-[2px] w-8 bg-noir-black" />
                        <span className="text-[10px] font-bold tracking-[0.28em] sm:text-xs">
                            WELCOME TO NOIR
                        </span>
                    </div>

                    {/* Main heading */}
                    <h1 className="order-2 font-anton text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.82] tracking-[-0.035em]">
                        NOIR
                        <span className="mt-3 block text-[0.43em] leading-none tracking-[0.16em] sm:mt-4">
                            BISTRO<span className="text-noir-black/40">.</span>
                        </span>
                    </h1>

                    {/* Tagline & Paragraph */}
                    <div className="order-3 mt-6 max-w-md sm:mt-8">
                        <p className="text-xs font-bold uppercase leading-[1.8] tracking-[0.19em] sm:text-sm">
                            Flavours beyond borders.
                        </p>

                        <p className="mt-4 text-sm leading-7 text-noir-black/85 sm:text-base sm:leading-8">
                            Step into an immersive world where exceptional culinary craft meets sophisticated atmosphere. At Noir Bistro, we curate distinct dining narratives fusing rich continental traditions, bold oriental flavours, and artisanal café culture into unforgettable moments.
                        </p>
                    </div>

                    {/* MOBILE-ONLY IMAGE — Placed after paragraph & before buttons on mobile */}
                    <div className="order-4 mt-8 w-full lg:hidden">
                        <div className="relative mx-auto w-full max-w-[620px]">
                            <div className="group relative aspect-[4/4.5] overflow-hidden bg-noir-black sm:aspect-[4/4.2]">
                                <img
                                    src={HERO_IMAGE}
                                    alt="The dining experience at Noir Bistro"
                                    fetchPriority="high"
                                    onError={(event) => {
                                        event.currentTarget.style.visibility = "hidden";
                                    }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-noir-black/10" />
                                <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-noir-black px-4 py-3 text-noir-red sm:px-5 sm:py-4">
                                    <span className="h-2 w-2 rounded-full bg-noir-red" />
                                    <span className="text-[9px] font-bold tracking-[0.24em] sm:text-[10px]">
                                        THE NOIR EXPERIENCE
                                    </span>
                                </div>
                                <span className="absolute right-4 top-4 font-anton text-sm text-white sm:right-5 sm:top-5">
                                    01 / 04
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="order-5 mt-8 flex w-full flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                        <a
                            href="#menu"
                            className="group inline-flex min-h-12 items-center justify-center gap-5 bg-noir-black px-5 py-3 text-noir-red transition-colors duration-300 hover:bg-white hover:text-noir-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-black sm:px-6"
                        >
                            <span className="text-[10px] font-bold tracking-[0.17em] sm:text-xs">
                                EXPLORE MENU
                            </span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                ↗
                            </span>
                        </a>

                        <a
                            href="#location"
                            className="group inline-flex min-h-12 items-center gap-3 border border-noir-black/50 px-5 py-3 text-noir-black transition-colors duration-300 hover:border-noir-black hover:bg-noir-black hover:text-noir-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-black sm:px-6"
                        >
                            <span className="text-[10px] font-bold tracking-[0.17em] sm:text-xs">
                                FIND US
                            </span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                ↗
                            </span>
                        </a>
                    </div>

                    {/* Bottom editorial detail */}
                    <div className="order-6 mt-10 flex w-full items-center gap-4 border-t border-noir-black/30 pt-5 sm:mt-14">
                        <span className="font-anton text-sm">01</span>
                        <div className="h-px flex-1 bg-noir-black/25" />
                        <span className="text-[9px] font-bold tracking-[0.2em] sm:text-[10px]">
                            GOOD FOOD. DISTINCTIVE EXPERIENCES.
                        </span>
                    </div>
                </div>

                {/* RIGHT COLUMN — DESKTOP ONLY PHOTO */}
                <div
                    className={`hidden lg:block relative transition-all delay-150 duration-1000 ease-out ${
                        loaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                    }`}
                >
                    <div className="relative mx-auto w-full max-w-[620px] lg:mx-0">
                        {/* Image frame */}
                        <div className="group relative aspect-[0.88/1] overflow-hidden bg-noir-black">
                            <img
                                src={HERO_IMAGE}
                                alt="The dining experience at Noir Bistro"
                                fetchPriority="high"
                                onError={(event) => {
                                    event.currentTarget.style.visibility = "hidden";
                                }}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                            />

                            {/* Subtle black image treatment */}
                            <div className="pointer-events-none absolute inset-0 bg-noir-black/10 transition-colors duration-500 group-hover:bg-noir-black/0" />

                            {/* Image corner label */}
                            <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-noir-black px-4 py-3 text-noir-red sm:px-5 sm:py-4">
                                <span className="h-2 w-2 rounded-full bg-noir-red" />
                                <span className="text-[9px] font-bold tracking-[0.24em] sm:text-[10px]">
                                    THE NOIR EXPERIENCE
                                </span>
                            </div>

                            {/* Image index */}
                            <span className="absolute right-4 top-4 font-anton text-sm text-white sm:right-5 sm:top-5">
                                01 / 04
                            </span>
                        </div>

                        {/* Editorial side label */}
                        <div className="absolute -right-3 top-0 flex flex-col gap-3">
                            <span className="text-[9px] font-bold tracking-[0.3em] text-noir-black [writing-mode:vertical-rl]">
                                CHINESE · CONTINENTAL · CAFE
                            </span>
                        </div>

                        {/* Decorative frame detail */}
                        <div className="pointer-events-none absolute -bottom-3 -left-3 -z-0 h-20 w-20 border-b border-l border-noir-black/50 sm:-bottom-4 sm:-left-4 sm:h-28 sm:w-28" />
                    </div>
                </div>

            </div>

            {/* Scroll indicator */}
            <a
                href="#menu"
                aria-label="Scroll to menu"
                className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-noir-black/70 transition-opacity hover:opacity-50 lg:flex"
            >
                <span className="text-[9px] font-bold tracking-[0.25em]">
                    SCROLL TO EXPLORE
                </span>
                <span className="animate-bounce text-lg">↓</span>
            </a>
        </section>
    );
}