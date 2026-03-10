const FooterSection = () => {
  return (
    <footer className="section-dark py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="display-heading text-2xl md:text-3xl text-secondary-foreground mb-8">
          Alto Whisky
        </h3>
        <p className="font-body text-sm text-secondary-foreground/50 mb-12 max-w-md mx-auto leading-relaxed">
          Whisky cask investment is now widely considered one of the most secure 
          assets available. Alto Whisky brings this opportunity to discerning investors 
          from all walks of life.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 font-body text-xs uppercase tracking-[0.2em] text-secondary-foreground/40">
          <a href="https://www.altowhisky.com/how-it-works" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="https://www.altowhisky.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            About Us
          </a>
          <a href="https://www.altowhisky.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>
        <div className="mt-16 pt-8 border-t border-secondary-foreground/10">
          <p className="font-body text-xs text-secondary-foreground/30">
            © 2026 Alto Whisky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
