"use client";

import { useState, useMemo, useRef } from "react";
import { useCart } from "react-use-cart";
import { IoSearchOutline } from "react-icons/io5";
import { IoBagHandleOutline } from "react-icons/io5";
import { Truck, CreditCard, Shield, ShoppingBag, Search } from "lucide-react";

import Link from "next/link";
import ProductCard from "@components/product/ProductCard";
import StickyCart from "@components/cart/StickyCart";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { StoreProvider } from "@context/StoreContext";
import MobileBottomNav from "@components/store/MobileBottomNav";

const formatNum = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function StoreClient({ store, products }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, cartTotal } = useCart();
  const { formatPrice } = useUtilsFunction();
  const searchRef = useRef(null);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.trim().toLowerCase();
    return products.filter(
      (p) =>
        (typeof p.title === "string" && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <StoreProvider slug={store.slug}>
    <div className="min-h-screen bg-background">
      {/* ── KachaBazar StickyCart (original component) ── */}
      <StickyCart />

      {/* ══════════════════════════════════════════════
          HEADER — Store info + Search
      ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-20 bg-background border-b border-border shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-base font-semibold text-foreground leading-tight">
                  {store.name}
                </h1>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> توصيل{" "}
                    {formatNum(store.delivery_price || 0)} د.ع
                  </span>
                  <span className="opacity-40">•</span>
                  <span>الدفع عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* Mobile cart button — links to checkout */}
            <Link href={`/${store.slug}/checkout`} className="lg:hidden flex items-center">
              <div className="relative">
                <IoBagHandleOutline className="text-2xl text-emerald-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -left-2 min-w-[20px] h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative">
              <IoSearchOutline className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="ابحث في المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pr-11 pl-4 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          WELCOME BANNER
      ══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-4">
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
              {store.description || "تصفح منتجاتنا واطلب بسهولة — توصيل سريع ودفع عند الاستلام"}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <Truck className="w-3.5 h-3.5" />
                توصيل {formatNum(store.delivery_price || 0)} د.ع
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <CreditCard className="w-3.5 h-3.5" />
                الدفع عند الاستلام
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STORE INFO BADGES
      ══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-4">
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            {
              icon: Truck,
              title: "توصيل سريع",
              sub: `${formatNum(store.delivery_price || 0)} د.ع`,
              color: "#10b981",
              bgc: "#ecfdf5",
            },
            {
              icon: CreditCard,
              title: "الدفع عند الاستلام",
              sub: "كاش",
              color: "#f59e0b",
              bgc: "#fffbeb",
            },
            {
              icon: Shield,
              title: "ضمان الجودة",
              sub: "منتجات أصلية",
              color: "#8b5cf6",
              bgc: "#f5f3ff",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-3 flex items-center gap-2.5 border border-border hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: b.bgc }}
              >
                <b.icon className="w-4 h-4" style={{ color: b.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-foreground truncate">
                  {b.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {b.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PRODUCTS — Using KachaBazar ProductCard (original)
      ══════════════════════════════════════════════ */}
      <div className="bg-background lg:py-10 py-6">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">المنتجات</h2>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} منتج
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                {searchQuery ? "لا توجد نتائج" : "لا توجد منتجات بعد"}
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                جرّب البحث بكلمات مختلفة
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  attributes={[]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom sticky cart bar (when items in cart) ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 bg-background border-t border-border p-3 z-30">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <Link
              href={`/${store.slug}/checkout`}
              className="w-full h-12 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <IoBagHandleOutline className="w-4 h-4" />
              عرض السلة ({totalItems}) — {formatPrice(cartTotal)}
            </Link>
          </div>
        </div>
      )}

      {/* ── Mobile bottom navigation ── */}
      <MobileBottomNav onSearchFocus={() => searchRef.current?.focus()} />

      {/* spacer for mobile bottom nav */}
      <div className="h-14 lg:hidden" />
    </div>
    </StoreProvider>
  );
}
