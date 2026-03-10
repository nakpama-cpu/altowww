import { useBrochureModal } from "@/components/BrochureModal";

interface BrochureButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BrochureButton = ({ className, children }: BrochureButtonProps) => {
  const { open } = useBrochureModal();

  return (
    <button onClick={open} className={className}>
      {children ?? "Request Brochure"}
    </button>
  );
};

export default BrochureButton;

/** A secondary CTA that also opens the brochure/contact modal */
export const ContactButton = ({ className, children }: BrochureButtonProps) => {
  const { open } = useBrochureModal();

  return (
    <button onClick={open} className={className}>
      {children ?? "Speak to an Advisor"}
    </button>
  );
};
