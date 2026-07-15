import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import Pagination from "../components/Pagination.jsx";
import { GridSkeleton } from "../components/Skeletons.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(Object.fromEntries(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { user } = useAuth();

  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "";

  const fetchProperties = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams);
    api
      .get("/properties", { params })
      .then((res) => {
        setProperties(res.data.properties);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  useEffect(() => {
    if (user) {
      api.get("/favorites").then((res) => setFavoriteIds(res.data.favorites.map((f) => f._id)));
    }
  }, [user]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    params.set("page", "1");
    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("listingType")) params.set("listingType", searchParams.get("listingType"));
    if (searchParams.get("city")) params.set("city", searchParams.get("city"));
    setFilters({});
    setSearchParams(params);
  };

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setSort = (s) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", s);
    setSearchParams(params);
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) return;
    const res = await api.post(`/favorites/${propertyId}`);
    setFavoriteIds((prev) => (res.data.favorited ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)));
  };

  const city = searchParams.get("city");
  const listingType = searchParams.get("listingType");

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display font-700 text-2xl">
          {listingType === "rent" ? "Properties for Rent" : "Properties for Sale"} {city ? `in ${city}` : "across India"}
        </h1>
        <p className="text-sm text-muted mt-1">{loading ? "Searching…" : `${total.toLocaleString("en-IN")} properties found`}</p>
      </div>

      <div className="flex items-center justify-between mb-5 gap-3">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="btn-outline lg:hidden"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted hidden sm:block">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !py-2 !w-auto">
            <option value="">Relevance</option>
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="area-desc">Area: Largest first</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters} />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex justify-end">
            <div className="w-[85%] max-w-sm bg-canvas h-full overflow-y-auto p-4">
              <div className="flex justify-end mb-2">
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2"><X size={20} /></button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters} />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <GridSkeleton n={9} />
          ) : properties.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="font-display font-700 text-lg">No properties match these filters</p>
              <p className="text-sm text-muted mt-1.5">Try widening your budget or clearing a few filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-5 mx-auto">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((p) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    favorited={favoriteIds.includes(p._id)}
                    onToggleFavorite={user ? toggleFavorite : undefined}
                  />
                ))}
              </div>
              <Pagination page={page} pages={pages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
