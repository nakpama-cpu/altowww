import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { useEffect, useState } from "react";
import heroImg from "@/assets/cask-closeup.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackLead } from "@/lib/metaPixel";

const stats = [
  {
    value: "582%",
    label: "Appreciation",
    text: "Rare whisky was the top-performing luxury asset of the past decade, according to the Knight Frank Luxury Investment Index.",
  },
  {
    value: "CGT-free",
    label: "Tax Treatment",
    text: "Whisky casks are classified as wasting assets by HMRC — meaning any gains are typically free from Capital Gains Tax.",
  },
  {
    value: "HMRC Bonded",
    label: "Secure Storage",
    text: "Your cask is stored in government-bonded warehouses in Scotland — fully insured and independently verifiable.",
  },
];

const Invest = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("leads").insert({
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: "Enquiry from whisky cask investment page.",
      source: "ad_landing",
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      return;
    }

    trackLead();
    setSubmitted(true);
  };

  return (
    <div className="relative">
      <Seo
        title="Whisky Cask Investment | Alto Whisky"
        description="Request your free whisky cask investment brochure. CGT-free tangible assets stored in HMRC-bonded Scottish warehouses, from £3,300."
        path="/invest"
      />
      <Header />

      {/* Hero */}
      <section className="relative section-dark overflow-hidden">
        <img
          src={heroImg}
          alt="Oak whisky cask resting in a bonded warehouse"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20 md:py-28">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary-foreground/70 mb-6 animate-fade-in-up">
            Alto Whisky · Est. Asset Management
          </p>
          <h1 className="display-heading text-4xl md:text-6xl text-secondary-foreground animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Invest in Whisky Casks
          </h1>
          <p
            className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-xl mx-auto tracking-wide leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Own a tangible, CGT-free asset maturing in HMRC-bonded Scottish
            warehouses. Request your free investment brochure today.
          </p>
          <a
            href="#enquire"
            className="inline-block mt-10 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-10 py-4 hover:opacity-90 transition-opacity animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            Request Your Brochure
          </a>
        </div>
      </section>

      {/* Proof stats */}
      <section className="section-light py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {stats.map((s) => (
              <div key={s.value} className="border-l-2 border-primary pl-5">
                <p className="display-heading text-3xl md:text-4xl">{s.value}</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1 mb-3">
                  {s.label}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquire" className="section-light pb-10 md:pb-16">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          {submitted ? (
            <div className="text-center py-10">
              <h2 className="display-heading text-3xl md:text-4xl mb-6">Thank you.</h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                One of our Portfolio Advisors will be in touch with your brochure
                shortly.
              </p>
            </div>
          ) : (
            <div className="bg-background border border-border p-8 md:p-12">
              <h2 className="display-heading text-2xl md:text-3xl mb-4 text-center">
                Request Your Free Brochure
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-10 text-center leading-relaxed">
                Complete the form below and a Portfolio Advisor will be in touch
                with your copy.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="invest-first-name" className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      id="invest-first-name"
                      type="text"
                      required
                      maxLength={100}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="invest-last-name" className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      id="invest-last-name"
                      type="text"
                      required
                      maxLength={100}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="invest-email" className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Email *
                  </label>
                  <input
                    id="invest-email"
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="invest-phone" className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="invest-phone"
                    type="tel"
                    required
                    maxLength={30}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-10 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Me the Brochure"}
                  </button>
                  <p className="font-body text-[11px] text-muted-foreground mt-6 leading-relaxed">
                    By submitting, you agree to be contacted about whisky cask
                    investment opportunities. Capital at risk. Past performance is
                    not a guide to future returns.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Invest;
