"use client";

import { createContext, useState, useContext } from "react";

const LanguageContext = createContext({ lang: "ar", setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("ar");

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context || { lang: "ar", setLang: () => {} };
};
