import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import altoLogo from "@/assets/alto-logo.png";
import BrochureButton from "@/components/BrochureButton";
import LoginModal from "@/components/LoginModal";
import NewsMegaDropdown from "@/components/NewsMegaDropdown";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News & Insights", isNews: true as const },
  { to: "/how-it-works", label: "How It Works" },
  {
    label: "About Whisky",
    children: [
      { to: "/about-whisky", label: "Regions & Distilleries" },
      { to: "/how-whisky-is-made", label: "How Whisky is Made" },
      { to: "/faqs", label: "FAQs" },
    ],
  },
  { to: "/why-whisky", label: "Why Whisky" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const newsCloseTimer = useRef<number | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const openNews = () => {
    if (newsCloseTimer.current) {
      window.clearTimeout(newsCloseTimer.current);
      newsCloseTimer.current = null;
    }
    setNewsOpen(true);
  };
  const scheduleCloseNews = () => {
    if (newsCloseTimer.current) window.clearTimeout(newsCloseTimer.current);
    newsCloseTimer.current = window.setTimeout(() => setNewsOpen(false), 150);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setNewsOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isAboutActive = mainLinks
    .find((l) => l.label === "About Whisky")
    ?.children?.some((c) => location.pathname === c.to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-secondary/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-6 flex items-center justify-between">
        <Link to="/">
          <img src={altoLogo} alt="Alto Whisky" className="h-10 md:h-9 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0 lg:gap-1 xl:gap-2">
          {mainLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-4 py-2 font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1 ${
                    isAboutActive
                      ? "text-primary"
                      : "text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`absolute top-full left-0 mt-4 bg-secondary/95 backdrop-blur-md min-w-[220px] py-3 transition-all duration-300 ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={`block px-6 py-2.5 font-body text-xs uppercase tracking-[0.15em] transition-colors ${
                        isActive(child.to)
                          ? "text-primary"
                          : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : "isNews" in link && link.isNews ? (
              <div
                key={link.to}
                onMouseEnter={openNews}
                onMouseLeave={scheduleCloseNews}
              >
                <Link
                  to={link.to!}
                  onFocus={openNews}
                  onBlur={scheduleCloseNews}
                  className={`px-4 py-2 font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 inline-block ${
                    isActive(link.to!) || newsOpen
                      ? "text-primary"
                      : "text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to!}
                className={`px-4 py-2 font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive(link.to!)
                    ? "text-primary"
                    : "text-secondary-foreground/60 hover:text-secondary-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <button onClick={() => setLoginOpen(true)} className="px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/60 hover:text-secondary-foreground">Client Login</button>
          <BrochureButton className="px-4 py-2 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:opacity-90 transition-opacity" />
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
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-secondary/95 backdrop-blur-md px-6 py-6 flex flex-col gap-4">
          {mainLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 mb-2">
                  {link.label}
                </p>
                {link.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className={`block font-body text-sm uppercase tracking-[0.15em] py-2 pl-4 transition-colors ${
                      isActive(child.to)
                        ? "text-primary"
                        : "text-secondary-foreground/60"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to!}
                className={`font-body text-sm uppercase tracking-[0.15em] py-2 transition-colors ${
                  isActive(link.to!)
                    ? "text-primary"
                    : "text-secondary-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <button
            onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
            className="font-body text-sm uppercase tracking-[0.15em] py-2 text-left text-secondary-foreground/60"
          >
            Client Login
          </button>
          <BrochureButton className="font-body text-sm uppercase tracking-[0.15em] bg-primary text-primary-foreground px-5 py-3 text-center mt-2 hover:opacity-90 transition-opacity w-full" />
        </nav>
      </div>
      <div className="hidden md:block">
        <NewsMegaDropdown
          open={newsOpen}
          onMouseEnter={openNews}
          onMouseLeave={scheduleCloseNews}
        />
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
};

export default Header;
