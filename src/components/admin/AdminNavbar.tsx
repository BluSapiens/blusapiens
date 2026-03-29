import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin, type AdminSession } from "@/lib/admin-auth";

const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "New Post", href: "/admin/blog/new" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Settings", href: "/admin/settings" },
];

const AdminNavbar = ({ admin }: { admin: AdminSession }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutAdmin();
    } finally {
      setMobileOpen(false);
      navigate("/admin/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <nav className="container-wide flex h-16 items-center justify-between px-6 md:px-8 lg:px-12">
        <Link to="/admin" className="flex items-center gap-3" aria-label="BluSapiens admin home">
          <img
            src="/logo.png"
            alt="BluSapiens logo"
            width={128}
            height={128}
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold text-foreground">
              <span className="text-accent">Blu</span>Sapiens
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Admin
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/admin"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 hover:text-accent ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-border bg-secondary px-4 py-2 text-right">
            <p className="text-xs font-semibold text-foreground">{admin.name}</p>
            <p className="text-[11px] text-muted-foreground">{admin.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:shadow-md hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-4">
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-sm font-semibold text-foreground">{admin.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{admin.email}</p>
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default AdminNavbar;
