"use client";

import { motion } from "framer-motion";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export function GradientMesh() {
    const isTouch = useIsTouchDevice();

    // Don't render on touch devices for performance
    if (isTouch) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Main gradient mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
                {/* Animated blob 1 */}
                <motion.div
                    className="absolute top-0 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Animated blob 2 */}
                <motion.div
                    className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Animated blob 3 */}
                <motion.div
                    className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-t from-emerald-500/15 to-teal-500/15 rounded-full blur-3xl"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Noise overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
