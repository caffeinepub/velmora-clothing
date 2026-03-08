import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../backend";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import type { Product } from "../types";
import { useActor } from "./useActor";

// ─── Products ───────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS;
      try {
        const results = await actor.getProducts();
        if (!results || results.length === 0) return SAMPLE_PRODUCTS;
        return results as Product[];
      } catch {
        return SAMPLE_PRODUCTS;
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS.filter((p) => p.category === category);
      try {
        const results = await actor.getProductsByCategory(category);
        if (!results || results.length === 0)
          return SAMPLE_PRODUCTS.filter((p) => p.category === category);
        return results as Product[];
      } catch {
        return SAMPLE_PRODUCTS.filter((p) => p.category === category);
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not connected");
      await actor.addProduct(product);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      product,
    }: {
      id: bigint;
      product: Product;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateProduct(id, product);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteProduct(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
