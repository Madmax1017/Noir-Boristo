
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ambienceImages from "./ambience.js";


gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const galleryRef = useRef(null);

  useGSAP(
    () => {
      const frames = gsap.utils.toArray(".ambience-frame");

      frames.forEach((frame) => {
        const image = frame.querySelector(".ambience-image");

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: frame,
            start: "top 85%",
            once: true,
          },
        });

        reveal
          .fromTo(
            frame,
            {
              clipPath: "inset(10% 5% 10% 5%)",
              y: 45,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 1,
              ease: "power3.out",
            }
          )
          .fromTo(
            image,
            { scale: 1.15 },
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "<"
          );
      });

      gsap.from(".ambience-copy", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: galleryRef }
  );

  const featuredImage = ambienceImages[0];
  const moodImage = ambienceImages[1];
  const counterImage = ambienceImages[2];
  const spaceImage = ambienceImages[3];
  const detailImages = ambienceImages.slice(4);

  const renderImage = (item, number, aspect = "aspect-[4/3]") => (
    <figure key={item.id} className="min-w-0">
      <div
        className={`ambience-frame group relative ${aspect} overflow-hidden bg-noir-black`}
      >
        <img
          src={item.image}
          alt={item.alt}
          loading={item.id === 1 ? "eager" : "lazy"}
          onError={(event) => {
            console.error("Ambience image failed to load:", item.image);
            event.currentTarget.alt = `${item.alt} (image failed to load)`;
          }}
          className="ambience-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <span className="absolute left-4 top-4 bg-noir-red px-3 py-2 font-anton text-xs tracking-widest text-noir-black">
          {String(number).padStart(2, "0")} / {item.category}
        </span>
      </div>

      <figcaption className="mt-3 flex items-center justify-between gap-3">
        <span className="font-anton text-lg uppercase sm:text-xl">
          {item.title}
        </span>
        <span className="text-xs tracking-widest text-noir-black/60">
          {String(number).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );

  return (
    <div
      ref={galleryRef}
      className="mx-auto w-full max-w-[1600px] px-5 py-16 sm:px-8 md:px-12 md:py-24 lg:px-16"
    >
      {/* Editorial heading */}
      <div className="mb-14 md:mb-24">
        {/* Eyebrow */}
        <p className="ambience-copy mb-6 text-[11px] tracking-[0.35em] text-noir-black/50 uppercase">
          STEP INSIDE / NOIR BISTRO
        </p>

        {/* Main heading — single line on desktop */}
        <h2 className="ambience-copy font-anton text-[clamp(2.4rem,5vw,5rem)] uppercase leading-none tracking-tight text-noir-black">
          A MOOD OF ITS OWN.
        </h2>

        {/* Divider */}
        <div className="mt-8 h-px w-20 bg-noir-black/20" aria-hidden="true" />

        {/* Description */}
        <p className="ambience-copy mt-6 max-w-md text-sm leading-[1.85] text-noir-black/60 sm:text-base">
          Bold red interiors. Warm lights. Dark corners.
          A space made for good food and even better company.
        </p>
      </div>

      {/* Main editorial gallery */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-y-20">
        <div className="md:col-span-8">
          {renderImage(featuredImage, 1, "aspect-[4/3] md:aspect-[5/4]")}
        </div>

        <div className="md:col-span-4 md:mt-28">
          {renderImage(moodImage, 2, "aspect-[4/3] md:aspect-[3/4]")}
        </div>

        <div className="md:col-span-5 md:mt-8">
          {renderImage(counterImage, 3, "aspect-[4/3]")}
        </div>

        <div className="md:col-span-7 md:mt-24">
          {renderImage(spaceImage, 4, "aspect-[4/3]")}
        </div>

        {/* Remaining images: IDs 5, 6 and 7 */}
        {detailImages.map((item, index) => (
          <div
            key={item.id}
            className={`md:col-span-4 ${index === 1 ? "md:mt-16" : ""
              }`}
          >
            {renderImage(item, item.id, "aspect-[4/3]")}
          </div>
        ))}
      </div>

      {/* Closing statement */}
      <div className="ambience-copy mt-20 border-t border-noir-black/30 pt-6 md:mt-28">
        <p className="font-anton text-[clamp(2rem,5vw,4rem)] uppercase leading-none tracking-tight text-noir-black">
          Eat well. Stay longer.
        </p>
      </div>
    </div>
  );
}
