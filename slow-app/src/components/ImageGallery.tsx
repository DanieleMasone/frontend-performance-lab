import type { GalleryImage } from "../../../benchmark/src/data";

interface ImageGalleryProps {
  images: readonly GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <section className="panel gallery-panel" aria-labelledby="slow-gallery-title">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Eager assets</p>
          <h2 id="slow-gallery-title">Scenario captures</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {images.map((image) => (
          <figure key={image.id}>
            <img src={image.src} alt={image.alt} loading="eager" decoding="sync" />
            <figcaption>{image.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
