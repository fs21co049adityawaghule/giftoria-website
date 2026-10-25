import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsapp } from './components/layout/FloatingWhatsapp';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SearchPage } from './pages/SearchPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ShippingPage } from './pages/ShippingPage';
import { RefundPage } from './pages/RefundPage';
import { AccountPage } from './pages/AccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';

// Helper component to scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <div className="min-h-screen flex flex-col justify-between bg-[#F8FCFF] text-slate-900 selection:bg-sky-200 selection:text-sky-900 font-sans">
              <ScrollToTop />
              <Header />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/products" component={ShopPage} />
                  <Route path="/flowers" component={ShopPage} />
                  <Route path="/cakes" component={ShopPage} />
                  <Route path="/plants" component={ShopPage} />
                  <Route path="/personalized-gifts" component={ShopPage} />
                  <Route path="/gift-hampers" component={ShopPage} />
                  <Route path="/chocolates" component={ShopPage} />
                  <Route path="/jewellery" component={ShopPage} />
                  <Route path="/home-living" component={ShopPage} />
                  <Route path="/birthday-gifts" component={ShopPage} />
                  <Route path="/anniversary-gifts" component={ShopPage} />
                  
                  {/* Backward compatibility routes */}
                  <Route path="/customized-gifts" component={ShopPage} />
                  <Route path="/3d-printing" component={ShopPage} />
                  <Route path="/dtf-printing" component={ShopPage} />
                  <Route path="/sublimation-printing" component={ShopPage} />
                  <Route path="/photo-frames" component={ShopPage} />
                  <Route path="/services" component={ShopPage} />
                  
                  {/* Core e-commerce routes */}
                  <Route path="/product/:slug" component={ProductDetailPage} />
                  <Route path="/wishlist" component={WishlistPage} />
                  <Route path="/favorites" component={WishlistPage} />
                  <Route path="/cart" component={CartPage} />
                  <Route path="/checkout" component={CheckoutPage} />
                  <Route path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
                  <Route path="/about" component={AboutPage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route path="/search" component={SearchPage} />
                  <Route path="/faq" component={FAQPage} />
                  <Route path="/privacy" component={PrivacyPage} />
                  <Route path="/terms" component={TermsPage} />
                  <Route path="/shipping" component={ShippingPage} />
                  <Route path="/refund-policy" component={RefundPage} />
                  <Route path="/account" component={AccountPage} />
                  <Route path="/orders" component={OrderHistoryPage} />

                  {/* Fallback route */}
                  <Route>
                    <HomePage />
                  </Route>
                </Switch>
              </main>
              <Footer />
              <MobileNav />
              <FloatingWhatsapp />
            </div>
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
};

export default App;
