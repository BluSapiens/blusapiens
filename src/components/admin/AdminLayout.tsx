import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { getAdminSession, type AdminSession } from "@/lib/admin-auth";

export default function AdminLayout() {
  const location = useLocation();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      try {
        const session = await getAdminSession();

        if (!ignore) {
          setAdmin(session);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar admin={admin} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
