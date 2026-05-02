"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider } from "@context/SidebarContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
