import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, Users, Building2, ArrowRight } from "lucide-react";
import api from "../api/axios.js";
import SearchBar from "../components/SearchBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { GridSkeleton } from "../components/Skeletons.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const cities = [
  { name: "Mumbai", count: "12,400+" },
  { name: "Pune", count: "8,120+" },
  { name: "Bengaluru", count: "15,760+" },
  { name: "Delhi", count: "9,340+" },
  { name: "Hyderabad", count: "7,210+" },
];

const stats = [
  { icon: Building2, label: "Active listings", value: "58,000+" },
  { icon: Users, label: "Verified owners & agents", value: "6,300+" },
  { icon: ShieldCheck, label: "RERA-checked projects", value: "1,900+" },
  { icon: TrendingUp, label: "Cities covered", value: "27" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/properties", { params: { sort: "newest", limit: 6 } })
      .then((res) => setFeatured(res.data.properties))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="container-page relative py-16 sm:py-24 flex flex-col items-center text-center">
          <span className="pill bg-white/10 text-white mb-5 border border-white/15">
            <ShieldCheck size={13} /> 100% verified listings, zero brokerage on select homes
          </span>
          <h1 className="font-display font-800 text-3xl sm:text-5xl text-white leading-[1.1] max-w-2xl">
            Find a home that actually fits your life
          </h1>
          <p className="mt-4 text-white/60 max-w-lg text-sm sm:text-base">
            Search verified apartments, houses, plots and offices to buy or rent — with real photos, honest pricing, and direct owner contact.
          </p>
          <div className="mt-8 w-full flex justify-center">
            <SearchBar />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            {cities.map((c) => (
              <Link
                key={c.name}
                to={`/listings?city=${c.name}`}
                className="pill bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
              >
                {c.name} <span className="text-white/40">· {c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-line bg-white">
        <div className="container-page py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
                <s.icon size={18} />
              </span>
              <div>
                <p className="font-display font-700 text-lg leading-none">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-700 text-2xl">Freshly listed</h2>
            <p className="text-sm text-muted mt-1">Recently added properties across top cities</p>
          </div>
          <Link to="/listings" className="text-sm font-semibold text-accent flex items-center gap-1 hover:gap-2 transition-all shrink-0">
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton n={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container-page pb-16">
        <div className="rounded-2xl bg-accent-50 border border-accent/20 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-700 text-xl text-ink">Have a property to sell or rent out?</h3>
            <p className="text-sm text-muted mt-1.5">List it in minutes and reach thousands of genuine buyers and tenants — completely free.</p>
          </div>
          <Link to={user ? "/post-property" : "/register"} className="btn-primary shrink-0 px-6 py-3">
            Post your property <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
