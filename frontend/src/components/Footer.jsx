import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Footer = () => (
  <footer className="mt-20 border-t border-line bg-white">
    <div className="container-page py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
      <div className="col-span-2 sm:col-span-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
            <Home size={14} className="text-white" />
          </span>
          <span className="font-display font-800 text-ink">Ghar<span className="text-accent">360</span></span>
        </div>
        <p className="text-xs text-muted leading-relaxed">India's marketplace for verified homes, plots and commercial spaces.</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Explore</h4>
        <ul className="space-y-2 text-sm text-ink/70">
          <li><Link to="/listings?listingType=sale" className="hover:text-accent">Properties for Sale</Link></li>
          <li><Link to="/listings?listingType=rent" className="hover:text-accent">Properties for Rent</Link></li>
          <li><Link to="/post-property" className="hover:text-accent">Post a Property</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-ink/70">
          <li><span className="hover:text-accent cursor-default">About Us</span></li>
          <li><span className="hover:text-accent cursor-default">Careers</span></li>
          <li><span className="hover:text-accent cursor-default">Contact</span></li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Legal</h4>
        <ul className="space-y-2 text-sm text-ink/70">
          <li><span className="hover:text-accent cursor-default">Terms of Use</span></li>
          <li><span className="hover:text-accent cursor-default">Privacy Policy</span></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-line py-4 text-center text-xs text-muted">
      © {new Date().getFullYear()} Ghar360. Built for demonstration purposes.
    </div>
  </footer>
);

export default Footer;
