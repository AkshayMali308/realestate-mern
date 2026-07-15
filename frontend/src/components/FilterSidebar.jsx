import { SlidersHorizontal, X } from "lucide-react";

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "independent-house", label: "Independent House" },
  { value: "plot", label: "Plot" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
];

const FilterSidebar = ({ filters, setFilters, onApply, onClear }) => {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const toggleType = (val) => {
    const current = filters.propertyType ? filters.propertyType.split(",") : [];
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    update("propertyType", next.join(","));
  };

  return (
    <aside className="card p-5 h-fit sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-700 text-sm flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </h3>
        <button onClick={onClear} className="text-xs text-accent font-semibold hover:underline">Clear all</button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-ink/70 mb-2 block">Budget (₹)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice || ""} onChange={(e) => update("minPrice", e.target.value)} className="input" />
            <input type="number" placeholder="Max" value={filters.maxPrice || ""} onChange={(e) => update("maxPrice", e.target.value)} className="input" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/70 mb-2 block">Property Type</label>
          <div className="flex flex-wrap gap-1.5">
            {propertyTypes.map((pt) => {
              const active = (filters.propertyType || "").split(",").includes(pt.value);
              return (
                <button
                  key={pt.value}
                  onClick={() => toggleType(pt.value)}
                  className={`pill border ${active ? "bg-ink text-white border-ink" : "border-line text-ink/70 hover:border-ink"}`}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/70 mb-2 block">Bedrooms</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => update("bedrooms", filters.bedrooms === String(n) ? "" : String(n))}
                className={`w-10 h-9 rounded-lg text-sm font-semibold border ${
                  filters.bedrooms === String(n) ? "bg-ink text-white border-ink" : "border-line text-ink/70 hover:border-ink"
                }`}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/70 mb-2 block">Furnishing</label>
          <select value={filters.furnishing || ""} onChange={(e) => update("furnishing", e.target.value)} className="input">
            <option value="">Any</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-furnished</option>
            <option value="furnished">Furnished</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink/70 mb-2 block">Area (sq.ft)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minArea || ""} onChange={(e) => update("minArea", e.target.value)} className="input" />
            <input type="number" placeholder="Max" value={filters.maxArea || ""} onChange={(e) => update("maxArea", e.target.value)} className="input" />
          </div>
        </div>

        <button onClick={onApply} className="btn-primary w-full">Apply Filters</button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
