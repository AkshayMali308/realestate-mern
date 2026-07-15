import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, Heart, PlusCircle, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
            <Home size={17} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display font-800 text-lg tracking-tight text-ink hidden sm:block">
            Ghar<span className="text-accent">360</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link to="/listings?listingType=sale" className="px-3 py-2 rounded-lg text-ink/80 hover:bg-ink-50 hover:text-ink">Buy</Link>
          <Link to="/listings?listingType=rent" className="px-3 py-2 rounded-lg text-ink/80 hover:bg-ink-50 hover:text-ink">Rent</Link>
          <Link to="/post-property" className="px-3 py-2 rounded-lg text-ink/80 hover:bg-ink-50 hover:text-ink">Sell / List</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-line hover:bg-ink-50"
              >
                <span className="w-7 h-7 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center text-xs font-bold font-display">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-xl shadow-cardHover py-1.5 text-sm">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-ink-50">
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-ink-50">
                    <Heart size={16} /> Saved Properties
                  </Link>
                  <Link to="/post-property" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3.5 py-2.5 hover:bg-ink-50">
                    <PlusCircle size={16} /> Post a Property
                  </Link>
                  <div className="h-px bg-line my-1.5" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3.5 py-2.5 hover:bg-ink-50 text-left text-red-600">
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up free</Link>
            </div>
          )}
          <button className="md:hidden p-2 rounded-lg hover:bg-ink-50" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line px-4 py-3 flex flex-col gap-1 text-sm font-medium">
          <Link to="/listings?listingType=sale" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-ink-50">Buy</Link>
          <Link to="/listings?listingType=rent" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-ink-50">Rent</Link>
          <Link to="/post-property" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-ink-50">Sell / List</Link>
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
