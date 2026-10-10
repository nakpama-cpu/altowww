// Portal-local copy of the marketing footer (compact, no brochure/CTA).
const SITE = "https://www.altowhisky.com";
const a = "font-body text-sm text-secondary-foreground hover:text-primary transition-colors";

const PortalFooter = () => (
  <footer className="section-dark">
    <div className="px-6 pt-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-3">
          <div>
            <h3 className="display-heading text-2xl text-secondary-foreground mb-4">Alto Whisky</h3>
            <p className="font-body text-sm text-secondary-foreground leading-relaxed">
              Whisky cask investment is now widely considered one of the most
              secure assets available. Alto Whisky brings this opportunity to
              discerning investors from all walks of life.
            </p>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground mb-4">Navigate</p>
            <div className="flex flex-col gap-3">
              <a href={`${SITE}/`} className={a}>Home</a>
              <a href={`${SITE}/news`} className={a}>News & Insights</a>
              <a href={`${SITE}/why-whisky`} className={a}>Why Whisky</a>
              <a href={`${SITE}/how-it-works`} className={a}>How It Works</a>
              <a href={`${SITE}/contact`} className={a}>Contact</a>
            </div>
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground mb-4">About Whisky</p>
            <div className="flex flex-col gap-3">
              <a href={`${SITE}/about-whisky`} className={a}>Regions & Distilleries</a>
              <a href={`${SITE}/how-whisky-is-made`} className={a}>How Whisky is Made</a>
              <a href={`${SITE}/faqs`} className={a}>FAQs</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary-foreground/10 mb-6">
          <p className="font-body text-[11px] text-secondary-foreground leading-relaxed max-w-3xl">
            Alto Whisky is not regulated by the Financial Conduct Authority (FCA). Whisky cask investment is not a regulated investment product. The value of your investment can go down as well as up, and past performance is not a reliable indicator of future results. All investments carry risk. Please seek independent financial advice before investing.
          </p>
        </div>

        <p className="font-body text-xs text-secondary-foreground text-center sm:text-left">
          © 2026 Alto Whisky. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default PortalFooter;
