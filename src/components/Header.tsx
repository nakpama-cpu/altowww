import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import altoLogo from "@/assets/alto-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about-whisky", label: "About Whisky" },
  { to: "/why-whisky", label: "Why Whisky" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-secondary/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/">
          <img
            src={altoLogo}
            alt="Alto Whisky"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-secondary-foreground/60 hover:text-secondary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.altowhisky.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 transition-opacity"
          >
            Get Brochure
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-secondary-foreground transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-secondary-foreground transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-secondary-foreground transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-secondary/95 backdrop-blur-md px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm uppercase tracking-[0.15em] py-2 transition-colors ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-secondary-foreground/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.altowhisky.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm uppercase tracking-[0.15em] bg-primary text-primary-foreground px-5 py-3 text-center mt-2 hover:opacity-90 transition-opacity"
          >
            Get Brochure
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
