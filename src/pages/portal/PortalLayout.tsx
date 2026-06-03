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
      <aside className="w-full md:w-72 md:min-h-screen flex md:flex-col bg-secondary text-secondary-foreground border-b md:border-b-0 md:border-r border-secondary-foreground/10">
        <div className="p-8 border-b border-secondary-foreground/10 flex-shrink-0">
          <Link to="/" className="display-heading text-3xl tracking-wide">Alto Whisky</Link>
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mt-2">Client Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-body text-xs uppercase tracking-[0.2em] transition-all border-l-2 ${
                  isActive
                    ? "border-primary bg-primary/10 text-secondary-foreground"
                    : "border-transparent text-secondary-foreground/60 hover:text-secondary-foreground hover:border-primary/40"
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
                `flex items-center gap-3 px-4 py-3 mt-6 font-body text-xs uppercase tracking-[0.2em] transition-all border-l-2 border-t border-t-secondary-foreground/10 pt-6 ${
                  isActive ? "border-l-primary text-primary" : "border-l-transparent text-secondary-foreground/60 hover:text-primary"
                }`
              }
            >
              <Shield className="w-4 h-4" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="p-6 border-t border-secondary-foreground/10 flex-shrink-0">
          <div className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Signed in</div>
          <div className="font-body text-sm text-secondary-foreground/90 mb-4 truncate">
            {profile?.first_name} {profile?.last_name}
          </div>
          <button onClick={signOut}
            className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60 hover:text-primary transition-colors">
            <LogOut className="w-3 h-3" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
