import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Wine, Store, PhoneCall, UserCog, Shield, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";

const navItems = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/my-casks", label: "My Casks", icon: Wine },
  { to: "/portal/available", label: "Available Stock", icon: Store },
  { to: "/portal/callback", label: "Request Callback", icon: PhoneCall },
  { to: "/portal/account", label: "Account", icon: UserCog },
];

function SidebarContent({ isAdmin, profile, signOut, onNavigate }: { isAdmin: boolean; profile: any; signOut: () => void; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground">
      <div className="p-6 md:p-8 border-b border-secondary-foreground/10 flex-shrink-0">
        <Link to="/" onClick={onNavigate} className="display-heading text-2xl md:text-3xl tracking-wide">Alto Whisky</Link>
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mt-2">Client Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-body text-xs uppercase tracking-[0.2em] transition-all border-l-2 ${
                isActive
                  ? "border-primary bg-primary/10 text-secondary-foreground"
                  : "border-transparent text-secondary-foreground/60 hover:text-secondary-foreground hover:border-primary/40"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink to="/admin" onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mt-6 font-body text-xs uppercase tracking-[0.2em] transition-all border-l-2 border-t border-t-secondary-foreground/10 pt-6 ${
                isActive ? "border-l-primary text-primary" : "border-l-transparent text-secondary-foreground/60 hover:text-primary"
              }`
            }
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
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
    </div>
  );
}

export default function PortalLayout() {
  const { profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen md:flex bg-background">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-secondary text-secondary-foreground border-b border-secondary-foreground/10">
        <Link to="/" className="display-heading text-xl tracking-wide">Alto Whisky</Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="flex items-center justify-center w-10 h-10 -mr-2 text-secondary-foreground hover:text-primary transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 max-w-[85vw] bg-secondary border-secondary-foreground/10">
            <SidebarContent isAdmin={isAdmin} profile={profile} signOut={signOut} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-72 md:h-screen md:sticky md:top-0 border-r border-secondary-foreground/10">
        <SidebarContent isAdmin={isAdmin} profile={profile} signOut={signOut} />
      </aside>

      <main className="flex-1 p-4 md:p-6 lg:p-12 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
