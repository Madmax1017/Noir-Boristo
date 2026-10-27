
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function MessageSection() {
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const firstSplit = new SplitText(".message-first", {
                type: "words",
            });

            const secondSplit = new SplitText(".message-second", {
                type: "words",
            });

            const paragraphSplit = new SplitText(".message-description", {
                type: "words,lines",
                linesClass: "message-line",
            });

            gsap.to(firstSplit.words, {
                color: "#faeade",
                stagger: 0.08,
                ease: "power1.in",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 65%",
                    end: "center 45%",
                    scrub: true,
                },
            });

            gsap.to(secondSplit.words, {
                color: "#faeade",
                stagger: 0.08,
                ease: "power1.in",
                scrollTrigger: {
                    trigger: ".message-second",
                    start: "top 75%",
                    end: "bottom 45%",
                    scrub: true,
                },
            });

            gsap.to(".message-highlight", {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                ease: "circ.inOut",
                scrollTrigger: {
                    trigger: ".message-highlight",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.from(paragraphSplit.words, {
                yPercent: 120,
                rotate: 3,
                stagger: 0.025,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".message-description",
                    start: "top 85%",
                    once: true,
                },
            });

            return () => {
                firstSplit.revert();
                secondSplit.revert();
                paragraphSplit.revert();
            };
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="message-section relative overflow-hidden bg-noir-black px-5 py-20 text-noir-red sm:px-8 md:py-32 lg:px-16"
        >
            <div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
                <div className="message-wrapper flex flex-col items-start gap-3 sm:gap-5">
                    <h2 className="message-first font-anton text-[clamp(2.5rem,7.5vw,7rem)] uppercase leading-[0.95] tracking-tight">
                        GOOD FOOD.
                    </h2>

                    <div
                        className="message-highlight -rotate-2 overflow-hidden bg-noir-red px-4 py-2 sm:px-7 sm:py-3"
                        style={{
                            clipPath: "inset(0% 100% 0% 0%)",
                        }}
                    >
                        <h3 className="font-anton text-[clamp(2.5rem,8vw,7.5rem)] uppercase leading-[0.95] tracking-tight text-noir-black">
                            GREAT MOOD.
                        </h3>
                    </div>

                    <h2 className="message-second font-anton text-[clamp(2.3rem,6.5vw,6rem)] uppercase leading-[0.98] tracking-tight">
                        ALWAYS NOIR.
                    </h2>
                </div>

                <div className="mt-12 flex justify-end sm:mt-16 md:mt-20">
                    <div className="max-w-lg overflow-hidden">
                        <p className="message-description text-base leading-relaxed text-noir-red/80 sm:text-lg md:text-xl">
                            From the first bite to the last sip, every visit is
                            an invitation to slow down, discover bold flavours,
                            and make moments worth coming back for. Welcome
                            to Noir Bistro.
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-noir-red/30 pt-5">
          <span className="font-anton text-xs uppercase tracking-[0.2em] text-noir-red/70 sm:text-sm">
            NOIR BISTRO
          </span>

                    <span className="text-xs uppercase tracking-[0.15em] text-noir-red/70 sm:text-sm">
            Made for good moments.
          </span>
                </div>
            </div>
        </section>
    );
}
