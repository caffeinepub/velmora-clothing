import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "../../backend";
import type { Product } from "../../types";
import { SIZES, paiseToRupees, rupeesToPaise } from "../../types";

interface ProductFormData {
  name: string;
  description: string;
  category: Category;
  price: string; // INR string
  color: string;
  sizes: string[];
  imageUrl: string;
  inStock: boolean;
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  description: "",
  category: Category.shirt,
  price: "",
  color: "",
  sizes: [],
  imageUrl: "",
  inStock: true,
};

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => Promise<void>;
  initialProduct?: Product | null;
  mode: "add" | "edit";
}

export function ProductForm({
  open,
  onClose,
  onSubmit,
  initialProduct,
  mode,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: open resets the form when dialog reopens
  useEffect(() => {
    if (initialProduct && mode === "edit") {
      setForm({
        name: initialProduct.name,
        description: initialProduct.description,
        category: initialProduct.category,
        price: paiseToRupees(initialProduct.price).toString(),
        color: initialProduct.color,
        sizes: [...initialProduct.sizes],
        imageUrl: initialProduct.imageUrl,
        inStock: initialProduct.inStock,
      });
    } else if (mode === "add") {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [initialProduct, mode, open]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (
      !form.price ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    )
      newErrors.price = "Valid price required";
    if (!form.color.trim()) newErrors.color = "Color is required";
    if (form.sizes.length === 0) newErrors.sizes = "Select at least one size";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const product: Product = {
        id: initialProduct?.id ?? BigInt(0),
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: rupeesToPaise(Number(form.price)),
        color: form.color.trim(),
        sizes: [...form.sizes],
        imageUrl: form.imageUrl.trim(),
        inStock: form.inStock,
        createdAt:
          initialProduct?.createdAt ?? BigInt(Date.now()) * BigInt(1_000_000),
      };
      await onSubmit(product);
      onClose();
    } catch (err) {
      toast.error("Failed to save product", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-xl p-0 rounded-sm">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="font-serif text-xl text-foreground">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="px-6 py-5 space-y-5"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="product-name"
                className="font-display text-xs uppercase tracking-wider text-foreground/70"
              >
                Product Name *
              </Label>
              <Input
                id="product-name"
                data-ocid="admin.product_form.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Royal Oxford Shirt"
                className="bg-secondary border-border text-foreground placeholder:text-foreground/30 focus:border-gold/50 focus:ring-gold/20 rounded-sm h-10"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="product-desc"
                className="font-display text-xs uppercase tracking-wider text-foreground/70"
              >
                Description *
              </Label>
              <Textarea
                id="product-desc"
                data-ocid="admin.product_form.description_textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe the product..."
                className="bg-secondary border-border text-foreground placeholder:text-foreground/30 focus:border-gold/50 resize-none rounded-sm"
                rows={3}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Category + Price row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-display text-xs uppercase tracking-wider text-foreground/70">
                  Category *
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, category: v as Category }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.product_form.category_select"
                    className="bg-secondary border-border text-foreground focus:border-gold/50 rounded-sm h-10"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem
                      value={Category.shirt}
                      className="text-foreground"
                    >
                      Shirt
                    </SelectItem>
                    <SelectItem
                      value={Category.tshirt}
                      className="text-foreground"
                    >
                      T-Shirt
                    </SelectItem>
                    <SelectItem
                      value={Category.hoodie}
                      className="text-foreground"
                    >
                      Hoodie
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="product-price"
                  className="font-display text-xs uppercase tracking-wider text-foreground/70"
                >
                  Price (₹ INR) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 font-serif text-sm">
                    ₹
                  </span>
                  <Input
                    id="product-price"
                    data-ocid="admin.product_form.price_input"
                    type="number"
                    min="1"
                    step="1"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="1299"
                    className="bg-secondary border-border text-foreground pl-7 focus:border-gold/50 rounded-sm h-10"
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <Label
                htmlFor="product-color"
                className="font-display text-xs uppercase tracking-wider text-foreground/70"
              >
                Color *
              </Label>
              <Input
                id="product-color"
                data-ocid="admin.product_form.color_input"
                value={form.color}
                onChange={(e) =>
                  setForm((p) => ({ ...p, color: e.target.value }))
                }
                placeholder="e.g. Navy Blue"
                className="bg-secondary border-border text-foreground placeholder:text-foreground/30 focus:border-gold/50 rounded-sm h-10"
              />
              {errors.color && (
                <p className="text-xs text-destructive">{errors.color}</p>
              )}
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label className="font-display text-xs uppercase tracking-wider text-foreground/70">
                Sizes *{" "}
                {errors.sizes && (
                  <span className="text-destructive ml-2 normal-case">
                    {errors.sizes}
                  </span>
                )}
              </Label>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <Checkbox
                      id={`size-${size}`}
                      data-ocid={`admin.product_form.size_${size.toLowerCase()}_checkbox`}
                      checked={form.sizes.includes(size)}
                      onCheckedChange={() => toggleSize(size)}
                      className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold rounded-sm"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="font-display text-xs uppercase tracking-wider cursor-pointer text-foreground/70"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="product-image"
                className="font-display text-xs uppercase tracking-wider text-foreground/70"
              >
                Image URL *
              </Label>
              <Input
                id="product-image"
                data-ocid="admin.product_form.image_url_input"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="bg-secondary border-border text-foreground placeholder:text-foreground/30 focus:border-gold/50 rounded-sm h-10"
              />
              {errors.imageUrl && (
                <p className="text-xs text-destructive">{errors.imageUrl}</p>
              )}
            </div>

            {/* In Stock toggle */}
            <div className="flex items-center justify-between py-2 border-y border-border">
              <Label
                htmlFor="product-instock"
                className="font-display text-xs uppercase tracking-wider text-foreground/70"
              >
                In Stock
              </Label>
              <Switch
                id="product-instock"
                data-ocid="admin.product_form.instock_switch"
                checked={form.inStock}
                onCheckedChange={(v) => setForm((p) => ({ ...p, inStock: v }))}
                className="data-[state=checked]:bg-gold"
              />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border flex gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            data-ocid="admin.product_form.cancel_button"
            className="border-border text-foreground/60 hover:text-foreground hover:bg-secondary rounded-sm font-display text-xs uppercase tracking-wider flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={submitting}
            data-ocid="admin.product_form.submit_button"
            className="bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest rounded-none flex-1 h-10"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Saving...
              </>
            ) : mode === "add" ? (
              "Add Product"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
