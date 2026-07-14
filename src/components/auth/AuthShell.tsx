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
    <div className="min-h-dvh flex flex-col bg-background">
      <Header hideBrochure />

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

        <div className="relative z-10 w-full max-w-md px-3 sm:px-4 py-4 md:py-8">
          <div className="bg-card border border-border shadow-2xl p-4 sm:p-6 pb-6 sm:pb-8 text-foreground">
            {eyebrow && (
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-2 text-center">
                {eyebrow}
              </p>
            )}
            <h1 className="display-heading text-xl sm:text-2xl text-center mb-1">
              {title}
            </h1>
            <div className="mx-auto mb-3 h-px w-16 bg-primary" aria-hidden="true" />
            {subtitle && (
              <p className="font-body text-xs text-muted-foreground text-center mb-4 leading-snug">
                {subtitle}
              </p>
            )}
            {children}
            {footerSlot && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                {footerSlot}
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterSection hideBrochure />
    </div>
  );
};

export default AuthShell;
