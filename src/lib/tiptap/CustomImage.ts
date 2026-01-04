import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "100%",
                renderHTML: (attributes) => {
                    return {
                        width: attributes.width,
                        style: `width: ${attributes.width}`,
                    };
                },
            },
            height: {
                default: null,
            },
        };
    },
});
