
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
        scrollLeft: 0,
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const goToSlide = (index) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const nextIndex = Math.max(
            0,
            Math.min(index, dishes.length - 1)
        );

        slider.scrollTo({
            left: nextIndex * slider.clientWidth,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider || !slider.clientWidth) return;

        const index = Math.round(
            slider.scrollLeft / slider.clientWidth
        );

        const nextIndex = Math.max(
            0,
            Math.min(index, dishes.length - 1)
        );

        setActiveIndex((current) =>
            current === nextIndex ? current : nextIndex
        );
    };

    const handleMouseDown = (event) => {
        if (event.button !== 0) return;

        const slider = sliderRef.current;
        if (!slider) return;

        dragRef.current = {
            isDragging: true,
            startX: event.clientX,
            scrollLeft: slider.scrollLeft,
        };

        setIsDragging(true);
    };

    const handleMouseMove = (event) => {
        if (!dragRef.current.isDragging) return;

        event.preventDefault();

        const slider = sliderRef.current;
        if (!slider) return;

        slider.scrollLeft =
            dragRef.current.scrollLeft -
            (event.clientX - dragRef.current.startX);
    };

    const stopDragging = () => {
        if (!dragRef.current.isDragging) return;

        dragRef.current.isDragging = false;
        setIsDragging(false);

        const slider = sliderRef.current;
        if (!slider) return;

        const index = Math.round(
            slider.scrollLeft / slider.clientWidth
        );

        goToSlide(index);
    };

    // Animate each dish when it becomes active.
    useGSAP(
        () => {
            const slider = sliderRef.current;
            const activeSlide = slider?.children[activeIndex];

            if (!activeSlide) return;

            const image = activeSlide.querySelector(".dish-image");

            if (!image) return;

            gsap.fromTo(
                image,
                {
                    scale: 1.13,
                    rotation: 1.5,
                    y: 22,
                    filter: "saturate(0.75)",
                },
                {
                    scale: 1,
                    rotation: 0,
                    y: 0,
                    filter: "saturate(1)",
                    duration: 1.1,
                    ease: "power3.out",
                    overwrite: "auto",
                }
            );

            gsap.fromTo(
                activeSlide.querySelector(".dish-card"),
                {
                    clipPath: "inset(5% 3% 5% 3%)",
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.85,
                    ease: "power3.inOut",
                    overwrite: "auto",
                }
            );
        },
        {
            scope: sectionRef,
            dependencies: [activeIndex],
            revertOnUpdate: true,
        }
    );

    // Reveal the slider controls when the section enters view.
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
                className="relative h-screen min-h-[520px] w-full overflow-hidden bg-noir-red text-noir-black"
            >
                {/* Horizontal slider */}
                <div
                    ref={sliderRef}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                    onDragStart={(event) => event.preventDefault()}
                    className={`flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                        isDragging
                            ? "cursor-grabbing snap-none"
                            : "cursor-grab"
                    }`}
                    style={{ touchAction: "pan-x pan-y" }}
                >
                    {dishes.map((dish, index) => (
                        <div
                            key={dish.id}
                            className="h-full w-full flex-none snap-start snap-always"
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
