import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-sm text-foreground/50 hover:text-foreground transition-colors cursor-default">
      {children}
    </span>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "velmora.in",
  );

  return (
    <footer className="bg-[oklch(0.08_0_0)] border-t border-gold/15 mt-8">
      {/* Gold divider */}
      <div className="gold-divider" />

      <div className="container mx-auto px-4 max-w-7xl py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/assets/generated/velmora-logo-transparent.dim_400x120.png"
              alt="Velmora"
              className="h-10 w-auto mb-4 object-contain"
            />
            <p className="font-sans text-sm text-foreground/50 leading-relaxed max-w-xs">
              Premium men's fashion crafted for the modern Indian. Quality
              fabrics, timeless styles — wear your story.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-5">
              {[
                {
                  Icon: SiInstagram,
                  label: "Instagram",
                  href: "https://instagram.com/velmora",
                },
                {
                  Icon: SiX,
                  label: "X / Twitter",
                  href: "https://x.com/velmora",
                },
                {
                  Icon: SiFacebook,
                  label: "Facebook",
                  href: "https://facebook.com/velmora",
                },
                {
                  Icon: SiYoutube,
                  label: "YouTube",
                  href: "https://youtube.com/@velmora",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-gold border border-border hover:border-gold/40 transition-all duration-200 rounded-sm"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-gold/80 mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {["Shirts", "T-Shirts", "Hoodies", "New Arrivals", "Sale"].map(
                (item) => (
                  <li key={item}>
                    <FooterLink>{item}</FooterLink>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-gold/80 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                "About Velmora",
                "Our Story",
                "Careers",
                "Press",
                "Sustainability",
              ].map((item) => (
                <li key={item}>
                  <FooterLink>{item}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Policies */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-gold/80 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {[
                "Contact Us",
                "Size Guide",
                "Returns & Exchanges",
                "Shipping Info",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <FooterLink>{item}</FooterLink>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <p className="font-sans text-xs text-foreground/40 mb-1">
                Email us at
              </p>
              <a
                href="mailto:hello@velmora.in"
                className="font-sans text-sm text-gold/70 hover:text-gold transition-colors"
              >
                hello@velmora.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="font-sans text-xs text-foreground/30">
            © {currentYear} Velmora. All rights reserved. | Made with pride in
            India 🇮🇳
          </p>
          <p className="font-sans text-xs text-foreground/25">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/50 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
