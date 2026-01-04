import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import {
    LayoutGrid,
    Images as ImagesIcon,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Settings2,
    Columns
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GalleryImage {
    src: string;
    alt?: string;
    id: string;
}

export default function GalleryComponent(props: any) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const images: GalleryImage[] = props.node.attrs.images || [];
    const mode: "grid" | "carousel" = props.node.attrs.mode || "grid";
    const columns: number = props.node.attrs.columns || 2;

    const updateAttributes = (attrs: any) => {
        props.updateAttributes(attrs);
    };

    const removeImage = (id: string) => {
        const newImages = images.filter((img) => img.id !== id);
        if (newImages.length === 0) {
            props.deleteNode();
        } else {
            updateAttributes({ images: newImages });
            if (currentSlide >= newImages.length) {
                setCurrentSlide(Math.max(0, newImages.length - 1));
            }
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <NodeViewWrapper className="gallery-component my-4 relative group">
            {/* Controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-sm">
                <Button
                    variant={mode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateAttributes({ mode: "grid" })}
                    title="Grid View"
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                    variant={mode === "carousel" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateAttributes({ mode: "carousel" })}
                    title="Carousel View"
                >
                    <ImagesIcon className="h-4 w-4" />
                </Button>

                {mode === "grid" && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Columns">
                                <Columns className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateAttributes({ columns: 2 })}>
                                2 Columns
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateAttributes({ columns: 3 })}>
                                3 Columns
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateAttributes({ columns: 4 })}>
                                4 Columns
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-red-500"
                    onClick={props.deleteNode}
                    title="Delete Gallery"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className={cn(
                "bg-secondary/10 rounded-xl overflow-hidden border",
                mode === "grid" ? "p-4" : "p-0"
            )}>
                {mode === "grid" ? (
                    <div
                        className="grid gap-4"
                        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                    >
                        {images.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group/item">
                                <Image
                                    src={img.src}
                                    alt={img.alt || ""}
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    onClick={() => removeImage(img.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative aspect-video bg-black/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentSlide]?.src}
                                    alt={images[currentSlide]?.alt || ""}
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Carousel Navigation */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                                    onClick={prevSlide}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                                    onClick={nextSlide}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                idx === currentSlide ? "bg-primary w-4" : "bg-primary/30 hover:bg-primary/50"
                                            )}
                                            onClick={() => setCurrentSlide(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
