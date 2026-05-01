"use client";

import { useSetting } from "@context/SettingContext";
import { useLanguage } from "@context/LanguageContext";

const useUtilsFunction = () => {
  const { lang } = useLanguage();
  const settingCtx = useSetting();
  const globalSetting = settingCtx?.globalSetting;

  const currency = globalSetting?.default_currency || "د.ع";

  const getNumber = (value = 0) => {
    return Number(parseFloat(value || 0).toFixed(2));
  };

  const getNumberTwo = (value = 0) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const formatPrice = (value, customCurrency) => {
    const num = Math.round(Number(parseFloat(value || 0)));
    const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const sym = customCurrency || currency;
    return `${formatted} ${sym}`;
  };

  const formatNumber = (value) => {
    const num = Number(parseFloat(value || 0).toFixed(2));
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const showTimeFormat = () => "";
  const showDateFormat = () => "";
  const showDateTimeFormat = () => "";

  // For translation: if data is an object with lang keys, pick the right one.
  // If data is a plain string, return it directly.
  const showingTranslateValue = (data) => {
    if (data === undefined || data === null) return "";
    if (typeof data === "string") return data;
    if (typeof data === "object" && Object.keys(data).includes(lang)) return data[lang];
    if (typeof data === "object" && data?.en) return data.en;
    if (typeof data === "object" && data?.ar) return data.ar;
    return String(data);
  };

  const showingImage = (data) => {
    return data !== undefined && data;
  };

  const showingUrl = (data) => {
    return data !== undefined ? data : "#";
  };

  return {
    lang,
    currency,
    getNumber,
    getNumberTwo,
    formatPrice,
    formatNumber,
    showTimeFormat,
    showDateFormat,
    showingImage,
    showingUrl,
    showDateTimeFormat,
    showingTranslateValue,
  };
};

export default useUtilsFunction;
