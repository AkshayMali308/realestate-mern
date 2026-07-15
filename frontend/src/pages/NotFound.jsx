import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-page py-24 text-center">
    <p className="font-display font-800 text-5xl text-ink/15">404</p>
    <h1 className="font-display font-700 text-xl mt-3">Page not found</h1>
    <p className="text-sm text-muted mt-1.5">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-5 mx-auto w-fit">Back to Home</Link>
  </div>
);

export default NotFound;
