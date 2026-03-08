import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function HeroSection() {
  const scrollToShop = () => {
    const el = document.getElementById("shirts");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-banner.dim_1400x700.jpg"
          alt="Velmora Hero"
          className="w-full h-full object-cover object-center"
        />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative gold vertical line */}
      <div className="absolute left-8 lg:left-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent z-10 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl">
          {/* Hindi accent */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-px w-8 bg-gold block" />
            <span className="text-gold font-display text-sm tracking-[0.25em] uppercase">
              नया संग्रह
            </span>
            <span className="text-gold/40 font-display text-sm tracking-[0.15em] uppercase">
              New Collection
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] font-bold text-foreground mb-6"
          >
            Dress Like{" "}
            <span className="text-gold-gradient italic">Royalty</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-lg text-foreground/60 max-w-md leading-relaxed mb-8"
          >
            Premium Men's Fashion — Crafted for the Modern Indian. Quality that
            speaks, style that endures.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              data-ocid="hero.shop_now_button"
              onClick={scrollToShop}
              className="bg-gold hover:bg-gold-bright text-black font-display font-bold text-sm uppercase tracking-widest px-8 py-5 h-auto rounded-none transition-all duration-300 hover:shadow-gold"
            >
              Shop Now
            </Button>
            <span className="text-foreground/30 font-sans text-sm">
              Free delivery on orders above ₹999
            </span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex items-center gap-8"
          >
            {[
              { value: "10K+", label: "Orders Delivered" },
              { value: "4.8★", label: "Customer Rating" },
              { value: "100%", label: "Premium Cotton" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-gold">
                  {stat.value}
                </div>
                <div className="font-display text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
