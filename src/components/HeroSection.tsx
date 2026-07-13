import heroImg from "@/assets/hero-mountain.jpg";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";


const HeroSection = () => {
  return (
    <>
      {/* Fixed hero that stays in place while content scrolls over it */}
      <section
        id="heritage"
        className="fixed inset-x-0 top-0 w-full overflow-hidden z-0 h-[380px]"
      >
        <img
          src={heroImg}
          alt="Dramatic mountain landscape at dawn with misty peaks"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] md:object-center animate-cloud-drift"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 flex flex-col items-center justify-start md:justify-center h-full text-center px-6 pt-20 pb-8 md:pt-0 md:pb-0">
        <p className="chapter-marker mb-3 md:mt-24 text-secondary-foreground/70">
          Whisky Cask Investment
        </p>
        <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground font-bold">
          Alto Whisky
        </h1>
        <p
          className="mt-2 font-body text-sm md:text-base lg:text-xl text-secondary-foreground/90 max-w-2xl tracking-wide leading-relaxed font-light"
        >
          Secure your financial future with the best collectible asset of the decade.
        </p>
        <div
          className="mt-6 flex flex-col sm:flex-row gap-4"
        >
            <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
            <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500">
              Speak to an Advisor
            </ContactButton>
          </div>
        </div>
      </section>
      
      {/* Spacer to push content below the fixed hero */}
      <div className="h-[380px]" />
    </>
  );
};

export default HeroSection;
