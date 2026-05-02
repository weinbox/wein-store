import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { IoArrowBack, IoStorefrontOutline, IoCallOutline, IoLocationOutline } from "react-icons/io5";

const supabase = createClient(
  "https://wlzwtsvvvzlprlmzukks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsend0c3Z2dnpscHJsbXp1a2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzc0MzYsImV4cCI6MjA5Mjg1MzQzNn0.1LlRBp6V2FY2kqtqJ-rFqQTtfnq8b2MeTd8KQRSALBQ"
);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: store } = await supabase
    .from("stores")
    .select("name")
    .eq("slug", slug)
    .single();
  return { title: `من نحن - ${store?.name || "المتجر"}` };
}

export default async function AboutPage({ params }) {
  const { slug } = await params;
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">المتجر غير موجود</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="mx-auto max-w-screen-md px-5 h-14 flex items-center gap-3">
          <Link href={`/${slug}`} className="text-foreground hover:text-primary">
            <IoArrowBack className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">من نحن</h1>
        </div>
      </header>

      <div className="mx-auto max-w-screen-md px-5 py-8 space-y-8">
        {/* Store icon */}
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoStorefrontOutline className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{store.name}</h2>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-2">نبذة عن المتجر</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {store.description || `${store.name} — متجر إلكتروني يقدم أفضل المنتجات بأسعار مناسبة مع خدمة توصيل سريعة ودفع عند الاستلام.`}
          </p>
        </div>

        {/* Info cards */}
        <div className="grid gap-3">
          {store.phone && (
            <a href={`tel:${store.phone}`} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IoCallOutline className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                <p className="text-sm font-medium text-foreground" dir="ltr">{store.phone}</p>
              </div>
            </a>
          )}
          {store.city && (
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IoLocationOutline className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الموقع</p>
                <p className="text-sm font-medium text-foreground">{store.city}</p>
              </div>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="text-center pt-4">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center h-11 px-6 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
