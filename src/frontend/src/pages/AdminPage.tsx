import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Key,
  Loader2,
  LogIn,
  LogOut,
  Package,
  Pencil,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend";
import { DeleteConfirmDialog } from "../components/admin/DeleteConfirmDialog";
import { ProductForm } from "../components/admin/ProductForm";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useIsAdmin,
  useProducts,
  useUpdateProduct,
} from "../hooks/useQueries";
import type { Product } from "../types";
import { formatINR } from "../types";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.shirt]: "Shirt",
  [Category.tshirt]: "T-Shirt",
  [Category.hoodie]: "Hoodie",
};

export function AdminPage() {
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const {
    data: isAdmin,
    isLoading: adminLoading,
    refetch: refetchAdmin,
  } = useIsAdmin();
  const { actor } = useActor();

  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [isClaimingAdmin, setIsClaimingAdmin] = useState(false);

  const handleClaimAdmin = async () => {
    if (!actor) return;
    setIsClaimingAdmin(true);
    try {
      await (
        actor as unknown as Record<string, (arg: string) => Promise<void>>
      )._initializeAccessControlWithSecret(adminToken);
      await refetchAdmin();
      const { data: newIsAdmin } = await refetchAdmin();
      if (newIsAdmin) {
        toast.success("Admin access granted! Welcome to the admin panel.");
      } else {
        toast.error(
          "Invalid admin token. Please check the token and try again.",
        );
      }
    } catch {
      toast.error("Failed to claim admin access. Please try again.");
    } finally {
      setIsClaimingAdmin(false);
    }
  };

  const isLoggedIn = !!identity;
  const principalStr = identity?.getPrincipal().toString();

  const handleAddProduct = async (product: Product) => {
    await addProductMutation.mutateAsync(product);
    toast.success("Product added successfully!");
  };

  const handleEditProduct = async (product: Product) => {
    if (!editProduct) return;
    await updateProductMutation.mutateAsync({ id: editProduct.id, product });
    toast.success("Product updated successfully!");
    setEditProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    await deleteProductMutation.mutateAsync(deleteProduct.id);
    toast.success(`"${deleteProduct.name}" deleted.`);
    setDeleteProduct(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="border-b border-gold/20 bg-[oklch(0.1_0.01_70)]">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Shield className="w-5 h-5 text-gold" />
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                  Velmora Admin
                </h1>
                <span className="font-display text-xs uppercase tracking-widest text-foreground/40 mt-1">
                  — Product Manager
                </span>
              </div>
              {isLoggedIn && principalStr && (
                <p className="font-display text-[11px] uppercase tracking-wider text-gold/50 mt-1 truncate max-w-xs">
                  {principalStr.slice(0, 32)}...
                </p>
              )}
            </div>

            {/* Login / logout */}
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <Button
                  onClick={login}
                  disabled={isLoggingIn || isInitializing}
                  className="bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest rounded-none h-10"
                >
                  {isLoggingIn || isInitializing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5 mr-2" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={clear}
                  className="border-border text-foreground/60 hover:text-foreground hover:bg-secondary rounded-sm font-display text-xs uppercase tracking-wider h-10"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div
            data-ocid="admin.login_required.panel"
            className="text-center py-20 max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border mx-auto mb-6">
              <Shield className="w-7 h-7 text-foreground/30" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              Admin Access Only
            </h2>
            <p className="font-sans text-sm text-foreground/50 mb-8 leading-relaxed">
              Please login with your Internet Identity to access the admin
              panel.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest rounded-none h-11 px-8"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>
        )}

        {/* Loading admin check */}
        {isLoggedIn && adminLoading && (
          <div data-ocid="admin.loading_state" className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
            <p className="font-display text-xs uppercase tracking-widest text-foreground/40">
              Verifying admin access...
            </p>
          </div>
        )}

        {/* Not admin — show claim admin form */}
        {isLoggedIn && !adminLoading && !isAdmin && (
          <div
            data-ocid="admin.not_admin.panel"
            className="py-16 max-w-md mx-auto"
          >
            {/* Icon + heading */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 mx-auto mb-5">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Access Restricted
              </h2>
              <p className="font-sans text-sm text-foreground/50 leading-relaxed">
                Your account doesn't have admin access yet. If you have the
                admin token, enter it below to claim admin privileges.
              </p>
            </div>

            {/* Claim admin token form */}
            <div className="border border-gold/20 bg-[oklch(0.1_0.01_70)] p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-gold" />
                <h3 className="font-display text-xs uppercase tracking-widest text-gold">
                  Claim Admin Access
                </h3>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="admin-token"
                  className="font-display text-[10px] uppercase tracking-widest text-foreground/50"
                >
                  Admin Token
                </Label>
                <Input
                  id="admin-token"
                  data-ocid="admin.claim.input"
                  type="password"
                  placeholder="Enter your admin token..."
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleClaimAdmin();
                  }}
                  className="bg-background border-border text-foreground placeholder:text-foreground/30 rounded-sm font-sans text-sm h-10 focus-visible:ring-gold/30 focus-visible:border-gold/50"
                />
                <p className="font-sans text-[11px] text-foreground/30 leading-relaxed">
                  The admin token is set by the platform. Contact your system
                  administrator if you don't have it.
                </p>
              </div>

              <Button
                data-ocid="admin.claim.submit_button"
                onClick={() => void handleClaimAdmin()}
                disabled={isClaimingAdmin || !adminToken.trim()}
                className="w-full bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest rounded-none h-10 disabled:opacity-40"
              >
                {isClaimingAdmin ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 mr-2" />
                    Claim Admin Access
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Admin dashboard */}
        {isLoggedIn && !adminLoading && isAdmin && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Products
                </h2>
                <Badge className="bg-gold/10 text-gold border border-gold/20 font-display text-[10px] uppercase tracking-wider rounded-sm px-2">
                  {products.length} total
                </Badge>
              </div>
              <Button
                data-ocid="admin.add_product_button"
                onClick={() => setAddModalOpen(true)}
                className="bg-gold hover:bg-gold-bright text-black font-display font-bold text-xs uppercase tracking-widest rounded-none h-10"
              >
                <Plus className="w-3.5 h-3.5 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products table */}
            {productsLoading ? (
              <div
                data-ocid="admin.products.loading_state"
                className="space-y-3"
              >
                {["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                  <Skeleton
                    key={sk}
                    className="h-16 w-full bg-secondary rounded-sm"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div
                data-ocid="admin.products.empty_state"
                className="text-center py-16 border border-border/40 rounded-sm"
              >
                <Package className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
                <p className="font-display text-sm uppercase tracking-widest text-foreground/30">
                  No products yet — add your first product!
                </p>
              </div>
            ) : (
              <div className="border border-border rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 w-16">
                        Image
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50">
                        Name
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50">
                        Price
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 hidden lg:table-cell">
                        Color
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 hidden lg:table-cell">
                        Sizes
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 hidden md:table-cell">
                        Stock
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-widest text-foreground/50 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, idx) => (
                      <TableRow
                        key={String(product.id)}
                        data-ocid={`admin.product.item.${idx + 1}`}
                        className="border-border hover:bg-secondary/40 transition-colors"
                      >
                        {/* Image */}
                        <TableCell className="py-3">
                          <div className="w-12 h-12 bg-secondary rounded-sm overflow-hidden border border-border flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>

                        {/* Name */}
                        <TableCell className="py-3">
                          <span className="font-serif text-sm font-semibold text-foreground line-clamp-2">
                            {product.name}
                          </span>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="py-3 hidden md:table-cell">
                          <Badge className="bg-secondary border border-border text-foreground/60 font-display text-[10px] uppercase tracking-wider rounded-sm">
                            {CATEGORY_LABELS[product.category]}
                          </Badge>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="py-3">
                          <span className="font-serif text-sm font-bold text-gold">
                            {formatINR(product.price)}
                          </span>
                        </TableCell>

                        {/* Color */}
                        <TableCell className="py-3 hidden lg:table-cell">
                          <span className="font-sans text-xs text-foreground/60">
                            {product.color}
                          </span>
                        </TableCell>

                        {/* Sizes */}
                        <TableCell className="py-3 hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {product.sizes.map((s) => (
                              <span
                                key={s}
                                className="text-[9px] font-display uppercase tracking-wider text-foreground/50 border border-border/50 px-1 py-0.5"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </TableCell>

                        {/* In Stock */}
                        <TableCell className="py-3 hidden md:table-cell">
                          <span
                            className={`font-display text-[10px] uppercase tracking-wider ${
                              product.inStock
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out"}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`admin.edit_button.${idx + 1}`}
                              onClick={() => setEditProduct(product)}
                              className="w-8 h-8 text-foreground/50 hover:text-gold hover:bg-gold/10 rounded-sm"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`admin.delete_button.${idx + 1}`}
                              onClick={() => setDeleteProduct(product)}
                              className="w-8 h-8 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-sm"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add product modal */}
      <ProductForm
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddProduct}
        mode="add"
      />

      {/* Edit product modal */}
      <ProductForm
        open={editProduct !== null}
        onClose={() => setEditProduct(null)}
        onSubmit={handleEditProduct}
        initialProduct={editProduct}
        mode="edit"
      />

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={deleteProduct !== null}
        productName={deleteProduct?.name ?? ""}
        isDeleting={deleteProductMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteProduct(null)}
      />
    </main>
  );
}
