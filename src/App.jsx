import { BrowserRouter, Route, Routes } from "react-router-dom";

import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Home from "@/pages/Home";
import OrderDetails from "@/pages/OrderDetails";
import OrderSuccess from "@/pages/OrderSuccess";
import Orders from "@/pages/Orders";
import ProductDetails from "@/pages/ProductDetails";
import Layout from "./layout/Layout";
import Category from "./pages/Category";
import SellerPage from "./pages/SellerPage";
import Seller from "./pages/Seller";
import { setAuthToken } from "./lib/auth";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params, "params");
    const token = params.get("token");

    if (token) {
      setAuthToken(token);

      params.delete("token");

      const cleanUrl = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }${window.location.hash}`;

      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  //   useEffect(() => {
  //   console.log("FULL URL:", window.location.href);
  //   console.log("SEARCH:", window.location.search);

  //   const params = new URLSearchParams(window.location.search);

  //   console.log("PARAMS:", [...params.entries()]);

  //   const token = params.get("token");

  //   console.log("TOKEN:", token);

  //   if (token) {
  //     setAuthToken(token);

  //     params.delete("token");

  //     const cleanUrl = `${window.location.pathname}${
  //       params.toString() ? `?${params.toString()}` : ""
  //     }${window.location.hash}`;

  //     window.history.replaceState({}, "", cleanUrl);
  //   }
  // }, []);

  return (
    <BrowserRouter>
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
          <Route path="/seller/:seller_id" element={<SellerPage />} />
          <Route path="/seller" element={<Seller />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
