import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ImageGallery = ({ images = [], title }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return <div className="aspect-video bg-ink-50 rounded-xl2" />;

  return (
    <div>
      <div className="relative rounded-xl2 overflow-hidden aspect-video bg-ink-50 cursor-zoom-in" onClick={() => setLightbox(true)}>
        <img src={images[active]} alt={title} className="w-full h-full object-cover" />
        <button
          onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + images.length) % images.length); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % images.length); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
        <span className="absolute bottom-3 right-3 pill bg-black/60 text-white">{active + 1} / {images.length}</span>
      </div>

      <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${active === i ? "border-accent" : "border-transparent opacity-70"}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 text-white"><X size={28} /></button>
          <img src={images[active]} alt={title} className="max-h-[85vh] max-w-full object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
