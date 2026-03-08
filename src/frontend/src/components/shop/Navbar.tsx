import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export function Navbar() {
  const { openCart, totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.08_0_0/0.97)] backdrop-blur-md border-b border-gold/20"
          : "bg-[oklch(0.08_0_0/0.85)] backdrop-blur-sm border-b border-gold/10"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.home_link"
            className="flex-shrink-0 flex items-center gap-2"
          >
            <img
              src="/assets/generated/velmora-logo-transparent.dim_400x120.png"
              alt="Velmora"
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              data-ocid="nav.shirts_link"
              onClick={() => scrollToSection("shirts")}
              className="font-display text-sm uppercase tracking-widest text-foreground/70 hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              Shirts
            </button>
            <button
              type="button"
              data-ocid="nav.tshirts_link"
              onClick={() => scrollToSection("tshirts")}
              className="font-display text-sm uppercase tracking-widest text-foreground/70 hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              T-Shirts
            </button>
            <button
              type="button"
              data-ocid="nav.hoodies_link"
              onClick={() => scrollToSection("hoodies")}
              className="font-display text-sm uppercase tracking-widest text-foreground/70 hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              Hoodies
            </button>
            <Link
              to="/admin"
              data-ocid="nav.admin_link"
              className="font-display text-sm uppercase tracking-widest text-foreground/50 hover:text-gold/70 transition-colors duration-200"
            >
              Admin
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              type="button"
              data-ocid="nav.cart_button"
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all duration-200 group"
              aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
            >
              <ShoppingBag className="w-5 h-5 text-foreground/70 group-hover:text-gold transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gold text-black text-[10px] font-bold rounded-full font-display">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10 text-foreground/70 hover:text-gold hover:bg-gold/5"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gold/10 flex flex-col gap-4">
            {[
              { label: "Shirts", id: "shirts", ocid: "nav.shirts_link" },
              { label: "T-Shirts", id: "tshirts", ocid: "nav.tshirts_link" },
              { label: "Hoodies", id: "hoodies", ocid: "nav.hoodies_link" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                data-ocid={item.ocid}
                onClick={() => scrollToSection(item.id)}
                className="font-display text-sm uppercase tracking-widest text-foreground/70 hover:text-gold text-left transition-colors duration-200 px-1"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/admin"
              data-ocid="nav.admin_link"
              className="font-display text-sm uppercase tracking-widest text-foreground/50 hover:text-gold/70 text-left transition-colors duration-200 px-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
