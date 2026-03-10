import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-mountain.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RequestBrochure = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
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
      message: formData.message.trim() || null,
      source: "brochure_request",
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

    setSubmitted(true);
  };

  return (
    <div className="relative">
      <Header />

      {/* Hero */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Mountain landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
            Get Started
          </p>
          <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
            Request Your Free Brochure
          </h1>
          <p
            className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Discover why whisky casks are the best performing collectible of the
            decade.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left - Benefits */}
          <div>
            <h2 className="display-heading text-2xl md:text-3xl mb-8">
              What's inside the brochure?
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Investment Overview",
                  desc: "Learn how whisky cask investment works and why it's been the top performing collectible of the decade.",
                },
                {
                  title: "Tax-Free Returns",
                  desc: "Understand why whisky casks are classified as a 'wasting asset' and exempt from Capital Gains Tax.",
                },
                {
                  title: "Distillery Portfolio",
                  desc: "Explore the distilleries we source casks from across Scotland and the wider world.",
                },
                {
                  title: "The Process",
                  desc: "A step-by-step guide from your first conversation to owning your cask.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="w-8 h-px bg-primary mb-3" />
                  <h3 className="font-display text-lg font-light mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-sm">
              <p className="font-display text-4xl text-primary font-light mb-2">
                582%
              </p>
              <p className="font-body text-sm text-muted-foreground">
                Rare whisky appreciation over 10 years
              </p>
              <p className="font-body text-xs text-muted-foreground/50 mt-2">
                Source: Knight Frank Luxury Investment Index
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            {submitted ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="display-heading text-2xl md:text-3xl mb-4">
                  Thank you.
                </h2>
                <p className="font-body text-base text-muted-foreground leading-relaxed mb-2">
                  Your brochure request has been received.
                </p>
                <p className="font-body text-sm text-muted-foreground/70 leading-relaxed">
                  One of our expert Portfolio Advisors will be in touch with you
                  shortly to share the brochure and discuss your investment
                  goals.
                </p>
              </div>
            ) : (
              <>
                <h2 className="display-heading text-2xl md:text-3xl mb-4">
                  Request your brochure.
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-10 leading-relaxed">
                  Fill in your details below and one of our expert Portfolio
                  Advisors will send you the brochure and be available to answer
                  any questions.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={30}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Any specific questions or investment goals?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-10 py-4 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                  >
                    {submitting ? "Sending..." : "Request Brochure"}
                  </button>
                  <p className="font-body text-xs text-muted-foreground/50 text-center">
                    Your details are secure and will only be used to contact you
                    about your brochure request.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default RequestBrochure;
