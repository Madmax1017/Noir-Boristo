import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MAPS_URL = "https://maps.app.goo.gl/ZH3vTzpijBm6sryU6";

/**
 * Replace these placeholders with real details, or pass them as props:
 *   <LocationSection address={[...]} hours={[...]} phone="..." email="..." />
 *
 * Optional: pass `mapEmbedSrc` (the src from Google Maps > Share > Embed a map)
 * to show a live interactive map. The short maps.app.goo.gl link can't be
 * embedded in an iframe, so without it a styled map card is shown instead.
 */
const DEFAULT_ADDRESS = ["Gala No.06, 1951/1: CHENDHARE: ALIBAG RAIGAD Chendhare  ", "Alibag, Maharashtra 402201"];

const DEFAULT_HOURS = [
    { days: "Monday to Friday", time: "9:00 AM to 10:00 PM" },
    { days: "Saturday", time: "9:00 AM to 12:00 PM" },
    { days: "Sunday", time: "9:00 AM to 11:00 PM" },
];

const ArrowUpRight = () => (
    <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        aria-hidden="true"
    >
        <path d="M6 18L18 6M8 6h10v10" />
    </svg>
);

const LocationSection = ({
    imageSrc = "/images/noir-hero.jpg",
    imageAlt = "Noir Bistro cafe exterior",
    address = DEFAULT_ADDRESS,
    hours = DEFAULT_HOURS,
    phone = "+00 000 000 0000",
    email = "hello@noirbistro.com",
    mapEmbedSrc = "",
}) => {
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // Headline and image arrive together as the section's main moment.
                const intro = gsap.timeline({
                    defaults: { ease: "power4.out" },
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        once: true,
                    },
                });

                intro
                    .from("[data-eyebrow]", { opacity: 0, x: -24, duration: 0.6 })
                    .from(
                        "[data-line]",
                        { yPercent: 110, duration: 0.9, stagger: 0.1 },
                        "-=0.3"
                    )
                    .from(
                        "[data-image]",
                        {
                            clipPath: "inset(0% 0% 100% 0%)",
                            duration: 1.1,
                            ease: "expo.inOut",
                        },
                        "-=0.8"
                    )
                    .from(
                        "[data-detail]",
                        { opacity: 0, y: 30, duration: 0.7, stagger: 0.12 },
                        "-=0.6"
                    );

                // The map card reveals on its own once it scrolls into view.
                gsap.from("[data-map]", {
                    opacity: 0,
                    y: 50,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: "[data-map]",
                        start: "top 85%",
                        once: true,
                    },
                });

                // Subtle parallax on the venue photo.
                gsap.fromTo(
                    "[data-parallax]",
                    { yPercent: -5 },
                    {
                        yPercent: 5,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-image]",
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
            id="location"
            ref={sectionRef}
            aria-labelledby="location-title"
            className="bg-noir-black text-noir-red"
        >
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
                {/* Heading */}
                <div className="mb-12 sm:mb-16">
                    <p
                        data-eyebrow
                        className="font-anton text-lg uppercase tracking-widest sm:text-xl"
                    >
                        Find us / Noir Bistro
                    </p>
                    <h2
                        id="location-title"
                        className="mt-4 font-anton text-[clamp(3.5rem,11vw,9rem)] uppercase leading-[0.88]"
                    >
                        <span className="block overflow-hidden">
                            <span data-line className="block">
                                Come on in
                            </span>
                        </span>
                    </h2>
                </div>

                {/* Image + details */}
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        <figure
                            data-image
                            className="relative aspect-[4/3] overflow-hidden border-4 border-noir-red"
                        >
                            <img
                                data-parallax
                                src={imageSrc}
                                alt={imageAlt}
                                loading="lazy"
                                className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
                            />
                        </figure>
                    </div>

                    <dl className="flex flex-col gap-8 lg:col-span-5">
                        <div data-detail className="border-t-4 border-noir-red pt-5">
                            <dt className="font-anton text-3xl uppercase tracking-wide sm:text-4xl">
                                Address
                            </dt>
                            <dd className="mt-3 text-lg leading-relaxed text-white/80">
                                {address.map((line) => (
                                    <span key={line} className="block">
                                        {line}
                                    </span>
                                ))}
                            </dd>
                        </div>

                        <div data-detail className="border-t-4 border-noir-red pt-5">
                            <dt className="font-anton text-3xl uppercase tracking-wide sm:text-4xl">
                                Opening hours
                            </dt>
                            <dd className="mt-3">
                                <ul className="divide-y divide-white/15 text-lg text-white/80">
                                    {hours.map((row) => (
                                        <li
                                            key={row.days}
                                            className="flex items-baseline justify-between gap-6 py-2"
                                        >
                                            <span>{row.days}</span>
                                            <span className="text-right">{row.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>

                        <div data-detail className="border-t-4 border-noir-red pt-5">
                            <dt className="font-anton text-3xl uppercase tracking-wide sm:text-4xl">
                                Contact
                            </dt>
                            <dd className="mt-3 flex flex-col gap-1 text-lg text-white/80">
                                <a
                                    href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                                    className="w-fit underline decoration-noir-red decoration-2 underline-offset-4 transition-colors hover:text-noir-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-red"
                                >
                                    {phone}
                                </a>
                                <a
                                    href={`mailto:${email}`}
                                    className="w-fit underline decoration-noir-red decoration-2 underline-offset-4 transition-colors hover:text-noir-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-red"
                                >
                                    {email}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Map card */}
                <div
                    data-map
                    className="mt-16 grid overflow-hidden border-4 border-noir-red bg-noir-red text-noir-black sm:mt-24 lg:grid-cols-12"
                >
                    <div className="relative min-h-[16rem] lg:col-span-7 lg:min-h-[22rem]">
                        {mapEmbedSrc ? (
                            <iframe
                                title="Noir Bistro location on Google Maps"
                                src={mapEmbedSrc}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full border-0 grayscale contrast-125"
                            />
                        ) : (
                            <a
                                href={MAPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View Noir Bistro on the map (opens in a new tab)"
                                className="group absolute inset-0 block bg-noir-black focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-noir-red"
                            >
                                {/* Stylised street grid stands in for the live map */}
                                <svg
                                    className="absolute inset-0 h-full w-full text-noir-red/30"
                                    preserveAspectRatio="xMidYMid slice"
                                    viewBox="0 0 400 300"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    aria-hidden="true"
                                >
                                    <path d="M0 70h400M0 160h400M0 240h400M80 0v300M190 0v300M300 0v300" />
                                    <path d="M0 300L400 0" strokeWidth="10" />
                                </svg>
                                <span
                                    aria-hidden="true"
                                    className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-noir-red font-anton text-2xl text-noir-black transition-transform duration-300 group-hover:scale-110"
                                >
                                    N
                                </span>
                            </a>
                        )}
                    </div>

                    <div className="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:col-span-5">
                        <div>
                            <h3 className="font-anton text-4xl uppercase leading-none sm:text-5xl">
                                Noir Bistro
                            </h3>
                            <p className="mt-4 text-lg leading-relaxed">
                                {address.join(", ")}
                            </p>
                        </div>

                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex w-fit items-center gap-3 bg-noir-black px-6 py-4 font-anton text-xl uppercase tracking-wide text-noir-red transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-noir-black sm:text-2xl"
                        >
                            Open in Google Maps
                            <ArrowUpRight />
                            <span className="sr-only">(opens in a new tab)</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;