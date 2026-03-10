import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="section-dark py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="display-heading text-2xl text-secondary-foreground mb-4">
              Alto Whisky
            </h3>
            <p className="font-body text-sm text-secondary-foreground/50 leading-relaxed">
              Whisky cask investment is now widely considered one of the most
              secure assets available. Alto Whisky brings this opportunity to
              discerning investors from all walks of life.
            </p>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 mb-4">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Home</Link>
              <Link to="/how-it-works" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">How It Works</Link>
              <Link to="/why-whisky" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Why Whisky</Link>
              <Link to="/contact" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 mb-4">
              About Whisky
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/about-whisky" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Regions & Distilleries</Link>
              <Link to="/how-whisky-is-made" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">How Whisky is Made</Link>
              <Link to="/faqs" className="font-body text-sm text-secondary-foreground/60 hover:text-primary transition-colors">FAQs</Link>
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 mb-4">
              Get Started
            </p>
            <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed mb-4">
              Ready to explore whisky cask investment? Request your free brochure
              or speak to a Portfolio Advisor.
            </p>
            <Link
              to="/request-brochure"
              className="inline-block font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              Request Brochure →
            </Link>
          </div>
        </div>
        <div className="pt-8 border-t border-secondary-foreground/10 text-center">
          <p className="font-body text-xs text-secondary-foreground/30">
            © 2026 Alto Whisky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
