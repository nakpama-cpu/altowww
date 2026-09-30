import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/Seo";
import altoLogo from "@/assets/alto-logo.png";
import { GHL_PUBLIC_CALENDAR_URL } from "@/config/booking";

const discussionPoints = [
  "Your investment goals and timeframe",
  "Current cask opportunities and portfolio options",
  "Ownership, storage and the steps involved",
];

const BookACall = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <Seo
        title="Book a Call | Alto Whisky"
        description="Book a call with Alto Whisky to discuss your investment goals, ask questions and explore current whisky cask opportunities."
        path="/book-a-call"
      />

      <header className="border-b border-secondary-foreground/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-24 md:px-10 lg:px-12">
          <Link to="/" aria-label="Alto Whisky home" className="inline-flex">
            <img src={altoLogo} alt="Alto Whisky" className="h-11 w-auto md:h-14" />
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-10 md:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(560px,1.2fr)] lg:items-start lg:gap-16 lg:px-12">
          <section className="max-w-xl lg:pt-8">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-primary">
              Private consultation
            </p>
            <h1 className="display-heading mt-5 text-4xl leading-[1.05] text-secondary-foreground sm:text-5xl lg:text-6xl">
              Your next step in whisky cask investment
            </h1>
            <p className="mt-7 max-w-lg font-body text-sm leading-7 text-secondary-foreground/75 md:text-base md:leading-8">
              Thank you for exploring our investment guide. Book a call with Alto Whisky to discuss your goals, ask questions and explore the cask opportunities available to you.
            </p>

            <div className="mt-10 border-t border-secondary-foreground/15 pt-8 md:mt-12">
              <h2 className="display-heading text-2xl text-secondary-foreground md:text-3xl">
                What we can discuss
              </h2>
              <ul className="mt-6 space-y-5">
                {discussionPoints.map((point) => (
                  <li key={point} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-primary/70 text-primary" aria-hidden="true">
                      <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                    <span className="font-body text-sm leading-6 text-secondary-foreground/80">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="booking-heading" className="bg-surface text-surface-foreground shadow-2xl shadow-foreground/15">
            <div className="border-b border-border px-6 py-6 sm:px-8 md:py-7">
              <h2 id="booking-heading" className="display-heading text-3xl md:text-4xl">
                Book your call
              </h2>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Choose a date and time that suits you.
              </p>
            </div>

            {GHL_PUBLIC_CALENDAR_URL ? (
              <div>
                <iframe
                  src={GHL_PUBLIC_CALENDAR_URL}
                  title="Book a call with Alto Whisky"
                  className="block min-h-[720px] w-full border-0 md:min-h-[780px]"
                  loading="eager"
                  allow="payment"
                />
                <div className="border-t border-border px-6 py-4 text-center">
                  <a
                    href={GHL_PUBLIC_CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs uppercase tracking-[0.15em] text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                  >
                    Open booking calendar
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center px-8 py-16 text-center md:min-h-[560px]">
                <div className="max-w-sm">
                  <div className="mx-auto h-px w-12 bg-primary" />
                  <p className="mt-7 font-display text-2xl text-foreground md:text-3xl">
                    Online booking will be available here shortly.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-secondary-foreground/10 px-6 py-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-4xl font-body text-[11px] leading-relaxed text-secondary-foreground/60">
            Alto Whisky is not regulated by the Financial Conduct Authority (FCA). Whisky cask investment is not a regulated investment product. The value of your investment can go down as well as up, and past performance is not a reliable indicator of future results. All investments carry risk. Please seek independent financial advice before investing.
          </p>
          <p className="mt-5 font-body text-xs text-secondary-foreground/60">
            © 2026 Alto Whisky. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BookACall;