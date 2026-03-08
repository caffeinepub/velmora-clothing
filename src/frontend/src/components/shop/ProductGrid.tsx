import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import { Category } from "../../backend";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

interface SectionConfig {
  id: string;
  category: Category;
  hindiTitle: string;
  englishTitle: string;
}

const SECTIONS: SectionConfig[] = [
  {
    id: "shirts",
    category: Category.shirt,
    hindiTitle: "शर्ट",
    englishTitle: "Shirts",
  },
  {
    id: "tshirts",
    category: Category.tshirt,
    hindiTitle: "टी-शर्ट",
    englishTitle: "T-Shirts",
  },
  {
    id: "hoodies",
    category: Category.hoodie,
    hindiTitle: "हुडी",
    englishTitle: "Hoodies",
  },
];

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <Skeleton className="aspect-square w-full bg-secondary" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16 bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-3/4 bg-secondary" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-20 bg-secondary" />
          <Skeleton className="h-8 w-16 bg-secondary" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const getByCategory = (cat: Category) =>
    products.filter((p) => p.category === cat);

  return (
    <>
      {SECTIONS.map((section) => {
        const sectionProducts = getByCategory(section.category);

        return (
          <section key={section.id} id={section.id} className="py-16 lg:py-24">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="mb-10 lg:mb-14"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="h-px flex-1 max-w-[60px] bg-gold/40" />
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold/60">
                    Collection
                  </span>
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                  <span className="text-gold/70 italic mr-3">
                    {section.hindiTitle}
                  </span>
                  <span className="text-foreground/90">
                    | {section.englishTitle}
                  </span>
                </h2>
                <div className="gold-divider mt-4 max-w-xs" />
              </motion.div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {["sk-a", "sk-b", "sk-c"].map((sk) => (
                    <SkeletonCard key={sk} />
                  ))}
                </div>
              ) : sectionProducts.length === 0 ? (
                <div
                  data-ocid={`${section.id}.empty_state`}
                  className="text-center py-16 border border-border/40 rounded-sm"
                >
                  <p className="font-display text-sm uppercase tracking-widest text-foreground/30">
                    No products in this collection yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sectionProducts.map((product, i) => (
                    <ProductCard
                      key={String(product.id)}
                      product={product}
                      index={i}
                      onOpenDetail={setDetailProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Product detail modal */}
      <ProductDetailModal
        product={detailProduct}
        open={detailProduct !== null}
        onClose={() => setDetailProduct(null)}
      />
    </>
  );
}
