import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard.jsx";
import { GridSkeleton } from "../components/Skeletons.jsx";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/favorites").then((res) => setFavorites(res.data.favorites)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleFavorite = async (propertyId) => {
    await api.post(`/favorites/${propertyId}`);
    setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
  };

  return (
    <div className="container-page py-8">
      <h1 className="font-display font-700 text-2xl mb-1">Saved Properties</h1>
      <p className="text-sm text-muted mb-6">Properties you've bookmarked for later</p>

      {loading ? (
        <GridSkeleton n={3} />
      ) : favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={28} className="mx-auto text-muted mb-3" />
          <p className="font-display font-700">No saved properties yet</p>
          <p className="text-sm text-muted mt-1.5">Tap the heart icon on any listing to save it here.</p>
          <Link to="/listings" className="btn-primary mt-4 mx-auto w-fit">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {favorites.map((p) => (
            <PropertyCard key={p._id} property={p} favorited onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
