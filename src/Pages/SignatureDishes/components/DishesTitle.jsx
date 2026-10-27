
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function DishesTitle() {
    const container = useRef(null);


    useGSAP(
        () => {
            const firstSplit = new SplitText(".first-text-split h1", {
                type: "chars",
            });

            const secondSplit = new SplitText(".second-text-split h1", {
                type: "chars",
            });

            // Set the initial state BEFORE creating the scroll animation.
            gsap.set(
                [firstSplit.chars, secondSplit.chars],
                {
                    yPercent: 120,
                    rotate: 4,
                }
            );

            gsap.set(".flavor-text-scroll", {
                clipPath: "inset(0% 100% 0% 0%)",
            });

            // Animation starts only when this section enters the viewport.
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 70%",
                    once: true,
                },
            });

            timeline
                .to(firstSplit.chars, {
                    yPercent: 0,
                    rotate: 0,
                    stagger: 0.045,
                    duration: 0.8,
                    ease: "power4.out",
                })
                .to(
                    ".flavor-text-scroll",
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: 0.8,
                        ease: "power4.inOut",
                    },
                    "-=0.35"
                )
                .to(
                    secondSplit.chars,
                    {
                        yPercent: 0,
                        rotate: 0,
                        stagger: 0.025,
                        duration: 0.75,
                        ease: "power4.out",
                    },
                    "-=0.35"
                );

            return () => {
                firstSplit.revert();
                secondSplit.revert();
            };
        },
        { scope: container }
    );


    return (
        <section
            ref={container}
            className="flavor-section relative flex min-h-[65vh] w-full items-center overflow-hidden bg-noir-red px-4 py-16 text-noir-black sm:px-8 md:min-h-[75vh] md:px-12 lg:px-16"
            aria-label="Discover the Noir Bistro menu"
        >
            <div className="general-title flex w-full flex-col items-start justify-center gap-3 sm:gap-5 lg:gap-6">
                {/* First line */}
                <div className="first-text-split overflow-hidden py-1">
                    <h1 className="font-anton text-[clamp(3.5rem,10vw,9rem)] uppercase leading-[0.9] tracking-[-0.045em]">
                        We have 6
                    </h1>
                </div>

                {/* Highlighted word reveal */}
                <div
                    className="flavor-text-scroll -rotate-2 overflow-hidden bg-noir-black px-3 py-2 sm:px-5 sm:py-3"
                    style={{
                        clipPath: "inset(0% 100% 0% 0%)",
                    }}
                >
                    <h2 className="font-anton text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] tracking-[-0.035em] text-noir-red">
                        Freaking
                    </h2>
                </div>

                {/* Final line */}
                <div className="second-text-split overflow-hidden py-1">
                    <h1 className="font-anton text-[clamp(3rem,9.5vw,8.5rem)] uppercase leading-[0.9] tracking-[-0.045em]">
                        Delicious flavors
                    </h1>
                </div>

                <p className="mt-3 self-end font-anton text-sm uppercase tracking-[0.18em] sm:text-base">
                    NOIR BISTRO — THE MENU
                </p>
            </div>
        </section>
    );
}
