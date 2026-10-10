import { useState } from "react";
import { Link } from "react-router-dom";
import altoLogo from "@/assets/alto-logo.png";
import altoLogoTight from "@/assets/alto-logo-tight.png";
import MobileMenuButton from "@/components/MobileMenuButton";

// Portal-local copy of the marketing header: same branding, but marketing
// links go to the public site and Client Login is a plain /login link.
const SITE = "https://www.altowhisky.com";

const links = [
  { href: `${SITE}/`, label: "Home" },
  { href: `${SITE}/news`, label: "News & Insights" },
  { href: `${SITE}/why-whisky`, label: "Why Whisky" },
  { href: `${SITE}/about-whisky`, label: "About Whisky" },
  { href: `${SITE}/how-it-works`, label: "How It Works" },
  { href: `${SITE}/contact`, label: "Contact" },
];

const linkCls =
  "px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap text-secondary-foreground/80 hover:text-secondary-foreground transition-all duration-300";

const PortalHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-secondary text-secondary-foreground border-b border-secondary-foreground/10 md:h-auto md:border-none md:bg-transparent md:py-6">
      <div className="max-w-6xl xl:max-w-7xl mx-auto pl-2 pr-4 md:px-4 lg:px-6 flex items-center justify-between h-full md:h-auto">
        <a href={`${SITE}/`} className="block ml-2 md:ml-0">
          <img src={altoLogoTight} alt="Alto Whisky" className="block md:hidden w-[3.25rem] h-auto" />
          <img src={altoLogo} alt="Alto Whisky" className="hidden md:block h-9 lg:h-12 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-0 lg:gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={linkCls}>{l.label}</a>
          ))}
          <Link to="/login" className={linkCls}>Client Login</Link>
        </nav>

        <MobileMenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} ariaLabel="Toggle menu" className="md:hidden" />
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="bg-secondary/95 backdrop-blur-md px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground">{l.label}</a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} className="font-body text-xs uppercase tracking-[0.2em] text-primary">Client Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default PortalHeader;
