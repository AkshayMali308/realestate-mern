import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

const cities = ["Mumbai", "Pune", "Bengaluru", "Delhi", "Hyderabad"];

const SearchBar = ({ compact }) => {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [listingType, setListingType] = useState("sale");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);
    params.set("listingType", listingType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full bg-white rounded-2xl border border-line shadow-cardHover p-2 flex flex-col sm:flex-row gap-2 ${compact ? "max-w-2xl" : "max-w-3xl"}`}
    >
      <div className="flex bg-ink-50 rounded-xl p-1 shrink-0">
        {["sale", "rent"].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setListingType(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              listingType === t ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {t === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-1 px-3">
        <MapPin size={17} className="text-muted shrink-0" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-sm bg-transparent outline-none text-ink font-medium py-2 shrink-0"
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="h-5 w-px bg-line hidden sm:block" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search locality, project or landmark"
          className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
        />
      </div>

      <button type="submit" className="btn-primary shrink-0 px-6">
        <Search size={16} /> Search
      </button>
    </form>
  );
};

export default SearchBar;
