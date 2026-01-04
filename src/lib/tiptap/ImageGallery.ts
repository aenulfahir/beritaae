import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import GalleryComponent from "@/components/editor/GalleryComponent";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        imageGallery: {
            setImageGallery: (options: { images: any[] }) => ReturnType;
        };
    }
}

export const ImageGallery = Node.create({
    name: "imageGallery",

    group: "block",

    atom: true,

    addAttributes() {
        return {
            images: {
                default: [],
            },
            mode: {
                default: "grid",
            },
            columns: {
                default: 2,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="image-gallery"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": "image-gallery" }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(GalleryComponent);
    },

    addCommands() {
        return {
            setImageGallery:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});
