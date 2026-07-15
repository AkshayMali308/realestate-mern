import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, BedDouble, Bath, Ruler, ShieldCheck, Heart, Compass, Building,
  Calendar, Sofa, Phone, Mail, User as UserIcon, CheckCircle2,
} from "lucide-react";
import api from "../api/axios.js";
import ImageGallery from "../components/ImageGallery.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const formatPrice = (price, unit) => {
  const inCr = price >= 10000000;
  const inLakh = price >= 100000;
  let display;
  if (inCr) display = `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  else if (inLakh) display = `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  else display = `₹${price.toLocaleString("en-IN")}`;
  return unit === "per-month" ? `${display}/month` : display;
};

const specRow = (icon, label, value) => (
  value ? (
    <div className="flex items-center gap-3 py-3 border-b border-line last:border-0">
      <span className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center shrink-0 text-ink/70">{icon}</span>
      <div>
        <p className="text-[11px] text-muted">{label}</p>
        <p className="text-sm font-semibold text-ink capitalize">{value}</p>
      </div>
    </div>
  ) : null
);

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "Hi, I am interested in this property. Please share more details." });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get(`/properties/${id}`).then((res) => {
      setProperty(res.data.property);
      api.get(`/properties/${res.data.property._id}/similar`).then((r) => setSimilar(r.data.properties));
    }).finally(() => setLoading(false));
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) { setError("Please log in to contact the owner."); return; }
    try {
      await api.post("/inquiries", { propertyId: property._id, ...form });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <div className="container-page py-16 text-center text-muted">Loading property…</div>;
  if (!property) return <div className="container-page py-16 text-center text-muted">Property not found.</div>;

  return (
    <div className="container-page py-8">
      <div className="text-xs text-muted mb-4 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-accent">Home</Link> /
        <Link to={`/listings?city=${property.address.city}`} className="hover:text-accent">{property.address.city}</Link> /
        <span className="text-ink">{property.address.locality}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <ImageGallery images={property.images} title={property.title} />

          <div className="mt-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="pill bg-ink text-white capitalize font-semibold">{property.listingType === "sale" ? "For Sale" : "For Rent"}</span>
                {property.isVerified && <span className="pill bg-accent-50 text-accent-700"><ShieldCheck size={12} /> Verified</span>}
                {property.isFeatured && <span className="pill bg-gold-50 text-gold-600">Featured</span>}
              </div>
              <h1 className="font-display font-700 text-2xl">{property.title}</h1>
              <p className="text-sm text-muted mt-1.5 flex items-center gap-1"><MapPin size={14} /> {property.address.locality}, {property.address.city}, {property.address.state} {property.address.pincode}</p>
            </div>
            <p className="font-display font-mono font-800 text-3xl text-ink shrink-0">{formatPrice(property.price, property.priceUnit)}</p>
          </div>

          <div className="mt-6 card p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4">
            {specRow(<BedDouble size={17} />, "Bedrooms", property.bedrooms > 0 ? `${property.bedrooms} BHK` : null)}
            {specRow(<Bath size={17} />, "Bathrooms", property.bathrooms || null)}
            {specRow(<Ruler size={17} />, "Carpet Area", `${property.area} sq.ft`)}
            {specRow(<Sofa size={17} />, "Furnishing", property.furnishing?.replace("-", " "))}
            {specRow(<Building size={17} />, "Floor", property.floor)}
            {specRow(<Calendar size={17} />, "Age", property.ageOfProperty)}
            {specRow(<Compass size={17} />, "Facing", property.facing)}
          </div>

          <div className="mt-6">
            <h2 className="font-display font-700 text-lg mb-2.5">About this property</h2>
            <p className="text-sm text-ink/80 leading-relaxed">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display font-700 text-lg mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckCircle2 size={15} className="text-accent shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: owner + contact form */}
        <aside className="space-y-4 h-fit lg:sticky lg:top-20">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-display font-700">
                {property.owner?.name?.[0]?.toUpperCase() || <UserIcon size={18} />}
              </span>
              <div>
                <p className="font-semibold text-sm">{property.owner?.name}</p>
                <p className="text-xs text-muted capitalize">{property.owner?.company || property.ownerType}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-700 text-sm mb-3">Contact {property.ownerType === "owner" ? "Owner" : "Agent"}</h3>
            {sent ? (
              <p className="text-sm text-accent-700 bg-accent-50 rounded-lg p-3">Your message has been sent. They'll reach out to you shortly.</p>
            ) : (
              <form onSubmit={submitInquiry} className="space-y-2.5">
                <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
                <textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button type="submit" className="btn-primary w-full"><Phone size={15} /> Send Inquiry</button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display font-700 text-xl mb-5">Similar properties nearby</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {similar.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
