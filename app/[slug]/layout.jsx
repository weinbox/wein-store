"use client";

import { CartProvider } from "react-use-cart";
import { useParams } from "next/navigation";

export default function StoreLayout({ children }) {
  const params = useParams();
  const slug = params?.slug || "default";

  return (
    <CartProvider id={`cart-${slug}`} key={slug}>
      {children}
    </CartProvider>
  );
}
