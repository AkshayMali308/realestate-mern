import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-14 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <span className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center"><Home size={20} className="text-white" /></span>
        </div>
        <h1 className="font-display font-700 text-2xl text-center">Welcome back</h1>
        <p className="text-sm text-muted text-center mt-1.5">Log in to save properties and message owners.</p>

        <form onSubmit={submit} className="card p-6 mt-6 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-ink/70 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-9" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/70 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-9" placeholder="••••••••" />
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Logging in…" : "Log in"}</button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          New to Ghar360? <Link to="/register" className="text-accent font-semibold">Create an account</Link>
        </p>
        <p className="text-center text-xs text-muted mt-4 bg-ink-50 rounded-lg p-3">
          Demo login: <b>buyer@example.com</b> / <b>password123</b> (after running the seed script)
        </p>
      </div>
    </div>
  );
};

export default Login;
