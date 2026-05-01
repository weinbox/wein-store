"use client";

import React, { createContext, useContext, useState } from "react";

const SettingContext = createContext(null);

export function useSetting() {
  const ctx = useContext(SettingContext);
  // Provide defaults so components never crash
  return ctx || {
    globalSetting: { default_currency: "د.ع" },
    storeSetting: {},
    storeCustomization: {},
    setGlobalSetting: () => {},
    setStoreSetting: () => {},
    setStoreCustomization: () => {},
  };
}

export function SettingProvider({
  initialStoreSetting,
  initialGlobalSetting,
  initialCustomizationSetting,
  children,
}) {
  const [storeSetting, setStoreSetting] = useState(initialStoreSetting || {});
  const [globalSetting, setGlobalSetting] = useState(initialGlobalSetting || { default_currency: "د.ع" });
  const [storeCustomization, setStoreCustomization] = useState(initialCustomizationSetting || {});

  return (
    <SettingContext.Provider
      value={{
        globalSetting,
        setGlobalSetting,
        storeSetting,
        setStoreSetting,
        storeCustomization,
        setStoreCustomization,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
}
