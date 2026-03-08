import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../types";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  const handleCheckout = () => {
    toast.info("Checkout Coming Soon!", {
      description: "We're setting up secure payments. Stay tuned!",
      duration: 4000,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        data-ocid="cart.drawer"
        side="right"
        className="w-full sm:max-w-md bg-card border-border flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <SheetTitle className="font-serif text-xl text-foreground">
                Your Cart
              </SheetTitle>
              {totalItems > 0 && (
                <span className="bg-gold text-black text-[10px] font-bold font-display px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Cart items */}
        {items.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border">
              <ShoppingBag className="w-7 h-7 text-foreground/30" />
            </div>
            <div className="text-center">
              <p className="font-serif text-lg text-foreground/70 mb-1">
                Your cart is empty
              </p>
              <p className="font-sans text-sm text-foreground/40">
                Add items to get started
              </p>
            </div>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold font-display text-xs uppercase tracking-widest rounded-none mt-2"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-5">
                {items.map((item, idx) => (
                  <div
                    key={`${String(item.product.id)}-${item.size}`}
                    data-ocid={`cart.item.${idx + 1}`}
                    className="flex gap-4"
                  >
                    {/* Image thumbnail */}
                    <div className="flex-shrink-0 w-20 h-20 bg-secondary overflow-hidden rounded-sm border border-border">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-display text-[10px] uppercase tracking-wider text-foreground/50">
                          Size: {item.size}
                        </span>
                        <span className="text-border">·</span>
                        <span className="font-display text-[10px] uppercase tracking-wider text-foreground/50">
                          {item.product.color}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border rounded-sm overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="w-2.5 h-2.5 text-foreground/50" />
                          </button>
                          <span className="w-8 text-center font-display text-xs font-bold text-foreground border-x border-border h-7 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="w-2.5 h-2.5 text-foreground/50" />
                          </button>
                        </div>

                        {/* Line price */}
                        <span className="font-serif text-sm font-bold text-gold">
                          {formatINR(
                            item.product.price * BigInt(item.quantity),
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      data-ocid={`cart.remove_button.${idx + 1}`}
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-foreground/30 hover:text-destructive transition-colors rounded-sm hover:bg-destructive/10"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="px-6 py-5 border-t border-border flex-shrink-0 flex-col gap-4 sm:flex-col">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="font-display text-xs uppercase tracking-widest text-foreground/60">
                  Subtotal
                </span>
                <span className="font-serif text-xl font-bold text-gold">
                  {formatINR(totalPrice)}
                </span>
              </div>
              <p className="font-sans text-xs text-foreground/40 -mt-2">
                Taxes & shipping calculated at checkout
              </p>

              <Separator className="bg-border" />

              <Button
                data-ocid="cart.checkout_button"
                onClick={handleCheckout}
                className="w-full bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest h-12 rounded-none transition-all duration-300 hover:shadow-gold"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={closeCart}
                  className="w-full h-10 font-display text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground hover:bg-secondary rounded-none"
                >
                  Continue Shopping
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
