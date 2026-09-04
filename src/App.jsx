import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MobileNumberProvider } from "@/context/MobileNumberContext";
import { OrderProvider } from "@/context/OrderContext";

import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Home from "@/pages/Home";
import OrderDetails from "@/pages/OrderDetails";
import OrderSuccess from "@/pages/OrderSuccess";
import Orders from "@/pages/Orders";
import ProductDetails from "@/pages/ProductDetails";
import Wishlist from "@/pages/Wishlist";
import ScrollToTop from "./components/common/ScrollToTop";
import AddProduct from "./components/products/AddProduct";
import Layout from "./layout/Layout";
import Category from "./pages/Category";
import Seller from "./pages/Seller";
import SellerOrders from "./pages/SellerOrders";
import SellerPage from "./pages/SellerPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <MobileNumberProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/seller/:seller_id" element={<SellerPage />} />
                  <Route path="/seller" element={<Seller />} />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route path="/seller/add-product" element={<AddProduct />} />
                </Route>
              </Routes>
            </MobileNumberProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
