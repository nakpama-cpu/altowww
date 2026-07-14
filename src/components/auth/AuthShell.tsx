import { ReactNode } from "react";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import heroImg from "@/assets/scotland-landscape.jpg";

interface AuthShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerSlot?: ReactNode;
}

/**
 * Branded shell for portal auth pages (signup, login, password reset).
 * Wraps the form in a cinematic dark-blue backdrop, cream card, and the
 * full marketing header + footer so the flow matches the rest of the site.
 */
const AuthShell = ({ eyebrow, title, subtitle, children, footerSlot }: AuthShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showCTAs={false} />

      <main className="relative flex-1 flex items-center justify-center overflow-hidden section-dark">
        {/* Cinematic backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-secondary/85 via-secondary/70 to-secondary/95"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-md px-4 py-24 md:py-32">
          <div className="bg-card border border-border shadow-2xl p-8 md:p-12">
            {eyebrow && (
              <p className="font-body text-[11px] uppercase tracking-[0.3em] text-primary mb-4 text-center">
                {eyebrow}
              </p>
            )}
            <h1 className="display-heading text-3xl md:text-4xl text-center mb-4 text-foreground">
              {title}
            </h1>
            <div className="mx-auto mb-6 h-px w-16 bg-primary" aria-hidden="true" />
            {subtitle && (
              <p className="font-body text-sm text-muted-foreground text-center mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
            {children}
          </div>
          {footerSlot && <div className="mt-6 text-center">{footerSlot}</div>}
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default AuthShell;
