import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const ADDRESS_LINES = [
  "Gala No.06, 1951/1: CHENDHARE: ALIBAG RAIGAD Chendhare",
  "Alibag, Maharashtra 402201",
];

const HOURS = [
  { day: "Monday to Friday", time: "9:00 AM to 10:00 PM" },
  { day: "Saturday", time: "9:00 AM to 12:00 PM" },
  { day: "Sunday", time: "9:00 AM to 11:00 PM" },
];

const PHONE = "+91 000 000 0000";
const EMAIL = "hello@noirbistro.com";
const MAPS_URL = "https://maps.app.goo.gl/ZH3vTzpijBm6sryU6";

/* -------------------------------------------------------------------------- */
/*  Vector icons (linework only, no emoji)                                    */
/* -------------------------------------------------------------------------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square",
  "aria-hidden": true,
};

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.5V12l3.5 2.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </svg>
);

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Stylized map card                                                         */
/* -------------------------------------------------------------------------- */

function StylizedMap() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* fine grid */}
      <g stroke="currentColor" strokeWidth="0.5" className="text-noir-red/10">
        {Array.from({ length: 31 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" />
        ))}
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="600" y2={i * 20} />
        ))}
      </g>

      {/* "streets" */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-noir-red/25"
      >
        <path d="M-10 300 L180 240 L330 262 L610 150" />
        <path d="M120 -10 L160 140 L250 400" />
        <path d="M430 -10 L400 120 L470 250 L520 410" />
        <path d="M-10 90 L210 120 L330 200" strokeDasharray="6 8" />
      </g>

      {/* contour rings centred on the pin */}
      <g
        className="map-rings"
        fill="none"
        stroke="currentColor"
        style={{ transformOrigin: "300px 200px" }}
      >
        <circle cx="300" cy="200" r="150" strokeWidth="0.75" className="text-noir-red/20" />
        <circle cx="300" cy="200" r="105" strokeWidth="0.75" className="text-noir-red/35" />
        <circle cx="300" cy="200" r="64" strokeWidth="1" className="text-noir-red/60" />
      </g>

      {/* crosshair ticks */}
      <g stroke="currentColor" strokeWidth="1" className="text-noir-red">
        <line x1="300" y1="20" x2="300" y2="50" />
        <line x1="300" y1="350" x2="300" y2="380" />
        <line x1="20" y1="200" x2="50" y2="200" />
        <line x1="550" y1="200" x2="580" y2="200" />
      </g>

      {/* monogram pin */}
      <g className="map-pin" style={{ transformOrigin: "300px 200px" }}>
        <circle cx="300" cy="200" r="38" className="map-pin-disc fill-noir-red" />
        <circle
          cx="300"
          cy="200"
          r="46"
          fill="none"
          strokeWidth="1.5"
          className="stroke-noir-red"
        />
        <text
          x="300"
          y="216"
          textAnchor="middle"
          fontSize="46"
          className="font-anton fill-noir-black"
          style={{ fontFamily: "Anton, sans-serif" }}
        >
          N
        </text>
      </g>
    </svg>
  );
}

function MapCard({ mapEmbedSrc }) {
  return (
    <div className="map-card group relative isolate overflow-hidden border border-noir-red bg-noir-black">
      <div className="relative aspect-[16/10] w-full">
        {mapEmbedSrc ? (
          <iframe
            title="Noir Bistro location map"
            src={mapEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale contrast-125 invert-[0.92] hue-rotate-180"
          />
        ) : (
          <StylizedMap />
        )}

        {/* corner brackets */}
        {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map(
          (pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute h-5 w-5 border-noir-red ${pos}`}
            />
          )
        )}
      </div>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-anton flex items-center justify-between gap-4 border-t border-noir-red bg-noir-red px-6 py-5 text-lg uppercase tracking-[0.12em] text-noir-black transition-colors duration-300 hover:bg-noir-black hover:text-noir-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-noir-red sm:text-xl"
      >
        <span>OPEN IN GOOGLE MAPS ↗</span>
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function LocationSection({
  imageSrc = "/images/noir-hero.jpg",
  imageAlt = "Interior of Noir Bistro in Alibag",
  mapEmbedSrc = "",
}) {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
        },
        (ctx) => {
          const { reduce, desktop } = ctx.conditions;
          if (reduce) return; // content stays fully visible, no motion

          /* 1. Entrance sequence: headline -> photo mask -> frame -> badge */
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".loc-top",
              start: "top 80%",
              once: true,
            },
          });

          tl.fromTo(
            ".loc-line > span",
            { yPercent: 110 },
            { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.14 }
          )
            .fromTo(
              ".loc-photo-mask",
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" },
              "-=0.55"
            )
            .fromTo(
              ".loc-photo-img",
              { scale: 1.28 },
              { scale: 1.12, duration: 1.6 },
              "<"
            )
            .fromTo(
              ".loc-frame",
              { x: 24, y: -24, opacity: 0 },
              { x: 0, y: 0, opacity: 1, duration: 0.8 },
              "-=0.6"
            )
            .fromTo(
              ".loc-badge",
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
              "-=0.4"
            );

          /* 3. Parallax on the photo (-5% to 5%) --------------------------- */
          gsap.fromTo(
            ".loc-photo-img",
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: ".loc-photo",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );

          /* 4. Schedule + details: rows slide up under their masks --------- */
          gsap.fromTo(
            ".loc-row > span, .loc-row > a",
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: {
                trigger: ".loc-schedule",
                start: "top 85%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            ".loc-rule",
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1,
              ease: "power3.inOut",
              stagger: 0.1,
              scrollTrigger: {
                trigger: ".loc-schedule",
                start: "top 85%",
                once: true,
              },
            }
          );

          /* 5. Map card: clip-path reveal ---------------------------------- */
          gsap.fromTo(
            ".map-card",
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: ".map-card",
                start: "top 85%",
                once: true,
              },
            }
          );

          /* Desktop only: oversized background word drifts against scroll */
          if (desktop) {
            gsap.fromTo(
              ".loc-ghost",
              { yPercent: 8 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }

          // Cleanup
          return () => {
            gsap.set(
              [
                ".loc-line > span",
                ".loc-photo-mask",
                ".loc-photo-img",
                ".loc-frame",
                ".loc-badge",
                ".loc-row > span",
                ".loc-row > a",
                ".loc-rule",
                ".map-card",
                ".loc-ghost",
              ],
              { clearProps: "all" }
            );
          };
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="location"
      aria-labelledby="location-heading"
      className="relative overflow-hidden bg-noir-black py-24 text-noir-red sm:py-32 lg:py-40"
    >
      {/* Ghost word, architectural backdrop */}
      <span
        aria-hidden="true"
        className="loc-ghost font-anton pointer-events-none absolute -right-6 top-24 select-none text-[34vw] leading-none text-transparent lg:text-[26vw]"
        style={{ WebkitTextStroke: "1px rgba(230, 35, 35, 0.1)" }}
      >
        N
      </span>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Row 1: stacked headline + framed photo, side by side, no overlap */}
        <div className="loc-top grid grid-cols-12 items-end gap-x-10 gap-y-16">
          {/* Headline: two lines, both red */}
          <h2
            id="location-heading"
            className="loc-headline font-anton col-span-12 uppercase leading-[0.9] tracking-tight lg:col-span-6"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="loc-line block text-[clamp(3.5rem,8vw,7.5rem)] text-noir-red">
                <span className="inline-block will-change-transform">FIND US</span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] pl-[10%]">
              <span className="loc-line block text-[clamp(3.5rem,8vw,7.5rem)] text-noir-red">
                <span className="inline-block will-change-transform">COME ON IN</span>
              </span>
            </span>
          </h2>

          {/* Framed venue photo, tucked beside the headline */}
          <figure className="loc-photo relative col-span-12 mr-5 sm:mr-6 lg:col-span-6 xl:col-span-5 xl:col-start-8">
            {/* offset frame sits behind and to the lower-left */}
            <span
              aria-hidden="true"
              className="loc-frame absolute -bottom-5 -left-5 right-5 top-5 border border-noir-red sm:-bottom-6 sm:-left-6 sm:right-6 sm:top-6"
            />
            <div className="loc-photo-mask relative aspect-[4/3] overflow-hidden bg-neutral-900">
              <img
                src={imageSrc}
                alt={imageAlt}
                loading="lazy"
                className="loc-photo-img absolute inset-0 h-full w-full scale-[1.12] object-cover will-change-transform"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-noir-black/60 via-transparent to-transparent"
              />
            </div>

            {/* badge settles onto the frame's lower-left corner */}
            <div className="absolute -bottom-5 left-6 z-10 overflow-hidden sm:-bottom-6 sm:left-8">
              <figcaption className="loc-badge font-anton border border-noir-red bg-noir-black px-4 py-2 text-sm uppercase tracking-[0.2em] text-noir-red sm:text-base">
                Alibag, Raigad
              </figcaption>
            </div>
          </figure>
        </div>

        {/* Row 2: address, schedule, contact | map */}
        <div className="mt-28 grid grid-cols-12 gap-y-16 lg:mt-32 lg:gap-x-10">
          {/* Info column */}
          <div className="loc-schedule col-span-12 lg:col-span-6 xl:col-span-5">
            {/* Address */}
            <div className="border-l-4 border-noir-red pl-6">
              <h3 className="font-anton flex items-center gap-3 text-2xl uppercase tracking-wide text-noir-red sm:text-3xl">
                <PinIcon />
                Address
              </h3>
              <address className="mt-5 not-italic">
                {ADDRESS_LINES.map((line) => (
                  <p
                    key={line}
                    className="font-anton text-xl uppercase leading-snug tracking-wide text-noir-red sm:text-2xl"
                  >
                    {line}
                  </p>
                ))}
              </address>
            </div>

            {/* Opening hours: editorial schedule */}
            <div className="mt-14 border-l-4 border-noir-red pl-6">
              <h3 className="font-anton flex items-center gap-3 text-2xl uppercase tracking-wide text-noir-red sm:text-3xl">
                <ClockIcon />
                Opening Hours
              </h3>

              <dl className="mt-6">
                <span className="loc-rule block h-px w-full bg-noir-red" />
                {HOURS.map(({ day, time }) => (
                  <div key={day}>
                    <div className="loc-row grid grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline">
                      <div className="overflow-hidden">
                        <dt className="font-anton text-lg uppercase tracking-wide text-noir-red sm:text-xl">
                          <span className="inline-block">{day}</span>
                        </dt>
                      </div>
                      <div className="overflow-hidden">
                        <dd className="font-anton text-lg uppercase tracking-wide text-noir-red sm:text-xl sm:text-right">
                          <span className="inline-block">{time}</span>
                        </dd>
                      </div>
                    </div>
                    <span className="loc-rule block h-px w-full bg-noir-red/30" />
                  </div>
                ))}
              </dl>
            </div>

            {/* Contact */}
            <div className="mt-14 border-l-4 border-noir-red pl-6">
              <h3 className="font-anton text-2xl uppercase tracking-wide text-noir-red sm:text-3xl">
                Reservations
              </h3>
              <ul className="mt-5 space-y-3">
                <li className="loc-row overflow-hidden">
                  <a
                    href={`tel:${PHONE.replace(/\s/g, "")}`}
                    className="font-anton inline-flex items-center gap-3 text-xl uppercase tracking-wide text-noir-red transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-red sm:text-2xl"
                  >
                    <span className="text-noir-red">
                      <PhoneIcon />
                    </span>
                    {PHONE}
                  </a>
                </li>
                <li className="loc-row overflow-hidden">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-anton inline-flex items-center gap-3 break-all text-xl tracking-wide text-noir-red transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-red sm:text-2xl"
                  >
                    <span className="text-noir-red">
                      <MailIcon />
                    </span>
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Map column */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7 relative z-10">
            <MapCard mapEmbedSrc={mapEmbedSrc} />
          </div>
        </div>
      </div>

      {/* Hover behaviour for the SVG pin */}
      <style>{`
        .map-card .map-pin,
        .map-card .map-rings {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .map-card .map-pin-disc {
          transition: fill 0.3s ease;
        }
        .map-card:hover .map-pin { transform: scale(1.14); }
        .map-card:hover .map-rings { transform: scale(1.08); }
        @media (prefers-reduced-motion: reduce) {
          .map-card .map-pin,
          .map-card .map-rings { transition: none; }
        }
      `}</style>
    </section>
  );
}