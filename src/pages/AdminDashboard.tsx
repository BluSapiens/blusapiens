import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminRequest, getAdminSession } from "@/lib/admin-auth";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadAdmin = async () => {
      try {
        const sessionAdmin = await getAdminSession();

        if (!sessionAdmin) {
          if (!ignore) {
            navigate("/admin/login", { replace: true });
          }

          return;
        }

        if (!ignore) {
          setAdmin(sessionAdmin);
        }
      } catch (_error) {
        if (!ignore) {
          setErrorMessage("Unable to validate admin session");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadAdmin();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await adminRequest("/api/admin/logout", {
      method: "POST",
    });

    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-50">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Admin Console
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Admin session active</h1>
            <p className="mt-3 text-sm text-slate-400">
              This route is intentionally separate from the public website and is not linked in the main navigation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          {isLoading ? <p className="text-sm text-slate-400">Validating admin session...</p> : null}

          {!isLoading && errorMessage ? (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          ) : null}

          {!isLoading && admin ? (
            <dl className="grid gap-4 text-sm text-slate-300 md:grid-cols-2">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="mt-1 text-base text-white">{admin.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="mt-1 text-base text-white">{admin.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="mt-1 text-base text-white">
                  {admin.isActive ? "Active" : "Inactive"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Role</dt>
                <dd className="mt-1 text-base text-white">Administrator</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
