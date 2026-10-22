import React, { useEffect } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { AdminProvider } from './context/AdminContext';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsapp } from './components/layout/FloatingWhatsapp';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ServiceGiftsPage } from './pages/ServiceGiftsPage';
import { Service3DPage } from './pages/Service3DPage';
import { ServiceDTFPage } from './pages/ServiceDTFPage';
import { ServiceSublimationPage } from './pages/ServiceSublimationPage';
import { ServicePhotoFramesPage } from './pages/ServicePhotoFramesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ServicesPage } from './pages/ServicesPage';
import { SearchPage } from './pages/SearchPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ShippingPage } from './pages/ShippingPage';
import { RefundPage } from './pages/RefundPage';
import { AccountPage } from './pages/AccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AdminDashboard } from './pages/AdminDashboard';

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
      <AdminProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <div className="min-h-screen flex flex-col justify-between bg-giftoria-bg text-giftoria-charcoal-900">
                <ScrollToTop />
                <Header />
                <main className="flex-1">
                  <Switch>
                    <Route path="/" component={HomePage} />
                    <Route path="/products" component={ShopPage} />
                    <Route path="/customized-gifts" component={ServiceGiftsPage} />
                    <Route path="/3d-printing" component={Service3DPage} />
                    <Route path="/dtf-printing" component={ServiceDTFPage} />
                    <Route path="/sublimation-printing" component={ServiceSublimationPage} />
                    <Route path="/photo-frames" component={ServicePhotoFramesPage} />
                    <Route path="/product/:slug" component={ProductDetailPage} />
                    <Route path="/wishlist" component={WishlistPage} />
                    <Route path="/favorites" component={WishlistPage} />
                    <Route path="/cart" component={CartPage} />
                    <Route path="/checkout" component={CheckoutPage} />
                    <Route path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
                    <Route path="/about" component={AboutPage} />
                    <Route path="/contact" component={ContactPage} />
                    <Route path="/services" component={ServicesPage} />
                    <Route path="/search" component={SearchPage} />
                    <Route path="/faq" component={FAQPage} />
                    <Route path="/privacy" component={PrivacyPage} />
                    <Route path="/terms" component={TermsPage} />
                    <Route path="/shipping" component={ShippingPage} />
                    <Route path="/refund-policy" component={RefundPage} />
                    <Route path="/account" component={AccountPage} />
                    <Route path="/orders" component={OrderHistoryPage} />
                    <Route path="/admin" component={AdminDashboard} />
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
      </AdminProvider>
    </ToastProvider>
  );
};

export default App;
