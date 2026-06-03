import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Wine, Store, PhoneCall, UserCog, Shield, LogOut } from "lucide-react";

const navItems = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/my-casks", label: "My Casks", icon: Wine },
  { to: "/portal/available", label: "Available Stock", icon: Store },
  { to: "/portal/callback", label: "Request Callback", icon: PhoneCall },
  { to: "/portal/account", label: "Account", icon: UserCog },
];

export default function PortalLayout() {
  const { profile, isAdmin, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link to="/" className="display-heading text-2xl">Alto Whisky</Link>
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Client Portal</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 font-body text-sm transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 mt-4 font-body text-sm transition-colors border-t border-border pt-4 ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Shield className="w-4 h-4" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <div className="font-body text-xs text-muted-foreground mb-3 truncate">
            {profile?.first_name} {profile?.last_name}
          </div>
          <button onClick={signOut}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
