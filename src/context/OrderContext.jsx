import { createContext, useContext, useState } from "react";
const OrderContext = createContext(null);
export function OrderProvider({ children }) {
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("farmers_marketplace_last_order") || "null",
      );
    } catch {
      return null;
    }
  });
  const saveOrder = (order) => {
    setLastOrder(order);
    localStorage.setItem(
      "farmers_marketplace_last_order",
      JSON.stringify(order),
    );
  };
  return (
    <OrderContext.Provider value={{ lastOrder, saveOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
export const useOrder = () => useContext(OrderContext);
