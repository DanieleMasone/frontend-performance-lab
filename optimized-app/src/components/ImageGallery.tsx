import type { GalleryImage } from "../../../benchmark/src/data";

interface ImageGalleryProps {
  images: readonly GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <section className="panel gallery-panel" aria-labelledby="optimized-gallery-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Lazy assets</p>
          <h2 id="optimized-gallery-title">Scenario captures</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {images.map((image) => (
          <figure key={image.id}>
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            <figcaption>{image.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
