import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { adminRequest, getAdminSession } from "@/lib/admin-auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      try {
        const admin = await getAdminSession();

        if (!ignore && admin) {
          setHasSession(true);
        }
      } finally {
        if (!ignore) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      ignore = true;
    };
  }, []);

  if (hasSession) {
    return <Navigate to="/admin" replace />;
  }

  if (isCheckingSession) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await adminRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload.message || "Admin login failed");
        return;
      }

      navigate("/admin", { replace: true });
    } catch (_error) {
      setErrorMessage("Unable to reach the admin server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Admin Access
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Sign in to BluSapiens</h1>
          <p className="mt-3 text-sm text-slate-400">
            This route is restricted to admin users only. No public signup is available.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-cyan-400"
                placeholder="admin@blusapiens.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-cyan-400"
                placeholder="Enter your admin password"
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Admin Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
