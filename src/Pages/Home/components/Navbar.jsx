import { useEffect, useRef, useState } from "react";

const navigationLinks = [
    { number: "01", label: "HOME", href: "#home" },
    { number: "02", label: "THE MENU", href: "#menu" },
    { number: "03", label: "OUR STORY", href: "#story" },
    { number: "04", label: "FIND US", href: "#location" },
];

function ArrowIcon({ className = "" }) {
    return (
        <svg
            className={className}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M7 17L17 7M7 7H17V17"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MenuIcon({ isOpen }) {
    return (
        <span className="relative flex h-5 w-6 flex-col items-center justify-center">
            <span
                className={`absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out ${isOpen ? "rotate-45" : "-translate-y-[5px]"
                    }`}
            />
            <span
                className={`absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out ${isOpen ? "-rotate-45" : "translate-y-[5px]"
                    }`}
            />
        </span>
    );
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const menuButtonRef = useRef(null);
    const closeButtonRef = useRef(null);
    const overlayRef = useRef(null);

    const closeMenu = () => {
        setIsOpen(false);
        setActiveLink(null);
    };

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusTimer = requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = overlayRef.current?.querySelectorAll(
                'a[href], button:not([disabled])'
            );

            if (!focusableElements?.length) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            cancelAnimationFrame(focusTimer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            menuButtonRef.current?.focus({ preventScroll: true });
        }
    }, [isOpen]);

    const handleNavigation = (href) => {
        closeMenu();

        if (href.startsWith("#")) {
            const targetId = href.slice(1);

            requestAnimationFrame(() => {
                document.getElementById(targetId)?.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth",
                });
            });
        }
    };

    return (
        <>
            {/* Main Navbar */}
            <header className="absolute inset-x-0 top-0 z-40 bg-noir-red">
                <nav
                    aria-label="Main navigation"
                    className="mx-auto flex w-full items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-[5vw] lg:py-8"
                >
                    {/* Logo at Left */}
                    <a
                        href="#home"
                        aria-label="Noir Bistro home"
                        className="relative z-10 inline-flex items-center"
                    >
                        <img
                            src="/images/Noir-Bistro-logo.png"
                            alt="Noir Bistro"
                            className="h-16 w-auto object-contain sm:h-20 lg:h-24"
                        />
                    </a>

                    {/* Desktop Horizontal Navigation Links with Bubble Hover Effect */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navigationLinks.map((link) => (
                            <a
                                key={link.number}
                                href={link.href}
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleNavigation(link.href);
                                }}
                                className="relative rounded-full px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-noir-black transition-all duration-300 hover:bg-noir-black hover:text-noir-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-black"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Menu Trigger at Right (Mobile Only) */}
                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={() => setIsOpen((previous) => !previous)}
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isOpen}
                        aria-controls="noir-fullscreen-menu"
                        className="group relative z-10 flex lg:hidden min-h-12 items-center gap-3 rounded-sm px-2 text-noir-black transition-opacity duration-300 hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-black"
                    >
                        <span className="hidden text-xs font-bold tracking-[0.22em] sm:inline">
                            {isOpen ? "CLOSE" : "MENU"}
                        </span>
                        <MenuIcon isOpen={isOpen} />
                    </button>
                </nav>
            </header>

            {/* Full-Screen Menu Overlay (Mobile Only) */}
            <div
                id="noir-fullscreen-menu"
                ref={overlayRef}
                role="dialog"
                aria-modal={isOpen ? "true" : undefined}
                aria-label="Noir Bistro navigation"
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`fixed inset-0 z-50 flex lg:hidden flex-col overflow-y-auto bg-noir-red text-noir-black transition-[clip-path,visibility] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen
                        ? "visible [clip-path:inset(0%_0%_0%_0%)]"
                        : "invisible [clip-path:inset(0%_0%_100%_0%)]"
                    }`}
            >
                {/* Overlay Header */}
                <div className="flex shrink-0 items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
                    <a
                        href="#home"
                        onClick={(event) => {
                            event.preventDefault();
                            handleNavigation("#home");
                        }}
                        aria-label="Noir Bistro home"
                        className="inline-flex items-center"
                    >
                        <img
                            src="/images/Noir-Bistro-logo.png"
                            alt="Noir Bistro"
                            className="h-16 w-auto object-contain sm:h-20"
                        />
                    </a>

                    {/* Close Button at Right */}
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                        tabIndex={isOpen ? 0 : -1}
                        className="flex min-h-12 min-w-12 items-center justify-center transition-transform duration-300 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-noir-black"
                    >
                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M5 5L19 19M19 5L5 19"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="mx-auto flex w-full flex-1 flex-col justify-center px-5 py-8 sm:px-8">
                    <p className="mb-6 text-[10px] font-bold tracking-[0.32em] sm:mb-8 sm:text-xs">
                        EXPLORE NOIR
                    </p>

                    <nav aria-label="Full-screen navigation">
                        {navigationLinks.map((link, index) => (
                            <a
                                key={link.number}
                                href={link.href}
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleNavigation(link.href);
                                }}
                                onMouseEnter={() => setActiveLink(index)}
                                onMouseLeave={() => setActiveLink(null)}
                                onFocus={() => setActiveLink(index)}
                                onBlur={() => setActiveLink(null)}
                                style={{
                                    transitionDelay: isOpen
                                        ? `${index * 75}ms`
                                        : "0ms",
                                }}
                                className={`group flex items-center gap-3 border-b border-noir-black/20 py-3 transition-[opacity,transform] duration-500 ease-out sm:gap-5 sm:py-4 ${isOpen
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-8 opacity-0"
                                    }`}
                            >
                                <span className="w-6 shrink-0 pt-1 text-[10px] font-bold sm:w-8 sm:text-xs">
                                    {link.number}
                                </span>

                                <span
                                    className={`font-anton text-[clamp(2.5rem,7.5vw,4.5rem)] leading-[0.98] tracking-tight transition-transform duration-300 ease-out ${activeLink === index ? "translate-x-2" : ""
                                        }`}
                                >
                                    {link.label}
                                </span>

                                <span className="ml-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                                    <ArrowIcon />
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Overlay Footer */}
                <div className="flex shrink-0 flex-col gap-4 border-t border-noir-black/20 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold tracking-[0.2em] sm:text-xs">
                            CHINESE · CONTINENTAL · CAFE
                        </p>
                        <p className="text-[9px] tracking-[0.15em] opacity-70 sm:text-[10px]">
                            GOOD FOOD. DISTINCTIVE EXPERIENCES.
                        </p>
                    </div>

                    <a
                        href="#instagram"
                        onClick={(event) => {
                            event.preventDefault();
                            closeMenu();
                        }}
                        className="group flex w-fit items-center gap-2 text-xs font-bold tracking-[0.15em]"
                    >
                        INSTAGRAM
                        <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                            <ArrowIcon />
                        </span>
                    </a>
                </div>
            </div>
        </>
    );
}