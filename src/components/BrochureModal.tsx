import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type BrochureModalContextType = {
  open: () => void;
};

const BrochureModalContext = createContext<BrochureModalContextType>({
  open: () => {},
});

export const useBrochureModal = () => useContext(BrochureModalContext);

export const BrochureModalProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const open = () => {
    setIsOpen(true);
    if (submitted) {
      setSubmitted(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    }
  };

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
    <BrochureModalContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border p-0 overflow-hidden">
          {submitted ? (
            <div className="py-16 px-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogHeader>
                <DialogTitle className="display-heading text-2xl mb-4">Thank you.</DialogTitle>
                <DialogDescription className="font-body text-sm text-muted-foreground leading-relaxed">
                  Your brochure request has been received. One of our expert Portfolio
                  Advisors will be in touch shortly.
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="display-heading text-2xl">
                  Request Your Free Brochure
                </DialogTitle>
                <DialogDescription className="font-body text-sm text-muted-foreground leading-relaxed mt-2">
                  Fill in your details and one of our expert Portfolio Advisors will
                  send you the brochure and answer any questions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Any specific questions or investment goals?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-10 py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Request Brochure"}
                </button>
                <p className="font-body text-xs text-muted-foreground/50 text-center">
                  Your details are secure and will only be used to contact you.
                </p>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BrochureModalContext.Provider>
  );
};
