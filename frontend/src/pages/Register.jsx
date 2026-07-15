import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="container-page py-14 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <span className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center"><Home size={20} className="text-white" /></span>
        </div>
        <h1 className="font-display font-700 text-2xl text-center">Create your account</h1>
        <p className="text-sm text-muted text-center mt-1.5">It's free — list or search properties in minutes.</p>

        <form onSubmit={submit} className="card p-6 mt-6 space-y-3">
          <input required placeholder="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
          <input required placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" />
          <input required type="password" minLength={6} placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => update("password", e.target.value)} className="input" />

          <div>
            <label className="text-xs font-semibold text-ink/70 mb-1.5 block">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {["buyer", "owner", "agent"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => update("role", r)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize border ${form.role === r ? "bg-ink text-white border-ink" : "border-line text-ink/70"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Creating account…" : "Sign up"}</button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account? <Link to="/login" className="text-accent font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
