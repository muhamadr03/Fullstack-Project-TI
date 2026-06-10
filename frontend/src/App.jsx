// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import NavbarCustomer from "./components/layout/NavbarCustomer";
import AdminLayout from "./components/admin/AdminLayout";
import { Outlet } from "react-router-dom";
import WhatsAppWidget from "./components/ui/WhatsAppWidget";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Customer (placeholder — akan diisi Sprint berikutnya)
import HomePage from "./pages/public/HomePage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrdersPage from "./pages/customer/OrdersPage";
import ProfilePage from "./pages/customer/ProfilePage";
import WishlistPage from "./pages/customer/WishlistPage";

// Admin (placeholder — akan diisi Sprint berikutnya)
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCategories from "./pages/admin/ManageCategories";

import Footer from "./components/layout/Footer";

const CustomerLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <NavbarCustomer />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppWidget />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer & Public Routes wrapped in CustomerLayout */}
            <Route element={<CustomerLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <PrivateRoute>
                    <WishlistPage />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Admin Routes wrapped in AdminLayout */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ManageProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <ManageCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <ManageOrders />
                  </AdminRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
