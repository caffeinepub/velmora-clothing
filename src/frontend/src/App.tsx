import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CartDrawer } from "./components/shop/CartDrawer";
import { Footer } from "./components/shop/Footer";
import { Navbar } from "./components/shop/Navbar";
import { CartProvider } from "./context/CartContext";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";

// ── Root layout ──────────────────────────────────────────────────────────────
function RootLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 pt-16">
          <Outlet />
        </div>
        <Footer />
      </div>
      <CartDrawer />
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "bg-card border border-gold/20 text-foreground font-sans rounded-sm shadow-2xl",
            title: "font-serif text-foreground",
            description: "text-foreground/60 text-sm",
            actionButton:
              "bg-gold text-black font-display text-[10px] uppercase tracking-wider rounded-sm hover:bg-gold-bright",
            cancelButton: "bg-secondary text-foreground/60 rounded-sm",
          },
        }}
      />
    </CartProvider>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
