import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ambienceImages = [
  {
    id: 1,
    image: "/images/ambience/_DSC9886.jpg",
    alt: "Wide view of Noir Bistro's red-lit dining room",
    title: "THE NOIR EXPERIENCE",
    category: "THE SPACE",
    size: "featured",
  },
  {
    id: 2,
    image: "/images/ambience/_DSC9877.jpg",
    alt: "Warm pendant lamp illuminating the Noir Rules poster",
    title: "SET THE MOOD",
    category: "THE DETAILS",
    size: "portrait",
  },
  {
    id: 3,
    image: "/images/ambience/_DSC9901.jpg",
    alt: "Noir Bistro's counter, bottles, and ambient lighting",
    title: "BEHIND THE COUNTER",
    category: "THE CRAFT",
    size: "landscape",
  },
  {
    id: 4,
    image: "/images/ambience/_DSC9904.jpg",
    alt: "Interior view of Noir Bistro's dining space",
    title: "MADE FOR MOMENTS",
    category: "THE SPACE",
    size: "landscape",
  },
  {
    id: 5,
    image: "/images/ambience/_DSC9919.jpg",
    alt: "Noir Bistro branding framed by the restaurant interior",
    title: "THE NOIR IDENTITY",
    category: "THE BRAND",
    size: "portrait",
  },
  {
    id: 6,
    image: "/images/ambience/_DSC9943.jpg",
    alt: "Red-lit restaurant seating and interior details",
    title: "EVERY CORNER",
    category: "THE DETAILS",
    size: "landscape",
  },
  {
    id: 7,
    image: "/images/ambience/_DSC9952.jpg",
    alt: "Close-up of Noir Bistro's decor and counter details",
    title: "A CLOSER LOOK",
    category: "THE CRAFT",
    size: "portrait",
  },
];

/* Card proportions per size */
const ASPECT = {
  featured: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[3/2]",
};

/*
  Asymmetric three-column layout (desktop). Each column carries its own
  vertical offset and parallax travel so the columns drift at different
  speeds. Positive travel moves a column up faster than the page scroll,
  negative travel lets it lag behind.
*/
const COLUMNS = [
  { ids: [1, 4], span: "lg:col-span-6", offset: "lg:mt-0", travel: -40 },
  { ids: [2, 3, 6], span: "lg:col-span-3", offset: "lg:mt-32", travel: 90 },
  { ids: [5, 7], span: "lg:col-span-3", offset: "lg:mt-12", travel: 20 },
];

const byId = (id) => ambienceImages.find((item) => item.id === id);

function GalleryCard({ item }) {
  return (
    <figure
      data-gallery-card
      tabIndex={0}
      className="group relative m-0 overflow-hidden border-2 border-noir-black bg-noir-black outline-none focus-visible:ring-4 focus-visible:ring-noir-black focus-visible:ring-offset-4 focus-visible:ring-offset-noir-red"
    >
      <div className={`relative w-full overflow-hidden ${ASPECT[item.size]}`}>
        {/* Parallax wrapper: GSAP moves this, CSS hover scales the image inside */}
        <div
          data-gallery-parallax
          className="absolute inset-x-0 -top-[8%] h-[116%] w-full will-change-transform"
        >
          <img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-within:scale-110"
          />
        </div>

        {/* Category badge, always visible */}
        <span className="absolute left-0 top-0 bg-noir-black px-3 py-1.5 font-anton text-xs tracking-widest text-noir-red md:text-sm">
          {item.category}
        </span>

        {/* Title badge, revealed on hover / focus (always shown on touch devices) */}
        <div
          className="absolute bottom-0 left-0 max-w-[90%] translate-y-full bg-noir-black px-4 py-3 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0"
        >
          <figcaption className="font-anton text-xl uppercase leading-none tracking-wide text-noir-red md:text-2xl">
            {item.title}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

export default function GallerySection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Entry animation: staggered fade and slide up, once per card batch */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray("[data-gallery-card]");
        gsap.set(cards, { autoAlpha: 0, y: 70 });

        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.14,
              overwrite: true,
            }),
        });

        gsap.from("[data-gallery-heading]", {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-gallery-heading]", start: "top 88%" },
        });
      });

      /* Parallax: desktop only, columns drift at different speeds */
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const grid = sectionRef.current.querySelector("[data-gallery-grid]");

          gsap.utils.toArray("[data-gallery-column]").forEach((col) => {
            const travel = parseFloat(col.dataset.travel || "0");
            gsap.fromTo(
              col,
              { y: -travel / 2 },
              {
                y: travel / 2,
                ease: "none",
                scrollTrigger: {
                  trigger: grid,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              }
            );
          });
        }
      );

      /* Inner image drift: subtle depth inside each frame, all breakpoints */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray("[data-gallery-parallax]").forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: layer.closest("[data-gallery-card]"),
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
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-noir-red py-20 text-noir-black md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Heading */}
        <header
          data-gallery-heading
          className="mb-14 grid gap-6 border-b-2 border-noir-black pb-8 md:mb-24 md:grid-cols-12 md:items-end"
        >
          <h2
            id="gallery-heading"
            className="font-anton text-6xl uppercase leading-[0.9] tracking-tight text-noir-black sm:text-7xl md:col-span-8 md:text-8xl lg:text-9xl"
          >
            Inside
            <br />
            Noir Bistro
          </h2>
          <p className="max-w-sm font-sans text-base font-medium leading-relaxed text-noir-black md:col-span-4 md:justify-self-end md:text-lg">
            Low light, red glass, and a room built for long evenings. Take a
            look at the space, the details, and the people behind the counter.
          </p>
        </header>

        {/* Asymmetric parallax grid */}
        <div
          data-gallery-grid
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8"
        >
          {COLUMNS.map((col, index) => (
            <div
              key={index}
              data-gallery-column
              data-travel={col.travel}
              className={`flex flex-col gap-6 will-change-transform lg:gap-8 ${col.span} ${col.offset} ${index === 0 ? "sm:col-span-2" : ""
                }`}
            >
              {col.ids.map((id) => (
                <GalleryCard key={id} item={byId(id)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}