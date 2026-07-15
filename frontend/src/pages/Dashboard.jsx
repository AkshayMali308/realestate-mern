import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Eye, MessageSquare, Trash2, Pencil } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const formatPrice = (price, unit) => {
  const inCr = price >= 10000000;
  const inLakh = price >= 100000;
  let display;
  if (inCr) display = `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  else if (inLakh) display = `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  else display = `₹${price.toLocaleString("en-IN")}`;
  return unit === "per-month" ? `${display}/mo` : display;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("listings");

  useEffect(() => {
    Promise.all([api.get("/properties/mine/all"), api.get("/inquiries/received")])
      .then(([l, i]) => { setListings(l.data.properties); setInquiries(i.data.inquiries); })
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!confirm("Remove this listing?")) return;
    await api.delete(`/properties/${id}`);
    setListings((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-700 text-2xl">Welcome, {user?.name?.split(" ")[0]}</h1>
          <p className="text-sm text-muted mt-1">Manage your listings and inquiries</p>
        </div>
        <Link to="/post-property" className="btn-primary"><PlusCircle size={16} /> Post New Property</Link>
      </div>

      <div className="flex gap-1 border-b border-line mb-6">
        {[["listings", `My Listings (${listings.length})`], ["inquiries", `Inquiries (${inquiries.length})`]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${tab === id ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : tab === "listings" ? (
        listings.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="font-display font-700">No listings yet</p>
            <p className="text-sm text-muted mt-1.5">Post your first property to reach buyers and tenants.</p>
            <Link to="/post-property" className="btn-primary mt-4 mx-auto w-fit">Post a Property</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((p) => (
              <div key={p._id} className="card p-4 flex items-center gap-4 flex-wrap">
                <img src={p.images?.[0]} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-[180px]">
                  <Link to={`/property/${p.slug}`} className="font-semibold text-sm hover:text-accent line-clamp-1">{p.title}</Link>
                  <p className="text-xs text-muted mt-1">{p.address.locality}, {p.address.city}</p>
                </div>
                <p className="font-display font-mono font-700 text-sm">{formatPrice(p.price, p.priceUnit)}</p>
                <span className={`pill capitalize ${p.status === "active" ? "bg-accent-50 text-accent-700" : "bg-ink-50 text-muted"}`}>{p.status}</span>
                <span className="flex items-center gap-1 text-xs text-muted"><Eye size={13} /> {p.views}</span>
                <button onClick={() => remove(p._id)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )
      ) : inquiries.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display font-700">No inquiries yet</p>
          <p className="text-sm text-muted mt-1.5">Inquiries from interested buyers will show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((i) => (
            <div key={i._id} className="card p-4 flex items-start gap-4 flex-wrap">
              <span className="w-9 h-9 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center shrink-0 mt-0.5"><MessageSquare size={15} /></span>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold">{i.name} <span className="text-muted font-normal">· {i.phone}</span></p>
                <p className="text-xs text-muted mt-0.5">On: {i.property?.title}</p>
                <p className="text-sm mt-1.5 text-ink/80">{i.message}</p>
              </div>
              <span className="text-xs text-muted shrink-0">{new Date(i.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
