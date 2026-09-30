import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CalendarDays, X } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import altoLogo from "@/assets/alto-logo.png";
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

      <header className="absolute inset-x-0 top-0 z-30 border-b border-foreground/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-24 md:px-10 lg:px-12">
          <Link to="/" aria-label="Alto Whisky home" className="inline-flex">
            <img src={altoLogo} alt="Alto Whisky" className="h-11 w-auto md:h-14" />
          </Link>
        </div>
      </header>

      <main className="px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-44 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left: editorial narrative */}
          <div className="lg:col-span-7">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-primary">
              Private consultation · Chapter 07
            </p>
            <h1 className="display-heading mt-6 text-5xl font-light leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
              Your next step in whisky cask investment
            </h1>
            <p className="mt-7 max-w-xl font-body text-sm font-light leading-7 text-foreground/70 md:text-base md:leading-8">
              Thank you for exploring our investment guide. Book a call with Alto Whisky to discuss your goals, ask questions and explore the cask opportunities available to you.
            </p>

            <div className="mt-12 border-t border-foreground/10 pt-10 md:mt-16">
              <h2 className="font-body text-[11px] uppercase tracking-[0.22em] text-foreground/80">
                What we can discuss
              </h2>
              <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                {discussionPoints.map((point) => (
                  <li key={point}>
                    <div className="mb-4 h-px w-8 bg-primary" aria-hidden="true" />
                    <p className="display-heading text-xl leading-snug text-foreground md:text-2xl">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: booking panel */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
              <div className="rounded-sm bg-gradient-to-b from-primary/25 to-transparent p-1">
                <div className="flex flex-col items-center border border-border bg-surface px-8 py-12 text-center shadow-sm md:px-10 md:py-14">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40">
                    <CalendarDays className="h-6 w-6 text-primary" strokeWidth={1.25} aria-hidden="true" />
                  </div>
                  <h2 className="display-heading text-3xl font-light text-surface-foreground md:text-4xl">
                    Book your call
                  </h2>
                  <p className="mt-4 max-w-xs font-body text-sm leading-6 text-surface-foreground/60">
                    Choose a date and time that suits you.
                  </p>
                <Button
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  className="mt-10 h-14 w-full rounded-none bg-primary px-8 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
                >
                  View available times
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-foreground/10 px-6 py-8 text-foreground md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-4xl font-body text-[11px] leading-relaxed text-foreground/60">
            Alto Whisky is not regulated by the Financial Conduct Authority (FCA). Whisky cask investment is not a regulated investment product. The value of your investment can go down as well as up, and past performance is not a reliable indicator of future results. All investments carry risk. Please seek independent financial advice before investing.
          </p>
          <p className="mt-5 font-body text-xs text-foreground/60">
            © 2026 Alto Whisky. All rights reserved.
          </p>
        </div>
      </footer>

      <DialogPrimitive.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-secondary/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
          <DialogPrimitive.Content
            aria-describedby="booking-dialog-description"
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border bg-surface text-surface-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:animate-none md:w-[calc(100%-3rem)] lg:flex-row"
          >
            <aside className="shrink-0 border-b border-border bg-background px-6 py-6 md:px-8 lg:w-[30%] lg:border-b-0 lg:border-r lg:px-9 lg:py-10">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary">Private consultation</p>
              <div className="mt-3 h-px w-10 bg-primary" />
              <DialogPrimitive.Title className="display-heading mt-5 text-3xl leading-tight text-foreground md:text-4xl">
                Book your call
              </DialogPrimitive.Title>
              <DialogPrimitive.Description id="booking-dialog-description" className="mt-4 font-body text-sm leading-6 text-foreground/65">
                Choose a date and time that suits you.
              </DialogPrimitive.Description>
              <div className="mt-7 hidden border-t border-foreground/10 pt-7 lg:block">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/45">Alto Whisky</p>
                <p className="mt-3 font-body text-sm leading-6 text-foreground/65">
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
                className="absolute right-3 top-3 z-10 rounded-none bg-surface text-surface-foreground hover:bg-primary hover:text-primary-foreground"
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
