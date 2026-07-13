import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import altoLogo from "@/assets/alto-logo.png";
import altoLogoTight from "@/assets/alto-logo-tight.png";
import BrochureButton from "@/components/BrochureButton";
import LoginModal from "@/components/LoginModal";
import HeaderMegaDropdown from "@/components/HeaderMegaDropdown";
import MobileMenuButton from "@/components/MobileMenuButton";
import { useAuth } from "@/contexts/AuthContext";
import { PORTAL_LAST_VISIT_KEY, PORTAL_REAUTH_WINDOW_MS } from "@/lib/portalSession";

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  // After navigation, suppress dropdown from opening until the cursor
  // actually leaves the header area and re-enters it. This prevents the
  // mega-menu from covering the hero on the newly loaded page when the
  // mouse happens to still be over the nav item that was clicked.
  const suppressOpenRef = useRef(true);
  const headerRef = useRef<HTMLElement | null>(null);

  const handleClientLogin = async () => {
    if (user) {
      try {
        const raw = localStorage.getItem(PORTAL_LAST_VISIT_KEY);
        const ts = raw ? Number(raw) : 0;
        if (ts && Date.now() - ts < PORTAL_REAUTH_WINDOW_MS) {
          navigate("/portal");
          return;
        }
      } catch {
        /* fall through to sign-out */
      }
      try { localStorage.removeItem(PORTAL_LAST_VISIT_KEY); } catch { /* ignore */ }
      await signOut();
    }
    setLoginOpen(true);
  };

  const clearTimer = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const openNews = () => {
    if (suppressOpenRef.current) return;
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
    if (suppressOpenRef.current) return;
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
    const onScrollClearSuppress = () => { suppressOpenRef.current = false; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollClearSuppress, { passive: true, once: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollClearSuppress);
    };
  }, [location]);

  useEffect(() => {
    setMenuOpen(false);
    setNewsOpen(false);
    setAboutOpen(false);
    // Re-arm suppression on every navigation. Cleared when cursor leaves header.
    suppressOpenRef.current = true;
  }, [location]);

  const isActive = (path: string) => location.pathname === path;
  const isAboutActive = mainLinks
    .find((l) => l.label === "About Whisky")
    ?.children?.some((c) => location.pathname === c.to);

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => { suppressOpenRef.current = false; }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-14 bg-secondary text-secondary-foreground border-b border-secondary-foreground/10 md:h-auto md:border-none md:text-secondary-foreground ${
        scrolled
          ? "md:bg-secondary/95 md:backdrop-blur-md md:shadow-lg md:py-3"
          : "md:bg-transparent md:py-6"
      }`}
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto pl-2 pr-4 md:px-4 lg:px-6 flex items-center justify-between h-full md:h-auto">
        <Link to="/" className="block ml-2 md:ml-0">
          <img src={altoLogoTight} alt="Alto Whisky" className="block md:hidden w-[3.25rem] h-auto" />
          <img src={altoLogo} alt="Alto Whisky" className="hidden md:block h-9 lg:h-12 w-auto" />
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
                      : "text-secondary-foreground hover:text-secondary-foreground"
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
                      : "text-secondary-foreground hover:text-secondary-foreground"
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
                      : "text-secondary-foreground hover:text-secondary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            )
          )}

          <button onClick={handleClientLogin} className="px-2 py-2 lg:px-3 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase whitespace-nowrap text-secondary-foreground hover:text-secondary-foreground">Client Login</button>
          <BrochureButton className="hidden xl:inline-flex items-center px-3 py-2 font-body text-[10px] tracking-[0.15em] lg:text-xs lg:tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap" />
        </nav>

        {/* Mobile hamburger */}
        <MobileMenuButton
          open={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          ariaLabel="Toggle menu"
          className="md:hidden"
        />
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
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground mb-2">
                  {link.label}
                </p>
                {link.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className={`block font-body text-sm uppercase tracking-[0.15em] py-2 pl-4 transition-colors ${
                      isActive(child.to)
                        ? "text-primary"
                        : "text-secondary-foreground"
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
                    : "text-secondary-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <button
            onClick={() => { setMenuOpen(false); handleClientLogin(); }}
            className="font-body text-sm uppercase tracking-[0.15em] py-2 text-left text-secondary-foreground"
          >
            Client Login
          </button>
          <BrochureButton className="font-body text-sm uppercase tracking-[0.15em] bg-primary text-primary-foreground px-5 py-3 text-center mt-2 hover:opacity-90 transition-opacity w-full" />
        </nav>
      </div>
      <div className="hidden md:block">
        <HeaderMegaDropdown
          active={newsOpen ? "news" : aboutOpen ? "about" : null}
          onMouseEnter={() => {
            if (aboutOpen) openAbout();
            else openNews();
          }}
          onMouseLeave={() => {
            if (aboutOpen) scheduleCloseAbout();
            else scheduleCloseNews();
          }}
        />
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
};

export default Header;
