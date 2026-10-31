import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dishes from "./data/dishes";
import DishCard from "./components/DishCard";
import DishesTitle from "./components/DishesTitle";
import "./styles/signatureDishes.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SignatureDishes() {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const dragRef = useRef({
        isDragging: false,
        startX: 0,
        currentTranslate: 0,
        prevTranslate: 0,
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Smooth GSAP slide transition helper
    const animateToSlide = (targetIndex) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const clampedIndex = Math.max(0, Math.min(targetIndex, dishes.length - 1));
        const targetX = -clampedIndex * slider.clientWidth;

        dragRef.current.prevTranslate = targetX;
        dragRef.current.currentTranslate = targetX;
        setActiveIndex(clampedIndex);

        gsap.to(slider, {
            x: targetX,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
        });
    };

    const goToSlide = (index) => {
        animateToSlide(index);
    };

    // Drag / Touch handlers using GSAP transform x
    const handleMouseDown = (event) => {
        if (event.button !== 0) return;

        dragRef.current.isDragging = true;
        dragRef.current.startX = event.clientX;
        setIsDragging(true);

        // Stop active tween on manual interaction
        gsap.killTweensOf(sliderRef.current);
    };

    const handleMouseMove = (event) => {
        if (!dragRef.current.isDragging) return;

        event.preventDefault();
        const deltaX = event.clientX - dragRef.current.startX;
        const targetX = dragRef.current.prevTranslate + deltaX;
        dragRef.current.currentTranslate = targetX;

        gsap.set(sliderRef.current, { x: targetX });
    };

    const stopDragging = () => {
        if (!dragRef.current.isDragging) return;

        dragRef.current.isDragging = false;
        setIsDragging(false);

        const slider = sliderRef.current;
        if (!slider) return;

        const moveDistance = dragRef.current.currentTranslate - dragRef.current.prevTranslate;
        const threshold = slider.clientWidth * 0.15; // 15% swipe threshold

        if (Math.abs(moveDistance) > threshold) {
            if (moveDistance < 0) {
                animateToSlide(activeIndex + 1);
            } else {
                animateToSlide(activeIndex - 1);
            }
        } else {
            animateToSlide(activeIndex);
        }
    };

    // Animate active slide elements cleanly without reverting structure
    useGSAP(
        () => {
            const slider = sliderRef.current;
            const activeSlide = slider?.children[activeIndex];
            if (!activeSlide) return;

            const image = activeSlide.querySelector(".dish-image");
            const card = activeSlide.querySelector(".dish-card");

            if (image) {
                gsap.fromTo(
                    image,
                    {
                        scale: 1.15,
                        rotation: 2,
                        y: 15,
                    },
                    {
                        scale: 1,
                        rotation: 0,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        overwrite: "auto",
                    }
                );
            }

            if (card) {
                gsap.fromTo(
                    card,
                    {
                        opacity: 0.85,
                        scale: 0.98,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power2.out",
                        overwrite: "auto",
                    }
                );
            }
        },
        {
            scope: sectionRef,
            dependencies: [activeIndex],
        }
    );

    // Reveal controls on section enter
    useGSAP(
        () => {
            gsap.from(".dish-controls", {
                y: 24,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });
        },
        { scope: sectionRef }
    );

    return (
        <>
            <DishesTitle />

            <section
                ref={sectionRef}
                id="menu"
                aria-label="Noir Bistro signature dishes"
                className="relative h-screen min-h-[520px] w-full overflow-hidden bg-noir-red text-noir-black select-none"
            >
                {/* Horizontal slider track */}
                <div
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                    onDragStart={(event) => event.preventDefault()}
                    className={`flex h-full w-full ${isDragging ? "cursor-grabbing" : "cursor-grab"
                        }`}
                    style={{ touchAction: "pan-y" }}
                >
                    {dishes.map((dish, index) => (
                        <div
                            key={dish.id}
                            className="h-full w-full flex-none"
                        >
                            <DishCard
                                dish={dish}
                                isActive={activeIndex === index}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom navigation */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 sm:p-8 md:p-10">
                    <div className="dish-controls pointer-events-auto flex items-center gap-3 font-anton">
                        <span
                            aria-live="polite"
                            aria-atomic="true"
                            className="min-w-8 text-2xl sm:text-3xl"
                        >
                            {String(activeIndex + 1).padStart(2, "0")}
                        </span>

                        <div className="h-px w-8 bg-noir-black/50 sm:w-12" />

                        <span className="text-sm opacity-60 sm:text-base">
                            {String(dishes.length).padStart(2, "0")}
                        </span>
                    </div>

                    <div className="dish-controls pointer-events-auto flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => goToSlide(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            aria-label="Previous dish"
                            className="flex h-11 w-11 items-center justify-center border border-noir-black/40 text-xl transition-all duration-300 hover:bg-noir-black hover:text-noir-red disabled:cursor-not-allowed disabled:opacity-30 sm:h-14 sm:w-14"
                        >
                            &#8592;
                        </button>

                        <button
                            type="button"
                            onClick={() => goToSlide(activeIndex + 1)}
                            disabled={activeIndex === dishes.length - 1}
                            aria-label="Next dish"
                            className="flex h-11 w-11 items-center justify-center border border-noir-black/40 text-xl transition-all duration-300 hover:bg-noir-black hover:text-noir-red disabled:cursor-not-allowed disabled:opacity-30 sm:h-14 sm:w-14"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>

                {/* Animated progress line */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-noir-black/15">
                    <div
                        className="h-full bg-noir-black transition-[width] duration-500 ease-out"
                        style={{
                            width: `${((activeIndex + 1) / dishes.length) * 100}%`,
                        }}
                    />
                </div>
            </section>
        </>
    );
}