"use client";

import { useState } from "react";
import { useCart } from "react-use-cart";
import {
  IoArrowBack,
  IoAdd,
  IoRemove,
  IoBagHandleOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notifySuccess } from "@utils/toast";

const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function ProductDetailClient({ store, product }) {
  const { addItem, items, updateItemQuantity, totalItems, cartTotal } = useCart();
  const [qty, setQty] = useState(1);

  const inCart = items.find((i) => i.id === product.id);
  const price = product.prices?.price || product.price || 0;
  const originalPrice = product.prices?.originalPrice || price;
  const hasDiscount = originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    const { variants, categories, description, campaign, ...cartItem } = product;
    addItem(cartItem, qty);
    notifySuccess(`تمت الإضافة للسلة`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="max-w-screen-lg mx-auto px-4 flex items-center justify-between h-14">
          <Link href={`/${store.slug}`} className="text-foreground">
            <IoArrowBack className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
            {product.title}
          </h1>
          <Link href={`/${store.slug}/checkout`} className="relative text-foreground">
            <IoBagHandleOutline className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto">
        {/* Product Image */}
        <div className="w-full bg-muted flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          {product.image?.[0] ? (
            <img
              src={product.image[0]}
              alt={product.title}
              className="w-full max-h-[450px] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mb-2" />
              <span className="text-sm">لا توجد صورة</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-5 space-y-4">
          {/* Title & Price */}
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {product.title}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-emerald-600">
                {fmt(price)} د.ع
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {fmt(originalPrice)} د.ع
                  </span>
                  <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                    -{discountPct}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                متوفر
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                غير متوفر
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">الوصف</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Delivery info */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-3">
            <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              توصيل {fmt(store.delivery_price || 0)} د.ع — الدفع عند الاستلام
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              >
                <IoRemove className="w-4 h-4" />
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-foreground">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                disabled={qty >= product.stock}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30"
              >
                <IoAdd className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock < 1}
              className="flex-1 h-11 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <IoBagHandleOutline className="w-4 h-4" />
              أضف للسلة — {fmt(price * qty)} د.ع
            </button>
          </div>
        </div>
      </div>

      {/* Bottom sticky bar — go to checkout if cart has items */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 z-30">
          <div className="max-w-screen-lg mx-auto">
            <Link
              href={`/${store.slug}/checkout`}
              className="w-full h-12 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <IoBagHandleOutline className="w-4 h-4" />
              عرض السلة ({totalItems}) — {fmt(cartTotal)} د.ع
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
