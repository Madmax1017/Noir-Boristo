import { memo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// All dishes use a circular frame so circular plates and bowls are never clipped/tripped.
const VARIANT = "circle";

/**
 * One dish in the showcase.
 *
 * Transform layers (separate so GSAP tweens never fight each other):
 *   .dish-media  -> scale / opacity / rotate, driven by SignatureDishes on scroll
 *   .dish-hover  -> hover scale + tilt, driven here
 *   .dish-frame  -> clip-path reveal + circle shape mask
 *   .dish-img    -> scroll parallax (xPercent) + pointer drift (x / y)
 *   .dish-text > * -> GSAP text reveals (see SignatureDishes) + scroll parallax (x), at different speeds
 */
function DishCard({ dish, index, total, priority = false }) {
    const { name, displayName, marathiName, category, image, type } = dish;
    const root = useRef(null);

    const flip = index % 2 === 1;

    /* Desktop-only hover: slight scale, soft tilt, image drift. */
    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add(
                "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
                () => {
                    const el = root.current.querySelector(".dish-hover");
                    const img = root.current.querySelector(".dish-img");
                    if (!el || !img) return;

                    gsap.set(el, { transformPerspective: 900 });

                    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
                    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
                    const ix = gsap.quickTo(img, "x", { duration: 0.8, ease: "power3.out" });
                    const iy = gsap.quickTo(img, "y", { duration: 0.8, ease: "power3.out" });

                    const onEnter = () => gsap.to(el, { scale: 1.03, duration: 0.6, ease: "power3.out" });

                    const onMove = (e) => {
                        const r = el.getBoundingClientRect();
                        const nx = (e.clientX - r.left) / r.width - 0.5;
                        const ny = (e.clientY - r.top) / r.height - 0.5;
                        ry(nx * 5);
                        rx(-ny * 5);
                        ix(nx * -8);
                        iy(ny * -8);
                    };

                    const onLeave = () => {
                        gsap.to(el, { scale: 1, duration: 0.7, ease: "power3.out" });
                        rx(0);
                        ry(0);
                        ix(0);
                        iy(0);
                    };

                    el.addEventListener("pointerenter", onEnter);
                    el.addEventListener("pointermove", onMove);
                    el.addEventListener("pointerleave", onLeave);

                    return () => {
                        el.removeEventListener("pointerenter", onEnter);
                        el.removeEventListener("pointermove", onMove);
                        el.removeEventListener("pointerleave", onLeave);
                    };
                }
            );

            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <article
            ref={root}
            className={`dish-card dish-card--${VARIANT}${flip ? " dish-card--flip" : ""}`}
            data-type={type}
            aria-label={`${displayName}, ${index + 1} of ${total}`}
        >
            <div className="dish-media">
                <div className="dish-hover">
                    <div className="dish-frame">
                        <img
                            className="dish-img"
                            src={image}
                            alt={name}
                            loading={priority ? "eager" : "lazy"}
                            fetchPriority={priority ? "high" : "auto"}
                            decoding="async"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            <div className="dish-text">
                <p className="dish-category">
                    <span className="dish-dot" aria-hidden="true" />
                    {category}
                    <span className="dish-type">/ {type}</span>
                </p>
                <h3 className="dish-name font-anton">{displayName}</h3>
                <p className="dish-marathi" lang="mr">
                    {marathiName}
                </p>
            </div>
        </article>
    );
}

export default memo(DishCard);