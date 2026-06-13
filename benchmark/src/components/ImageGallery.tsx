import type { GalleryImage } from "../data";

interface ImageGalleryProps {
  images: readonly GalleryImage[];
  titleId: string;
  eyebrow: string;
  loading: "eager" | "lazy";
  decoding: "sync" | "async";
}

export function ImageGallery({ images, titleId, eyebrow, loading, decoding }: ImageGalleryProps) {
  return (
    <section className="panel gallery-panel" aria-labelledby={titleId}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId}>Scenario captures</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {images.map((image) => (
          <figure key={image.id}>
            <img src={image.src} alt={image.alt} loading={loading} decoding={decoding} />
            <figcaption>{image.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
