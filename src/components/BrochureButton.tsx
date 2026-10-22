import { useBrochureModal } from "@/components/BrochureModal";

interface BrochureButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BrochureButton = ({ className, children }: BrochureButtonProps) => {
  const { open } = useBrochureModal();

  return (
    <button data-analytics-cta="request_brochure" onClick={() => open("brochure")} className={className}>
      {children ?? "Request Brochure"}
    </button>
  );
};

export default BrochureButton;

/** A secondary CTA that opens the advisor callback modal */
export const ContactButton = ({ className, children }: BrochureButtonProps) => {
  const { open } = useBrochureModal();

  return (
    <button data-analytics-cta="speak_to_advisor" onClick={() => open("advisor")} className={className}>
      {children ?? "Speak to an Advisor"}
    </button>
  );
};
