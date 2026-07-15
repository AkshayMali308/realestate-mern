import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const steps = ["Basic Details", "Location", "Pricing & Media"];

const defaultImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
];

const PostProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", listingType: "sale", propertyType: "apartment",
    bedrooms: 2, bathrooms: 2, area: "", furnishing: "unfurnished",
    locality: "", city: "", state: "", pincode: "",
    price: "", amenities: [],
  });

  if (!user) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-muted">Please log in to post a property.</p>
        <button onClick={() => navigate("/login")} className="btn-primary mt-4 mx-auto">Log in</button>
      </div>
    );
  }

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const amenityList = ["Power Backup", "Lift", "Gated Security", "Swimming Pool", "Gymnasium", "Clubhouse", "Reserved Parking", "24x7 Water Supply"];
  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/properties", {
        title: form.title,
        description: form.description,
        listingType: form.listingType,
        propertyType: form.propertyType,
        price: Number(form.price),
        priceUnit: form.listingType === "rent" ? "per-month" : "total",
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        furnishing: form.furnishing,
        amenities: form.amenities,
        images: defaultImages,
        address: { locality: form.locality, city: form.city, state: form.state, pincode: form.pincode },
        ownerType: user.role === "buyer" ? "owner" : user.role,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-2xl mx-auto">
      <h1 className="font-display font-700 text-2xl mb-1">Post your property</h1>
      <p className="text-sm text-muted mb-6">Reach genuine buyers and tenants — free of cost.</p>

      <div className="flex items-center gap-2 mb-7">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= step ? "bg-accent text-white" : "bg-ink-50 text-muted"}`}>
              {i < step ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-ink" : "text-muted"}`}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-line" />}
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => update("listingType", "sale")} className={`py-2.5 rounded-lg text-sm font-semibold border ${form.listingType === "sale" ? "bg-ink text-white border-ink" : "border-line"}`}>For Sale</button>
              <button onClick={() => update("listingType", "rent")} className={`py-2.5 rounded-lg text-sm font-semibold border ${form.listingType === "rent" ? "bg-ink text-white border-ink" : "border-line"}`}>For Rent</button>
            </div>
            <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className="input">
              {["apartment", "villa", "independent-house", "plot", "office", "shop"].map((t) => (
                <option key={t} value={t}>{t.replace("-", " ")}</option>
              ))}
            </select>
            <input required placeholder="Listing title, e.g. 3 BHK Apartment in Powai" value={form.title} onChange={(e) => update("title", e.target.value)} className="input" />
            <textarea required rows={4} placeholder="Describe your property…" value={form.description} onChange={(e) => update("description", e.target.value)} className="input resize-none" />
            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="input" />
              <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="input" />
              <input required type="number" placeholder="Area (sq.ft)" value={form.area} onChange={(e) => update("area", e.target.value)} className="input" />
            </div>
            <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)} className="input">
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="furnished">Furnished</option>
            </select>
          </>
        )}

        {step === 1 && (
          <>
            <input required placeholder="Locality / Area" value={form.locality} onChange={(e) => update("locality", e.target.value)} className="input" />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} className="input" />
              <input required placeholder="State" value={form.state} onChange={(e) => update("state", e.target.value)} className="input" />
            </div>
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className="input" />
            <div>
              <label className="text-xs font-semibold text-ink/70 mb-2 block">Amenities</label>
              <div className="flex flex-wrap gap-1.5">
                {amenityList.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`pill border ${form.amenities.includes(a) ? "bg-ink text-white border-ink" : "border-line text-ink/70"}`}>{a}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-xs font-semibold text-ink/70 mb-1.5 block">{form.listingType === "rent" ? "Monthly Rent (₹)" : "Total Price (₹)"}</label>
              <input required type="number" placeholder="e.g. 8500000" value={form.price} onChange={(e) => update("price", e.target.value)} className="input" />
            </div>
            <p className="text-xs text-muted bg-ink-50 rounded-lg p-3">Sample stock photos will be attached to this demo listing automatically. In production, this step would let you upload your own photos.</p>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </>
        )}

        <div className="flex justify-between pt-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-outline disabled:opacity-40"
          >
            Back
          </button>
          {step < 2 ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn-primary">Continue</button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn-primary">{submitting ? "Publishing…" : "Publish Listing"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostProperty;
