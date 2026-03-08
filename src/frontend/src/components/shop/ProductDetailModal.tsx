import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Package, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types";
import { formatINR } from "../../types";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  open,
  onClose,
}: ProductDetailModalProps) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize, quantity);
    toast.success("Added to cart", {
      description: `${product.name} — Size ${selectedSize} × ${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => {
          onClose();
          openCart();
        },
      },
    });
    onClose();
  };

  const categoryLabel: Record<string, string> = {
    shirt: "Shirt",
    tshirt: "T-Shirt",
    hoodie: "Hoodie",
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-3xl p-0 overflow-hidden rounded-sm gap-0"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>

        {/* Close button */}
        <button
          type="button"
          data-ocid="product_detail.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black text-foreground/60 hover:text-gold transition-colors rounded-sm border border-border"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-secondary overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
          </div>

          {/* Details */}
          <ScrollArea className="max-h-[80vh] md:max-h-none">
            <div className="p-6 lg:p-8">
              {/* Category + color */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-display text-[10px] uppercase tracking-[0.2em] text-gold/70 border border-gold/20 px-2 py-0.5">
                  {categoryLabel[product.category] ?? product.category}
                </span>
                <span className="font-display text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  {product.color}
                </span>
              </div>

              {/* Name */}
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="font-serif text-3xl font-bold text-gold mb-4">
                {formatINR(product.price)}
                <span className="text-sm font-sans font-normal text-foreground/40 ml-2">
                  incl. all taxes
                </span>
              </div>

              <Separator className="bg-border mb-5" />

              {/* Description */}
              <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs uppercase tracking-widest text-foreground/70">
                    Select Size
                  </span>
                  {!selectedSize && (
                    <span className="font-display text-[10px] text-gold/60 uppercase tracking-wider">
                      Required
                    </span>
                  )}
                </div>
                <div
                  data-ocid="product_detail.size_select"
                  className="flex flex-wrap gap-2"
                >
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-11 px-3 font-display text-xs uppercase tracking-wider border transition-all duration-200 rounded-sm ${
                        selectedSize === size
                          ? "border-gold bg-gold text-black font-bold shadow-gold"
                          : "border-border text-foreground/60 hover:border-gold/50 hover:text-foreground"
                      }`}
                      aria-pressed={selectedSize === size}
                      aria-label={`Size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="font-display text-xs uppercase tracking-widest text-foreground/70 block mb-3">
                  Quantity
                </span>
                <div className="flex items-center gap-0 w-fit border border-border rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-secondary text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-display text-sm font-bold text-foreground border-x border-border h-11 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-secondary text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* In stock indicator */}
              <div className="flex items-center gap-2 mb-6">
                <Package
                  className={`w-4 h-4 ${product.inStock ? "text-green-500" : "text-red-500"}`}
                />
                <span
                  className={`font-display text-xs uppercase tracking-wider ${product.inStock ? "text-green-500" : "text-red-500"}`}
                >
                  {product.inStock
                    ? "In Stock — Ready to Ship"
                    : "Out of Stock"}
                </span>
              </div>

              {/* Add to cart */}
              <Button
                data-ocid="product_detail.add_to_cart_button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest h-12 rounded-none transition-all duration-300 hover:shadow-gold disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart — {formatINR(product.price * BigInt(quantity))}
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
