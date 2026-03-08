import { HeroSection } from "../components/shop/HeroSection";
import { ProductGrid } from "../components/shop/ProductGrid";
import { useProducts } from "../hooks/useQueries";

export function HomePage() {
  const { data: products = [], isLoading } = useProducts();

  return (
    <main>
      <HeroSection />
      <div className="bg-background">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </main>
  );
}
