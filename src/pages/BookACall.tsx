import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Check, X } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import altoLogo from "@/assets/alto-logo.png";
import warehouseCasks from "@/assets/warehouse-casks.jpg";
import { GHL_PUBLIC_CALENDAR_URL } from "@/config/booking";

const GHL_EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";
const GHL_IFRAME_ID = "XszmpWdESN9t1YBKvA1L_1790728633099";

const discussionPoints = [
  "Your investment goals and timeframe",
  "Current cask opportunities and portfolio options",
  "Ownership, storage and the steps involved",
];

const BookACall = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!calendarOpen || !GHL_PUBLIC_CALENDAR_URL) return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GHL_EMBED_SCRIPT_SRC}"]`,
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src = GHL_EMBED_SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  }, [calendarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title="Book a Call | Alto Whisky"
        description="Book a call with Alto Whisky to discuss your investment goals, ask questions and explore current whisky cask opportunities."
        path="/book-a-call"
      />

      <header className="absolute inset-x-0 top-0 z-30 border-b border-secondary-foreground/15">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-24 md:px-10 lg:px-12">
          <Link to="/" aria-label="Alto Whisky home" className="inline-flex">
            <img src={altoLogo} alt="Alto Whisky" className="h-11 w-auto md:h-14" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative min-h-[680px] overflow-hidden bg-secondary text-secondary-foreground md:min-h-[720px]">
          <img
            src={warehouseCasks}
            alt="Whisky casks maturing in a bonded warehouse"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-secondary/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/45" />

          <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-14 pt-32 md:min-h-[720px] md:px-10 md:pb-20 md:pt-40 lg:px-12">
            <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:gap-20">
              <div className="max-w-3xl">
                <p className="font-body text-xs uppercase tracking-[0.25em] text-primary">
                  Private consultation · Chapter 07
                </p>
                <h1 className="display-heading mt-6 max-w-3xl text-5xl leading-[0.98] text-secondary-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                  Your next step in whisky cask investment
                </h1>
                <p className="mt-7 max-w-2xl font-body text-sm leading-7 text-secondary-foreground/80 md:text-base md:leading-8">
                  Thank you for exploring our investment guide. Book a call with Alto Whisky to discuss your goals, ask questions and explore the cask opportunities available to you.
                </p>
              </div>

              <div className="border-l border-primary pl-6 md:pl-8 lg:mb-2">
                <p className="font-body text-[11px] uppercase tracking-[0.2em] text-secondary-foreground/60">
                  Begin the conversation
                </p>
                <h2 className="display-heading mt-3 text-3xl text-secondary-foreground md:text-4xl">
                  Book your call
                </h2>
                <p className="mt-3 font-body text-sm leading-6 text-secondary-foreground/70">
                  Choose a date and time that suits you.
                </p>
                <Button
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  className="mt-7 h-12 rounded-none px-7 font-body text-xs uppercase tracking-[0.2em]"
                >
                  View available times
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-6 py-12 md:px-10 md:py-16 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-border py-10 md:grid-cols-[0.65fr_1.35fr] md:gap-12">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-primary">Discussion guide</p>
              <h2 className="display-heading mt-3 text-3xl md:text-4xl">What we can discuss</h2>
            </div>
            <ul className="grid gap-5 md:grid-cols-3 md:gap-7">
              {discussionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 font-body text-sm leading-6 text-muted-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-primary/60 text-primary" aria-hidden="true">
                    <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-secondary px-6 py-8 text-secondary-foreground md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-4xl font-body text-[11px] leading-relaxed text-secondary-foreground/60">
            Alto Whisky is not regulated by the Financial Conduct Authority (FCA). Whisky cask investment is not a regulated investment product. The value of your investment can go down as well as up, and past performance is not a reliable indicator of future results. All investments carry risk. Please seek independent financial advice before investing.
          </p>
          <p className="mt-5 font-body text-xs text-secondary-foreground/60">
            © 2026 Alto Whisky. All rights reserved.
          </p>
        </div>
      </footer>

      <DialogPrimitive.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-secondary/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
          <DialogPrimitive.Content
            aria-describedby="booking-dialog-description"
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-primary/30 bg-secondary text-secondary-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:animate-none md:w-[calc(100%-3rem)] lg:flex-row"
          >
            <aside className="shrink-0 border-b border-secondary-foreground/10 bg-secondary px-6 py-6 md:px-8 lg:w-[30%] lg:border-b-0 lg:border-r lg:px-9 lg:py-10">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary">Private consultation</p>
              <div className="mt-3 h-px w-10 bg-primary" />
              <DialogPrimitive.Title className="display-heading mt-5 text-3xl leading-tight text-secondary-foreground md:text-4xl">
                Book your call
              </DialogPrimitive.Title>
              <DialogPrimitive.Description id="booking-dialog-description" className="mt-4 font-body text-sm leading-6 text-secondary-foreground/65">
                Choose a date and time that suits you.
              </DialogPrimitive.Description>
              <div className="mt-7 hidden border-t border-secondary-foreground/10 pt-7 lg:block">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-secondary-foreground/45">Alto Whisky</p>
                <p className="mt-3 font-body text-sm leading-6 text-secondary-foreground/65">
                  A focused conversation about your goals, current cask opportunities and the ownership process.
                </p>
              </div>
            </aside>

            <div className="min-h-0 flex-1 overflow-y-auto bg-surface text-surface-foreground">
              {GHL_PUBLIC_CALENDAR_URL ? (
                <div className="relative min-h-[650px]">
                  <p className="pointer-events-none absolute inset-x-0 top-16 px-6 text-center font-body text-sm text-muted-foreground" aria-hidden="true">
                    Loading the booking calendar… If it doesn't appear, use the link below.
                  </p>
                  <iframe
                    src={GHL_PUBLIC_CALENDAR_URL}
                    id={GHL_IFRAME_ID}
                    title="Book a call with Alto Whisky"
                    className="relative block h-[700px] w-full border-0 bg-transparent md:h-[760px]"
                    style={{ width: "100%", border: "none", overflow: "hidden" }}
                    scrolling="no"
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
                <div className="flex min-h-[520px] items-center justify-center px-8 py-16 text-center">
                  <p className="max-w-sm font-display text-2xl text-foreground md:text-3xl">
                    Online booking will be available here shortly.
                  </p>
                </div>
              )}
            </div>

            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Close booking calendar"
                className="absolute right-3 top-3 z-10 rounded-none bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <X aria-hidden="true" />
              </Button>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default BookACall;