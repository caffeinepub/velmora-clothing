import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";
import { formatINR } from "../../types";

interface ProductCardProps {
  product: Product;
  index: number;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  onOpenDetail,
}: ProductCardProps) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] ?? "M";
    addItem(product, defaultSize);
    toast.success("Added to cart", {
      description: `${product.name} — ${defaultSize}`,
      action: {
        label: "View Cart",
        onClick: openCart,
      },
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      data-ocid={`product.item.${index + 1}`}
      className="group relative bg-card rounded-sm overflow-hidden border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Clickable area for product detail */}
      <button
        type="button"
        className="block w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
        onClick={() => onOpenDetail(product)}
        aria-label={`View ${product.name}`}
      >
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-display text-xs uppercase tracking-widest text-foreground/70 border border-foreground/30 px-3 py-1">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick view overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-sm border border-gold/30">
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span className="font-display text-xs uppercase tracking-wider text-gold">
                Quick View
              </span>
            </div>
          </div>

          {/* New badge */}
          <Badge className="absolute top-3 left-3 bg-gold text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none">
            New
          </Badge>
        </div>

        {/* Product info */}
        <div className="p-4">
          <div className="mb-1">
            <span className="font-display text-[10px] uppercase tracking-widest text-gold/70">
              {product.color}
            </span>
          </div>
          <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-3 line-clamp-2">
            {product.name}
          </h3>

          {/* Sizes preview */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[9px] font-display uppercase tracking-wider text-foreground/40 border border-border/60 px-1.5 py-0.5"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] font-display text-foreground/30">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Price + Add to cart — outside button to avoid nesting */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="font-serif text-lg font-bold text-gold">
          {formatINR(product.price)}
        </span>
        <button
          type="button"
          data-ocid="product.add_to_cart_button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 hover:border-gold px-3 py-2 text-[10px] font-display uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="w-3 h-3" />
          Add
        </button>
      </div>
    </motion.article>
  );
}
