import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

/**
 * Section title for Signature Dishes.
 * `count` is passed from the dishes array so the headline never goes stale.
 */
export default function DishTitle({ count = 8 }) {
    const container = useRef(null);

    useGSAP(
        () => {
            const q = gsap.utils.selector(container);
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const firstSplit = new SplitText(q(".first-text-split h1")[0], { type: "chars" });
                const secondSplit = new SplitText(q(".second-text-split h1")[0], { type: "chars" });

                gsap.set([firstSplit.chars, secondSplit.chars], { yPercent: 120, rotate: 4 });
                gsap.set(q(".flavor-text-scroll"), { clipPath: "inset(0% 100% 0% 0%)" });
                gsap.set(q(".title-scribble path"), { strokeDashoffset: 1 });
                gsap.set(q(".title-star"), { scale: 0, rotate: -90 });
                gsap.set(q(".title-meta > *"), { yPercent: 110 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container.current,
                        start: "top 70%",
                        once: true,
                    },
                });

                tl.to(firstSplit.chars, {
                    yPercent: 0,
                    rotate: 0,
                    stagger: 0.045,
                    duration: 0.8,
                    ease: "power4.out",
                })
                    .to(q(".title-star"), { scale: 1, rotate: 0, duration: 0.8, ease: "power3.out" }, "<0.2")
                    .to(
                        q(".flavor-text-scroll"),
                        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" },
                        "-=0.45"
                    )
                    .to(
                        secondSplit.chars,
                        { yPercent: 0, rotate: 0, stagger: 0.025, duration: 0.75, ease: "power4.out" },
                        "-=0.35"
                    )
                    .to(
                        q(".title-scribble path"),
                        { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
                        "-=0.3"
                    )
                    .to(
                        q(".title-meta > *"),
                        { yPercent: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" },
                        "-=0.6"
                    );

                return () => {
                    firstSplit.revert();
                    secondSplit.revert();
                };
            });

            return () => mm.revert();
        },
        { scope: container }
    );

    return (
        <div
            ref={container}
            className="flavor-section relative flex min-h-[60vh] w-full items-center overflow-hidden bg-noir-red px-4 pb-10 pt-16 text-noir-black sm:px-8 md:px-12 lg:px-16"
        >
            <div className="general-title flex w-full flex-col items-start justify-center gap-3 sm:gap-5 lg:gap-6">
                {/* Line 1 + spinning vector mark */}
                <div className="flex items-center gap-4 sm:gap-8">
                    <div className="first-text-split overflow-hidden py-1">
                        <h2 className="font-anton text-[clamp(3.5rem,10vw,9rem)] uppercase leading-[0.9] tracking-[-0.045em]">
                            We have {count}
                        </h2>
                    </div>
                    <span className="title-star inline-flex" aria-hidden="true">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-[clamp(2.5rem,7vw,6rem)] w-auto motion-safe:animate-[spin_24s_linear_infinite]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                        >
                            <path d="M50 4V96M4 50H96M17.5 17.5L82.5 82.5M82.5 17.5L17.5 82.5" />
                        </svg>
                    </span>
                </div>

                {/* Highlighted word */}
                <div
                    className="flavor-text-scroll -rotate-2 overflow-hidden bg-noir-black px-3 py-2 sm:px-5 sm:py-3"
                    style={{ clipPath: "inset(0% 100% 0% 0%)" }}
                >
                    <p className="font-anton text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] tracking-[-0.035em] text-noir-red">
                        Freaking
                    </p>
                </div>

                {/* Line 3 + hand-drawn underline */}
                <div>
                    <div className="second-text-split overflow-hidden py-1">
                        <h2 className="font-anton text-[clamp(3rem,9.5vw,8.5rem)] uppercase leading-[0.9] tracking-[-0.045em]">
                            Delicious flavors
                        </h2>
                    </div>
                    <svg
                        className="title-scribble -mt-1 h-3 w-[min(78vw,44rem)] sm:h-4"
                        viewBox="0 0 600 24"
                        preserveAspectRatio="none"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            pathLength="1"
                            d="M4 14 C80 4 140 22 230 12 S400 6 470 15 S560 8 596 12"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="1"
                        />
                    </svg>
                </div>

                <div className="title-meta mt-4 flex w-full items-center justify-between gap-6 overflow-hidden">
                    <p className="font-anton text-sm uppercase tracking-[0.18em] sm:text-base">
                        NOIR BISTRO — SIGNATURE DISHES
                    </p>
                    <p className="font-anton flex items-center gap-3 text-sm uppercase tracking-[0.18em] sm:text-base">
                        Scroll to taste
                        <svg className="dish-drop h-5 w-4" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 2V21M2 15L8 21L14 15" />
                        </svg>
                    </p>
                </div>
            </div>
        </div>
    );
}