import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import AdminPage from "@/pages/AdminPage";
import CartPage from "@/pages/CartPage";
import Home from "@/pages/Home";
import ProductPage from "@/pages/ProductPage";
import ShopPage from "@/pages/ShopPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/products/:slug">
        {params => <ProductPage slug={params.slug} />}
      </Route>
      <Route path="/cart" component={CartPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
