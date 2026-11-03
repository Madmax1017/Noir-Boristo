import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import dishes from "./data/dishes.js";
import DishTitle from "./components/DishesTitle.jsx";
import DishCard from "./components/DishCard.jsx";

import "./SignatureDishes.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const pad = (n) => String(n).padStart(2, "0");

/**
 * Swipe-based horizontal showcase. The page itself still scrolls vertically as normal.
 *   - touch: native swipe with scroll-snap
 *   - trackpad: native horizontal scroll
 *   - mouse: click and drag with a little momentum, or PREV / NEXT, or arrow keys
 * While you swipe, every layer moves at a different speed (parallax).
 */
export default function SignatureDishes() {
    const root = useRef(null);
    const showcaseRef = useRef(null);
    const viewportRef = useRef(null);
    const counterRef = useRef(null);
    const barRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const api = useRef({ go: () => { } });

    const total = dishes.length;

    useGSAP(
        () => {
            const rootEl = root.current;
            const showcase = showcaseRef.current;
            const viewport = viewportRef.current;
            const counterEl = counterRef.current;
            const barEl = barRef.current;
            const prevBtn = prevRef.current;
            const nextBtn = nextRef.current;

            const cards = gsap.utils.toArray(".dish-card", rootEl);
            const n = cards.length;
            if (!n) return;

            const pick = (sel) => cards.map((c) => c.querySelector(sel));
            const medias = pick(".dish-media");
            const frames = pick(".dish-frame");
            const imgs = pick(".dish-img");
            const texts = pick(".dish-text");
            const textKids = texts.map((t) => Array.from(t.children));
            const barKids = gsap.utils.toArray(".dish-bar > *", rootEl);

            const mm = gsap.matchMedia();

            mm.add(
                {
                    motion: "(prefers-reduced-motion: no-preference)",
                    reduce: "(prefers-reduced-motion: reduce)",
                },
                (ctx) => {
                    const { motion } = ctx.conditions;

                    let current = -1;
                    let targetIdx = 0;
                    let entered = false;
                    let raf = 0;
                    let tween = null;
                    const revealed = new Array(n).fill(false);
                    const visible = new Set();
                    const far = new Array(n).fill(false);
                    const textDone = new Array(n).fill(false);
                    const nameSplits = [];
                    const m = { mid: 0, step: 1, centers: [] };

                    const clamp = gsap.utils.clamp;

                    const measure = () => {
                        m.mid = viewport.clientWidth / 2;
                        m.step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : viewport.clientWidth;
                        m.centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
                    };

                    /* ---------- index / counter ---------- */

                    const setIndex = (i) => {
                        if (i === current) return;
                        const first = current === -1;
                        current = i;
                        counterEl.textContent = pad(i + 1);
                        if (motion && !first) {
                            gsap.fromTo(
                                counterEl,
                                { yPercent: 70, opacity: 0 },
                                { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" }
                            );
                        }
                        prevBtn.disabled = i === 0;
                        nextBtn.disabled = i === n - 1;

                        // the newly featured dish re-types its name, a quick, quiet cue
                        if (motion && !first && textDone[i] && nameSplits[i]) {
                            gsap.fromTo(
                                nameSplits[i].chars,
                                { yPercent: 70, opacity: 0 },
                                {
                                    yPercent: 0,
                                    opacity: 1,
                                    duration: 0.55,
                                    ease: "power3.out",
                                    stagger: 0.015,
                                    overwrite: "auto",
                                }
                            );
                        }
                    };

                    /* ---------- entrance (image mask + text rise) ---------- */

                    const reveal = (i) => {
                        if (revealed[i] || !entered) return;
                        revealed[i] = true;
                        const delay = Math.abs(i - Math.max(current, 0)) * 0.12;
                        gsap.to(frames[i], {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.1,
                            ease: "power4.inOut",
                            delay,
                        });
                        gsap.to(imgs[i], { scale: 1.25, duration: 1.6, ease: "power3.out", delay });
                        const [cat, nameEl, mar] = textKids[i];
                        gsap
                            .timeline({
                                delay: delay + 0.3,
                                onComplete: () => {
                                    textDone[i] = true;
                                },
                            })
                            .to(cat, {
                                clipPath: "inset(0% 0% 0% 0%)",
                                opacity: 1,
                                duration: 0.7,
                                ease: "power4.inOut",
                            })
                            .to(
                                nameSplits[i].chars,
                                { yPercent: 0, stagger: 0.025, duration: 0.8, ease: "power4.out" },
                                "-=0.4"
                            )
                            .to(mar, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5");
                    };

                    const markVisible = (i) => {
                        visible.add(i);
                        reveal(i);
                    };

                    /* ---------- per-frame parallax, driven by scrollLeft ---------- */

                    const update = () => {
                        raf = 0;
                        const sl = viewport.scrollLeft;
                        const f = sl / m.step;

                        setIndex(clamp(0, n - 1, Math.round(f)));
                        if (!tween || !tween.isActive()) targetIdx = current;
                        gsap.set(barEl, { scaleX: (f + 1) / n });

                        if (!motion) return;

                        cards.forEach((_, i) => {
                            const d = (m.centers[i] - sl - m.mid) / m.step; // 0 = centred, +-1 = one card away
                            const abs = Math.abs(d);
                            if (abs < 1.3) markVisible(i);

                            if (abs > 2.2) {
                                if (far[i]) return;
                                far[i] = true;
                            } else {
                                far[i] = false;
                            }

                            const a = Math.min(abs, 1);
                            const k = a * a * (3 - 2 * a); // smoothstep
                            const side = clamp(-1, 1, d);
                            const dd = clamp(-1.6, 1.6, d);

                            // depth: the featured dish is biggest and fully opaque
                            gsap.set(medias[i], {
                                scale: 1 - 0.1 * k,
                                opacity: 1 - 0.45 * k,
                                rotate: side * 2,
                            });
                            // image slides inside its frame, opposite to the swipe
                            gsap.set(imgs[i], { xPercent: clamp(-1.2, 1.2, d) * -7 });
                            // text block fades; each line trails at its own speed
                            gsap.set(texts[i], { opacity: 1 - 0.9 * k });
                            gsap.set(textKids[i][0], { x: dd * -24 });
                            gsap.set(textKids[i][1], { x: dd * -56 });
                            gsap.set(textKids[i][2], { x: dd * -88 });
                        });
                    };

                    const requestUpdate = () => {
                        if (!raf) raf = requestAnimationFrame(update);
                    };

                    /* ---------- navigation ---------- */

                    const release = () => viewport.classList.remove("is-animating");

                    const killTween = () => {
                        if (tween) {
                            tween.kill();
                            tween = null;
                            release();
                        }
                    };

                    const goTo = (i) => {
                        const idx = clamp(0, n - 1, i);
                        targetIdx = idx;
                        const left = idx * m.step;
                        if (!motion) {
                            viewport.scrollTo({ left });
                            return;
                        }
                        killTween();
                        viewport.classList.add("is-animating"); // snap off while we tween
                        tween = gsap.to(viewport, {
                            scrollLeft: left,
                            duration: 0.9,
                            ease: "power3.inOut",
                            onComplete: () => {
                                tween = null;
                                release();
                            },
                        });
                    };

                    api.current.go = (dir) => goTo(targetIdx + dir);

                    /* ---------- mouse drag with a little momentum ---------- */

                    let dragging = false;
                    let startX = 0;
                    let startLeft = 0;
                    let lastX = 0;
                    let lastT = 0;
                    let vel = 0;

                    const onDown = (e) => {
                        if (e.pointerType !== "mouse" || e.button !== 0) return;
                        killTween();
                        dragging = true;
                        startX = lastX = e.clientX;
                        startLeft = viewport.scrollLeft;
                        lastT = performance.now();
                        vel = 0;
                        viewport.classList.add("is-dragging");
                        try {
                            viewport.setPointerCapture(e.pointerId);
                        } catch (_) { }
                    };
                    const onMove = (e) => {
                        if (!dragging) return;
                        viewport.scrollLeft = startLeft - (e.clientX - startX);
                        const now = performance.now();
                        const dt = Math.max(now - lastT, 1);
                        vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / dt);
                        lastX = e.clientX;
                        lastT = now;
                    };
                    const onUp = () => {
                        if (!dragging) return;
                        dragging = false;
                        viewport.classList.remove("is-dragging");
                        goTo(Math.round((viewport.scrollLeft - vel * 250) / m.step));
                    };

                    viewport.addEventListener("pointerdown", onDown);
                    viewport.addEventListener("pointermove", onMove);
                    viewport.addEventListener("pointerup", onUp);
                    viewport.addEventListener("pointercancel", onUp);
                    // a touch or wheel gesture takes over from any running tween
                    viewport.addEventListener("touchstart", killTween, { passive: true });
                    viewport.addEventListener("wheel", killTween, { passive: true });
                    viewport.addEventListener("scroll", requestUpdate, { passive: true });

                    const ro = new ResizeObserver(() => {
                        measure();
                        requestUpdate();
                    });
                    ro.observe(viewport);

                    /* ---------- initial state + section entrance ---------- */

                    measure();
                    gsap.set(barEl, { scaleX: 1 / n });

                    if (motion) {
                        gsap.set(frames, { clipPath: "inset(0% 0% 100% 0%)" });
                        gsap.set(imgs, { scale: 1.5 });

                        // text: category wipes in, name rises char by char, Marathi line fades up
                        textKids.forEach(([cat, nameEl, mar], i) => {
                            nameSplits[i] = new SplitText(nameEl, {
                                type: "words,chars",
                                wordsClass: "dish-word",
                            });
                            gsap.set(cat, { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 });
                            gsap.set(nameSplits[i].chars, { yPercent: 115 });
                            gsap.set(mar, { y: 24, opacity: 0 });
                        });
                        gsap.set(barKids, { y: 18, opacity: 0 });

                        ScrollTrigger.create({
                            trigger: showcase,
                            start: "top 78%",
                            once: true,
                            onEnter: () => {
                                entered = true;
                                gsap.to(barKids, {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.8,
                                    ease: "power3.out",
                                    stagger: 0.06,
                                });
                                visible.forEach(reveal);
                            },
                        });
                    }

                    update();

                    return () => {
                        if (raf) cancelAnimationFrame(raf);
                        killTween();
                        nameSplits.forEach((sp) => sp && sp.revert());
                        ro.disconnect();
                        viewport.removeEventListener("pointerdown", onDown);
                        viewport.removeEventListener("pointermove", onMove);
                        viewport.removeEventListener("pointerup", onUp);
                        viewport.removeEventListener("pointercancel", onUp);
                        viewport.removeEventListener("touchstart", killTween);
                        viewport.removeEventListener("wheel", killTween);
                        viewport.removeEventListener("scroll", requestUpdate);
                        viewport.classList.remove("is-dragging", "is-animating");
                        api.current.go = () => { };
                    };
                }
            );

            return () => mm.revert();
        },
        { scope: root }
    );

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            api.current.go(1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            api.current.go(-1);
        }
    };

    return (
        <section
            ref={root}
            id="signature-dishes"
            className="signature-dishes bg-noir-red text-noir-black"
            aria-label="Signature dishes"
        >
            <DishTitle count={total} />

            <div ref={showcaseRef} className="dish-showcase">
                <div
                    ref={viewportRef}
                    className="dish-viewport"
                    tabIndex={0}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Signature dishes, swipe or use the left and right arrow keys"
                    onKeyDown={onKeyDown}
                >
                    <div className="dish-track">
                        {dishes.map((dish, i) => (
                            <DishCard
                                key={dish.id}
                                dish={dish}
                                index={i}
                                total={total}
                                priority={i === 0}
                            />
                        ))}
                    </div>
                </div>

                <div className="dish-bar">
                    <div className="dish-counter font-anton" aria-live="polite">
                        <span className="dish-counter-mask">
                            <span ref={counterRef} className="dish-counter-current">
                                01
                            </span>
                        </span>
                        <span className="dish-counter-total">/ {pad(total)}</span>
                    </div>

                    <div className="dish-progress" aria-hidden="true">
                        <span ref={barRef} />
                    </div>

                    <div className="dish-nav font-anton">
                        <button ref={prevRef} type="button" className="dish-btn" onClick={() => api.current.go(-1)}>
                            Prev
                        </button>
                        <button ref={nextRef} type="button" className="dish-btn" onClick={() => api.current.go(1)}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}