"use client";

import { createContext, useContext } from "react";

const StoreContext = createContext({ storeSlug: "" });

export const StoreProvider = ({ slug, children }) => (
  <StoreContext.Provider value={{ storeSlug: slug }}>
    {children}
  </StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
