"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function BannerSlider({ banners = [], store }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDiff, setTouchDiff] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);

  const slides = banners.length > 0 ? banners : null;

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!slides || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
  }, [slides]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoPlay]);

  const goTo = (idx) => {
    setCurrent(idx);
    startAutoPlay();
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    setTouchDiff(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    setTouchDiff(e.touches[0].clientX - touchStart);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(touchDiff) > 50 && slides) {
      if (touchDiff > 0) {
        // swipe right — prev
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      } else {
        // swipe left — next
        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }
    setTouchStart(null);
    setTouchDiff(0);
    startAutoPlay();
  };

  // No banners — show default welcome banner
  if (!slides) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-emerald-500 via-emerald-600 to-teal-600 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">
            مرحباً بك في {store.name}
          </h2>
          <p className="text-white/80 text-sm sm:text-base">
            {store.description ||
              "تصفح منتجاتنا واطلب بسهولة — توصيل سريع ودفع عند الاستلام"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Slider container */}
      <div
        ref={sliderRef}
        className="relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(${current * 100}% + ${isDragging ? -touchDiff : 0}px))`,
            transitionDuration: isDragging ? "0ms" : "500ms",
            direction: "ltr",
          }}
        >
          {slides.map((banner, idx) => (
            <div
              key={banner.id || idx}
              className="w-full flex-shrink-0"
              style={{ direction: "rtl" }}
            >
              <div
                className="relative h-40 sm:h-48 overflow-hidden rounded-2xl"
                style={{ backgroundColor: banner.bg_color || "#10b981" }}
              >
                {/* Background image */}
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                )}

                {/* Text overlay */}
                {(banner.title || banner.subtitle) && (
                  <div
                    className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-8 ${
                      banner.image ? "bg-black/30" : ""
                    }`}
                  >
                    {banner.title && (
                      <h2
                        className="text-xl sm:text-2xl font-bold leading-tight"
                        style={{ color: banner.text_color || "#ffffff" }}
                      >
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p
                        className="text-sm sm:text-base mt-1 opacity-85"
                        style={{ color: banner.text_color || "#ffffff" }}
                      >
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 h-2 bg-emerald-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
