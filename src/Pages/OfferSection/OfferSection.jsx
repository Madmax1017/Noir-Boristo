import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import OfferBanner, { TUESDAY_OFFERS } from "./OfferBanner";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Swap in real photography by passing `images`:
 *   <OfferSection images={[
 *     { src: chineseImg, alt: "Chinese dishes at Noir Bistro" },
 *     { src: pizzaImg,   alt: "Fresh pizza at Noir Bistro" },
 *   ]} />
 * Entries without a `src` render a labelled placeholder frame.
 */
const DEFAULT_IMAGES = [
    { src: "/images/offer/Chinese-img.jpg", alt: "Chinese food image" },
    { src: "/images/offer/Pizza-img.jpg", alt: "Pizza image" },
];

const ImageFrame = ({ image, offset }) => (
    <figure
        data-frame
        className={`relative aspect-[4/5] overflow-hidden border-4 border-noir-black ${offset ? "mt-12 sm:mt-20" : ""
            }`}
    >
        {image.src ? (
            <img
                data-parallax
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
            />
        ) : (
            <div className="grid h-full w-full place-items-center bg-noir-black/10 p-4 text-center font-anton text-2xl uppercase tracking-wide">
                {image.alt}
            </div>
        )}
    </figure>
);

const OfferSection = ({ images = DEFAULT_IMAGES }) => {
    const sectionRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // One orchestrated entrance when the section scrolls into view.
                const tl = gsap.timeline({
                    defaults: { ease: "power4.out" },
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        once: true,
                    },
                });

                tl.from("[data-line]", { yPercent: 110, duration: 0.9, stagger: 0.1 })
                    .from(
                        "[data-frame]",
                        {
                            clipPath: "inset(0% 0% 100% 0%)",
                            duration: 1,
                            stagger: 0.15,
                            ease: "expo.inOut",
                        },
                        "-=0.7"
                    )
                    .from(
                        "[data-row]",
                        { opacity: 0, x: -40, duration: 0.7, stagger: 0.12 },
                        "-=0.6"
                    )
                    .from("[data-cta]", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3");

                // Subtle image parallax tied to scroll.
                gsap.utils.toArray("[data-frame]").forEach((frame) => {
                    const img = frame.querySelector("[data-parallax]");
                    if (!img) return;
                    gsap.fromTo(
                        img,
                        { yPercent: -5 },
                        {
                            yPercent: 5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: frame,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                });
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            aria-labelledby="offer-section-title"
            className="bg-noir-red text-noir-black"
        >
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-12 lg:gap-10">
                {/* Text column */}
                <div className="flex flex-col justify-between gap-12 lg:col-span-6">
                    <div>
                        <h2
                            id="offer-section-title"
                            className="font-anton text-[clamp(4.5rem,13vw,11rem)] uppercase leading-[0.85]"
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
                    </div>

                    <ul className="border-b-4 border-noir-black">
                        {TUESDAY_OFFERS.map((offer) => (
                            <li
                                key={offer.id}
                                data-row
                                className="flex flex-col gap-2 border-t-4 border-noir-black py-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
                            >
                                <p className="font-anton text-4xl uppercase leading-none sm:text-5xl">
                                    {offer.headline}
                                </p>
                                <p className="font-anton text-xl uppercase leading-tight tracking-wide sm:text-right sm:text-2xl">
                                    {offer.detail}
                                    <span className="block">{offer.time}</span>
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div data-cta>
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            aria-haspopup="dialog"
                            aria-expanded={isOpen}
                            className="bg-noir-black px-8 py-4 font-anton text-2xl uppercase tracking-wide text-noir-red transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-noir-black"
                        >
                            View Tuesday offers
                        </button>
                    </div>
                </div>

                {/* Imagery column */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6">
                    {images.slice(0, 2).map((image, i) => (
                        <ImageFrame key={image.alt + i} image={image} offset={i === 1} />
                    ))}
                </div>
            </div>

            {isOpen && <OfferBanner onClose={() => setIsOpen(false)} />}
        </section>
    );
};

export default OfferSection;