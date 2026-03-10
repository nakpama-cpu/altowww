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
