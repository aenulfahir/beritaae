"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: ScrollRevealProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    const initial = {
        opacity: 0,
        ...directions[direction],
    };

    return (
        <motion.div
            className={className}
            initial={initial}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            {children}
        </motion.div>
    );
}

// Staggered children animation
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className = "",
    staggerDelay = 0.1,
}: StaggerContainerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.21, 0.47, 0.32, 0.98],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
