import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import altoLogo from "@/assets/alto-logo.png";
import BrochureButton from "@/components/BrochureButton";
import LoginModal from "@/components/LoginModal";
import HeaderMegaDropdown from "@/components/HeaderMegaDropdown";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News & Insights", isNews: true as const },
  { to: "/why-whisky", label: "Why Whisky" },
  {
    label: "About Whisky",
    children: [
      { to: "/about-whisky", label: "Regions & Distilleries" },
      { to: "/how-whisky-is-made", label: "How Whisky is Made" },
      { to: "/faqs", label: "FAQs" },
    ],
  },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const newsCloseTimer = useRef<number | null>(null);
  const aboutCloseTimer = useRef<number | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();

  const clearTimer = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const openNews = () => {
    clearTimer(newsCloseTimer);
    clearTimer(aboutCloseTimer);
    setAboutOpen(false);
    setNewsOpen(true);
  };
  const scheduleCloseNews = () => {
    clearTimer(newsCloseTimer);
    newsCloseTimer.current = window.setTimeout(() => setNewsOpen(false), 150);
  };
  const openAbout = () => {
    clearTimer(aboutCloseTimer);
    clearTimer(newsCloseTimer);
    setNewsOpen(false);
    setAboutOpen(true);
  };
  const scheduleCloseAbout = () => {
    clearTimer(aboutCloseTimer);
    aboutCloseTimer.current = window.setTimeout(() => setAboutOpen(false), 150);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNewsOpen(false);
    setAboutOpen(false);
  }, [location]);

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
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between">
        <Link to="/">
          <img src={altoLogo} alt="Alto Whisky" className="h-10 md:h-9 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0 lg:gap-1">
          {mainLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                onMouseEnter={openAbout}
                onMouseLeave={scheduleCloseAbout}
              >
                <button
                  type="button"
                  className={`px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-1 ${
                    isAboutActive
                      ? "text-primary"
                      : "text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
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
                  className={`px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 inline-block ${
                    isActive(link.to!)
                      ? "text-primary"
                      : "text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ) : (
              <div
                key={link.to}
                onMouseEnter={openNews}
                onMouseLeave={scheduleCloseNews}
              >
                <Link
                  to={link.to!}
                  className={`px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 inline-block ${
                    isActive(link.to!)
                      ? "text-primary"
                      : "text-secondary-foreground/60 hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            )
          )}

          <button onClick={() => setLoginOpen(true)} className="px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap text-secondary-foreground/60 hover:text-secondary-foreground">Client Login</button>
          <BrochureButton className="hidden xl:inline-flex items-center px-3 py-2 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap" />
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
        <AboutMegaDropdown
          open={aboutOpen}
          onMouseEnter={openAbout}
          onMouseLeave={scheduleCloseAbout}
        />
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
};

export default Header;
