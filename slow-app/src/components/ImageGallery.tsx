import {
  ImageGallery as SharedImageGallery
} from "../../../benchmark/src/components/ImageGallery";
import type { GalleryImage } from "../../../benchmark/src/data";

interface ImageGalleryProps {
  images: readonly GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <SharedImageGallery
      images={images}
      titleId="slow-gallery-title"
      eyebrow="Eager assets"
      loading="eager"
      decoding="sync"
    />
  );
}
