import { useBrochureModal } from "@/components/BrochureModal";

const BuyButton = () => {
  const { open } = useBrochureModal();

  return (
    <button
      onClick={open}
      className="fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground px-6 py-3 font-body text-sm uppercase tracking-[0.2em] hover:opacity-90 transition-opacity duration-300"
    >
      Request Brochure
    </button>
  );
};

export default BuyButton;
