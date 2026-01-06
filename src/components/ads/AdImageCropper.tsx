"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import {
  AdSlotType,
  AD_SLOT_DIMENSIONS,
  AD_SLOT_CONFIGS,
  SlotDimension,
} from "@/types/ads";

interface AdImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  slotType: AdSlotType;
  onCropComplete: (croppedBlob: Blob, fileSize: number) => void;
}

interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  fileSize: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function compressAndResizeImage(
  image: HTMLImageElement,
  crop: PixelCrop,
  targetWidth: number,
  targetHeight: number,
  maxFileSize: number = 500 * 1024 // 500KB
): Promise<CompressionResult> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate scale between natural size and displayed size
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set canvas to exact target dimensions
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw the cropped image resized to target dimensions
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Try compression with decreasing quality until under maxFileSize
  let quality = 0.85;
  let blob: Blob | null = null;

  while (quality >= 0.3) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
    });

    if (blob && blob.size <= maxFileSize) {
      break;
    }
    quality -= 0.1;
  }

  if (!blob) {
    throw new Error("Failed to compress image");
  }

  return {
    blob,
    width: targetWidth,
    height: targetHeight,
    fileSize: blob.size,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function AdImageCropper({
  open,
  onClose,
  imageSrc,
  slotType,
  onCropComplete,
}: AdImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceSize, setSourceSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Get available dimensions for current slot type
  const availableDimensions = AD_SLOT_DIMENSIONS[slotType];
  const [selectedDimension, setSelectedDimension] = useState<SlotDimension>(
    availableDimensions[0]
  );
  const slotConfig = AD_SLOT_CONFIGS[slotType];

  // Update selected dimension when slot type changes
  useEffect(() => {
    const dims = AD_SLOT_DIMENSIONS[slotType];
    setSelectedDimension(dims[0]);
    setError(null);
  }, [slotType]);

  // Update crop when dimension changes
  useEffect(() => {
    if (imgRef.current && sourceSize) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, selectedDimension.aspectRatio));

      // Validate source size
      if (
        sourceSize.width < selectedDimension.width ||
        sourceSize.height < selectedDimension.height
      ) {
        setError(
          `Gambar terlalu kecil. Minimal ${selectedDimension.width}x${selectedDimension.height} pixel untuk ukuran ini.`
        );
      } else {
        setError(null);
      }
    }
  }, [selectedDimension, sourceSize]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
      setSourceSize({ width: naturalWidth, height: naturalHeight });
      setCrop(centerAspectCrop(width, height, selectedDimension.aspectRatio));

      // Validate source size
      if (
        naturalWidth < selectedDimension.width ||
        naturalHeight < selectedDimension.height
      ) {
        setError(
          `Gambar terlalu kecil. Minimal ${selectedDimension.width}x${selectedDimension.height} pixel untuk ukuran ini.`
        );
      } else {
        setError(null);
      }
    },
    [selectedDimension]
  );

  const handleDimensionChange = (value: string) => {
    const dim = availableDimensions.find((d) => d.label === value);
    if (dim) {
      setSelectedDimension(dim);
    }
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current || error) return;

    setIsProcessing(true);

    try {
      const result = await compressAndResizeImage(
        imgRef.current,
        completedCrop,
        selectedDimension.width,
        selectedDimension.height
      );

      onCropComplete(result.blob, result.fileSize);
      onClose();
    } catch (err) {
      console.error("Error cropping image:", err);
      setError("Gagal memproses gambar. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, selectedDimension.aspectRatio));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Crop Gambar Iklan - {slotConfig?.label}
          </DialogTitle>
          <DialogDescription>
            Sesuaikan area crop untuk slot {slotConfig?.label}. Gambar akan
            di-resize ke ukuran optimal.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Dimension Info & Selector */}
          <div className="flex items-center justify-between w-full p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Target: </span>
                <span className="font-semibold text-primary">
                  {selectedDimension.width} x {selectedDimension.height} px
                </span>
              </div>
              {sourceSize && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Sumber: </span>
                  <span className="font-medium">
                    {sourceSize.width} x {sourceSize.height} px
                  </span>
                </div>
              )}
            </div>

            {/* Size selector for slots with multiple options */}
            {availableDimensions.length > 1 && (
              <Select
                value={selectedDimension.label}
                onValueChange={handleDimensionChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih ukuran" />
                </SelectTrigger>
                <SelectContent>
                  {availableDimensions.map((dim) => (
                    <SelectItem key={dim.label} value={dim.label}>
                      {dim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg w-full">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Crop Area */}
          <div className="max-h-[50vh] overflow-auto border rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={selectedDimension.aspectRatio}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full max-h-[45vh] object-contain"
              />
            </ReactCrop>
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            Gambar akan dikompresi ke format JPEG dengan kualitas optimal (maks
            500KB)
          </p>
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
            disabled={isProcessing || !completedCrop || !!error}
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
