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

type ModalMode = "brochure" | "advisor";

type BrochureModalContextType = {
  open: (mode?: ModalMode) => void;
};

const BrochureModalContext = createContext<BrochureModalContextType>({
  open: () => {},
});

export const useBrochureModal = () => useContext(BrochureModalContext);

const callReasons = [
  "I'd like to invest in whisky casks",
  "I'd like more information",
  "I have an existing portfolio to discuss",
  "I'd like to sell or bottle my cask",
  "General enquiry",
];

export const BrochureModalProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("brochure");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    reason: "",
  });

  const open = (m: ModalMode = "brochure") => {
    setMode(m);
    setIsOpen(true);
    if (submitted) {
      setSubmitted(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", reason: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const messageParts: string[] = [];
    if (mode === "advisor" && formData.reason) {
      messageParts.push(`Reason: ${formData.reason}`);
    }
    if (formData.message.trim()) {
      messageParts.push(formData.message.trim());
    }

    const { error } = await supabase.from("leads").insert({
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: messageParts.join(" — ") || null,
      source: mode === "advisor" ? "advisor_callback" : "brochure_request",
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

  const isBrochure = mode === "brochure";

  return (
    <BrochureModalContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-1rem)] max-w-lg max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto bg-background border-border p-0">
          {submitted ? (
            <div className="py-10 px-4 sm:py-16 sm:px-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogHeader>
                <DialogTitle className="display-heading text-lg sm:text-2xl mb-2 sm:mb-4">Thank you.</DialogTitle>
                <DialogDescription className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isBrochure
                    ? "Your brochure request has been received. One of our expert Portfolio Advisors will be in touch shortly."
                    : "Your request has been received. One of our expert Portfolio Advisors will call you shortly."}
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <div className="p-4 sm:p-8">
              <DialogHeader className="mb-3 sm:mb-6">
                <DialogTitle className="display-heading text-lg sm:text-2xl">
                  {isBrochure ? "Request Your Free Brochure" : "Speak to an Advisor"}
                </DialogTitle>
                <DialogDescription className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 sm:mt-2">
                  {isBrochure
                    ? "Fill in your details and one of our expert Portfolio Advisors will send you the brochure and answer any questions."
                    : "Fill in your details and one of our expert Portfolio Advisors will be in touch to discuss your requirements."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Reason dropdown — only for advisor mode */}
                {!isBrochure && (
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                      Reason for Call *
                    </label>
                    <select
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a reason...
                      </option>
                      {callReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 sm:mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-2 sm:py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder={
                      isBrochure
                        ? "Any specific questions or investment goals?"
                        : "Anything else you'd like us to know?"
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-6 sm:px-10 py-2.5 sm:py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting
                    ? "Sending..."
                    : isBrochure
                    ? "Request Brochure"
                    : "Request Callback"}
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
