import { Link } from "react-router-dom";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const FooterSection = ({ hideCta = false }: { hideCta?: boolean }) => {
  return (
    <footer className="section-dark">
      {/* Final CTA — single consolidated one for entire page */}
      {!hideCta && (
        <div className="py-20 px-6 text-center border-b border-secondary-foreground/10">
          <div className="max-w-lg mx-auto">
            <h3 className="display-heading text-2xl md:text-3xl text-secondary-foreground mb-4">
              Ready to invest?
            </h3>
            <p className="font-body text-sm text-secondary-foreground/60 mb-8 leading-relaxed">
              Download our free brochure or speak with one of our expert Portfolio Advisors to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
              <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500">
                Speak to an Advisor
              </ContactButton>
            </div>
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="display-heading text-2xl text-secondary-foreground mb-4">
                Alto Whisky
              </h3>
              <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
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
              <BrochureButton className="inline-block font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors">
                Request Brochure →
              </BrochureButton>
            </div>
          </div>

          {/* Regulatory disclaimer */}
          <div className="pt-8 border-t border-secondary-foreground/10 mb-6">
            <p className="font-body text-[11px] text-secondary-foreground/30 leading-relaxed max-w-3xl">
              Alto Whisky is not regulated by the Financial Conduct Authority (FCA). Whisky cask investment is not a regulated investment product. The value of your investment can go down as well as up, and past performance is not a reliable indicator of future results. All investments carry risk. Please seek independent financial advice before investing.
            </p>
          </div>

          <div className="text-center">
            <p className="font-body text-xs text-secondary-foreground/30">
              © 2026 Alto Whisky. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
