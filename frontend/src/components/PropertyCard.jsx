import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Ruler, ShieldCheck, Heart } from "lucide-react";

const formatPrice = (price, unit) => {
  const inCr = price >= 10000000;
  const inLakh = price >= 100000;
  let display;
  if (inCr) display = `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  else if (inLakh) display = `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  else display = `₹${price.toLocaleString("en-IN")}`;
  return unit === "per-month" ? `${display}/mo` : display;
};

const PropertyCard = ({ property, favorited, onToggleFavorite }) => {
  const { _id, slug, title, price, priceUnit, area, bedrooms, bathrooms, address, images, isVerified, isFeatured, listingType, owner } = property;

  return (
    <div className="card overflow-hidden group flex flex-col h-full">
      <div className="relative">
        <Link to={`/property/${slug || _id}`}>
          <div className="aspect-[4/3] overflow-hidden bg-ink-50">
            <img
              src={images?.[0]}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="pill bg-white/95 text-ink capitalize font-semibold">{listingType === "sale" ? "For Sale" : "For Rent"}</span>
          {isFeatured && <span className="pill bg-gold-50 text-gold-600 font-semibold">Featured</span>}
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(_id); }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center hover:scale-105 transition"
            aria-label="Save property"
          >
            <Heart size={16} className={favorited ? "fill-red-500 text-red-500" : "text-ink/70"} />
          </button>
        )}
      </div>

      <Link to={`/property/${slug || _id}`} className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display font-mono text-[1.15rem] font-700 text-ink leading-tight">
            {formatPrice(price, priceUnit)}
          </p>
          {isVerified && (
            <span className="pill bg-accent-50 text-accent-700 shrink-0">
              <ShieldCheck size={12} /> Verified
            </span>
          )}
        </div>

        <h3 className="mt-1.5 text-sm font-semibold text-ink line-clamp-2 leading-snug">{title}</h3>

        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted">
          <MapPin size={13} /> {address?.locality}, {address?.city}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-ink/70 border-t border-line pt-3">
          {bedrooms > 0 && (
            <span className="flex items-center gap-1"><BedDouble size={14} /> {bedrooms} Bed</span>
          )}
          {bathrooms > 0 && (
            <span className="flex items-center gap-1"><Bath size={14} /> {bathrooms} Bath</span>
          )}
          <span className="flex items-center gap-1"><Ruler size={14} /> {area} sq.ft</span>
        </div>

        {owner?.name && (
          <p className="mt-2.5 text-[11px] text-muted">Listed by <span className="font-medium text-ink/80">{owner.name}</span></p>
        )}
      </Link>
    </div>
  );
};

export default PropertyCard;
