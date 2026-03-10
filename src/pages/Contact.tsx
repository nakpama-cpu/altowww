import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { useEffect, useState } from "react";
import heroImg from "@/assets/hero-mountain.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would submit to an API
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
          <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
            Contact Us
          </h1>
          <p
            className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Get in touch with our team of expert Portfolio Advisors.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          {submitted ? (
            <div className="text-center py-16">
              <h2 className="display-heading text-3xl md:text-4xl mb-6">
                Thank you.
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                One of our Portfolio Advisors will be in touch with you shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="display-heading text-2xl md:text-3xl mb-4">
                Get in touch.
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-12 leading-relaxed">
                Whether you're ready to invest or simply want to learn more, our
                team is here to help. Fill in the form below and one of our expert
                Portfolio Advisors will be in touch.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
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
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-10 py-3.5 hover:opacity-90 transition-opacity mt-4"
                >
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Contact;
