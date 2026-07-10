import heroImg from "@/assets/hero-mountain.jpg";
import altoLogo from "@/assets/alto-logo.png";
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
        <div className="relative z-10 flex flex-col items-center justify-start md:justify-center h-full text-center px-6 pt-16 pb-8 md:pt-0 md:pb-0">
          <img
            src={altoLogo}
            alt="Alto Whisky"
            className="h-20 md:h-28 lg:h-32 w-auto animate-fade-in-up brightness-0 invert md:mt-16"
          />
          <p
            className="chapter-marker mt-4 text-secondary-foreground/70 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Whisky Cask Investment
          </p>

          <div
            className="mt-6 flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
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
