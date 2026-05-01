"use client";

import { CartProvider } from "react-use-cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider } from "@context/SidebarContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SidebarProvider>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SidebarProvider>
    </CartProvider>
  );
}
