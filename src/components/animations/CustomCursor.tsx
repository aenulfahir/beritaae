"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export function CustomCursor() {
    const isTouch = useIsTouchDevice();
    const [isHovering, setIsHovering] = useState(false);
    const [isPointer, setIsPointer] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (isTouch) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") !== null ||
                target.closest("button") !== null ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsPointer(Boolean(isClickable));
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY, isTouch]);

    // Don't render on touch devices
    if (isTouch) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                    animate={{
                        width: isPointer ? 48 : 12,
                        height: isPointer ? 48 : 12,
                        opacity: isHovering ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            {/* Trailing ring */}
            <motion.div
                className="fixed top-0 left-0 z-[9998] pointer-events-none"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50"
                    animate={{
                        width: isPointer ? 64 : 32,
                        height: isPointer ? 64 : 32,
                        opacity: isHovering ? 0.5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Global style to hide default cursor on desktop */}
            <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
        </>
    );
}
