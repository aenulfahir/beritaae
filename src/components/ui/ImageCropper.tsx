"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Check, X, RotateCcw, Square, RectangleHorizontal, Maximize } from "lucide-react";

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number;
  title?: string;
  showAspectSelector?: boolean;
}

type AspectOption = {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
};

const ASPECT_OPTIONS: AspectOption[] = [
  { label: "16:9", value: 16 / 9, icon: <RectangleHorizontal className="h-4 w-4" /> },
  { label: "4:3", value: 4 / 3, icon: <RectangleHorizontal className="h-4 w-4" /> },
  { label: "1:1", value: 1, icon: <Square className="h-4 w-4" /> },
  { label: "Bebas", value: undefined, icon: <Maximize className="h-4 w-4" /> },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropper({
  open,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio: initialAspectRatio = 16 / 9,
  title = "Crop Gambar",
  showAspectSelector = true,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(initialAspectRatio);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      if (aspectRatio) {
        setCrop(centerAspectCrop(width, height, aspectRatio));
      } else {
        setCrop({ unit: "%", width: 90, height: 90, x: 5, y: 5 });
      }
    },
    [aspectRatio]
  );

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspectRatio(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (newAspect) {
        setCrop(centerAspectCrop(width, height, newAspect));
      } else {
        setCrop({ unit: "%", width: 90, height: 90, x: 5, y: 5 });
      }
    }
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Calculate scale between natural size and displayed size
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas size to crop size (scaled to natural size)
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      // Limit max size to 1920x1080
      const maxWidth = 1920;
      const maxHeight = 1080;
      let finalWidth = cropWidth;
      let finalHeight = cropHeight;

      if (cropWidth > maxWidth || cropHeight > maxHeight) {
        const ratio = Math.min(maxWidth / cropWidth, maxHeight / cropHeight);
        finalWidth = cropWidth * ratio;
        finalHeight = cropHeight * ratio;
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the cropped image
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        cropWidth,
        cropHeight,
        0,
        0,
        finalWidth,
        finalHeight
      );

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
            onClose();
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Gagal memproses gambar");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (aspectRatio) {
        setCrop(centerAspectCrop(width, height, aspectRatio));
      } else {
        setCrop({ unit: "%", width: 90, height: 90, x: 5, y: 5 });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Aspect Ratio Selector */}
          {showAspectSelector && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground mr-2">Rasio:</span>
              {ASPECT_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant={aspectRatio === option.value ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => handleAspectChange(option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Sesuaikan area crop untuk gambar artikel
          </p>

          <div className="max-h-[55vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full max-h-[50vh] object-contain"
              />
            </ReactCrop>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            <X className="h-4 w-4 mr-2" />
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleCrop}
            disabled={isProcessing || !completedCrop}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

