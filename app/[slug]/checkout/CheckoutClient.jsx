"use client";

import { useState } from "react";
import { useCart } from "react-use-cart";
import { createClient } from "@supabase/supabase-js";
import {
  IoArrowBack,
  IoClose,
  IoAdd,
  IoRemove,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  "https://wlzwtsvvvzlprlmzukks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsend0c3Z2dnpscHJsbXp1a2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzc0MzYsImV4cCI6MjA5Mjg1MzQzNn0.1LlRBp6V2FY2kqtqJ-rFqQTtfnq8b2MeTd8KQRSALBQ"
);

const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function CheckoutClient({ store }) {
  const { items, cartTotal, emptyCart, removeItem, updateItemQuantity } =
    useCart();
  const [step, setStep] = useState("cart");
  const [submitting, setSubmitting] = useState(false);

  const [custName, setCustName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null); // { code, discount_type, discount_value }
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const delivery = store.delivery_price || 0;

  const couponDiscount = couponApplied
    ? couponApplied.discount_type === "percent"
      ? Math.round((cartTotal * couponApplied.discount_value) / 100)
      : couponApplied.discount_value
    : 0;

  const grand = Math.max(0, cartTotal - couponDiscount) + delivery;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const { data, error } = await supabase
        .from("store_coupons")
        .select("*")
        .eq("store_id", store.id)
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setCouponError("كوبون غير صالح");
        setCouponApplied(null);
        return;
      }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError("الكوبون منتهي الصلاحية");
        setCouponApplied(null);
        return;
      }
      if (data.max_uses > 0 && data.used_count >= data.max_uses) {
        setCouponError("الكوبون استُنفد");
        setCouponApplied(null);
        return;
      }
      if (data.min_order > 0 && cartTotal < data.min_order) {
        setCouponError(`الحد الأدنى للطلب ${fmt(data.min_order)} د.ع`);
        setCouponApplied(null);
        return;
      }
      setCouponApplied(data);
      setCouponError("");
    } catch {
      setCouponError("حدث خطأ");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setSubmitting(true);
    try {
      const orderData = {
          store_id: store.id,
          customer_name: custName,
          customer_phone: phone,
          city,
          region,
          address,
          total: grand,
          delivery_price: delivery,
          status: "pending",
        };
      if (couponApplied) {
        orderData.coupon_code = couponApplied.code;
        orderData.coupon_discount = couponDiscount;
      }

      const { data: order, error } = await supabase
        .from("store_orders")
        .insert(orderData)
        .select()
        .single();
      if (error) throw error;

      const orderItems = items.map((it) => ({
        order_id: order.id,
        product_id: it._id || null,
        product_name: typeof it.title === "string" ? it.title : it.name || "منتج",
        price: it.price,
        quantity: it.quantity,
      }));
      await supabase.from("store_order_items").insert(orderItems);

      // Increment coupon used_count
      if (couponApplied) {
        await supabase
          .from("store_coupons")
          .update({ used_count: couponApplied.used_count + 1 })
          .eq("id", couponApplied.id);
      }

      emptyCart();
      setStep("success");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── SUCCESS ── */
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoCheckmarkCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            سيتم التواصل معك قريباً لتأكيد الطلب
          </p>
          <Link
            href={`/${store.slug}`}
            className="inline-flex items-center justify-center h-11 px-6 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  if (step === "form") {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 flex items-center h-14">
            <button onClick={() => setStep("cart")} className="text-foreground">
              <IoArrowBack className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center text-base font-semibold text-foreground">
              بيانات التوصيل
            </h1>
            <div className="w-5" />
          </div>
        </header>
        <form onSubmit={handleSubmit} className="max-w-screen-lg mx-auto px-4 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">الاسم الكامل *</label>
            <input
              required
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full h-11 px-4 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">رقم الهاتف *</label>
            <input
              required
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500 text-left"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">المحافظة</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-4 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">المنطقة</label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-11 px-4 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">العنوان التفصيلي</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Order summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-2 mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>المجموع الفرعي</span>
              <span>{fmt(cartTotal)} د.ع</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>التوصيل</span>
              <span>{fmt(delivery)} د.ع</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>الإجمالي</span>
              <span>{fmt(grand)} د.ع</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "جاري الإرسال..." : `تأكيد الطلب — ${fmt(grand)} د.ع`}
          </button>
        </form>
      </div>
    );
  }

  /* ── CART VIEW ── */
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="max-w-screen-lg mx-auto px-4 flex items-center h-14">
          <Link href={`/${store.slug}`} className="text-foreground">
            <IoArrowBack className="w-5 h-5" />
          </Link>
          <h1 className="flex-1 text-center text-base font-semibold text-foreground">
            سلة التسوق
          </h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">السلة فارغة</h3>
            <Link
              href={`/${store.slug}`}
              className="mt-4 h-10 px-5 bg-emerald-500 text-white rounded-xl text-sm font-medium inline-flex items-center hover:bg-emerald-600 transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
                >
                  {item.image?.[0] ? (
                    <img
                      src={item.image[0]}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {typeof item.title === "string" ? item.title : item.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fmt(item.price)} د.ع
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateItemQuantity(item.id, item.quantity - 1)
                            : removeItem(item.id)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
                      >
                        <IoRemove className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
                      >
                        <IoAdd className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      {fmt(item.price * item.quantity)} د.ع
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-1 text-red-400 hover:text-red-500"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-4">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700">كوبون: {couponApplied.code}</span>
                    <span className="text-xs text-emerald-600 mr-2">
                      (-{couponApplied.discount_type === "percent" ? `${couponApplied.discount_value}%` : `${fmt(couponApplied.discount_value)} د.ع`})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-400 hover:text-red-500">
                    <IoClose className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="كود الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 h-10 px-3 bg-muted border border-border rounded-xl text-sm outline-none focus:border-emerald-500 text-center"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="h-10 px-4 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "تطبيق"}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>المجموع الفرعي ({items.length} منتج)</span>
                <span>{fmt(cartTotal)} د.ع</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>خصم الكوبون</span>
                  <span>-{fmt(couponDiscount)} د.ع</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>التوصيل</span>
                <span>{fmt(delivery)} د.ع</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span>الإجمالي</span>
                <span>{fmt(grand)} د.ع</span>
              </div>
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full h-12 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              متابعة الطلب — {fmt(grand)} د.ع
            </button>
          </>
        )}
      </div>
    </div>
  );
}
