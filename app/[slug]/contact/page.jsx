import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { IoArrowBack, IoCallOutline, IoLogoWhatsapp, IoLocationOutline, IoTimeOutline } from "react-icons/io5";

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
  return { title: `اتصل بنا - ${store?.name || "المتجر"}` };
}

export default async function ContactPage({ params }) {
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

  const phone = store.phone || "";
  const whatsapp = phone.replace(/^0/, "964");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="mx-auto max-w-screen-md px-4 h-14 flex items-center gap-3">
          <Link href={`/${slug}`} className="text-foreground hover:text-primary">
            <IoArrowBack className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">اتصل بنا</h1>
        </div>
      </header>

      <div className="mx-auto max-w-screen-md px-4 py-8 space-y-4">
        <h2 className="text-xl font-bold text-foreground text-center mb-6">
          تواصل مع {store.name}
        </h2>

        {/* Phone */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-emerald-300 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IoCallOutline className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">اتصل بنا</p>
              <p className="text-xs text-muted-foreground" dir="ltr">{phone}</p>
            </div>
          </a>
        )}

        {/* WhatsApp */}
        {phone && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-green-300 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IoLogoWhatsapp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">واتساب</p>
              <p className="text-xs text-muted-foreground">راسلنا على واتساب</p>
            </div>
          </a>
        )}

        {/* Location */}
        {store.city && (
          <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IoLocationOutline className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">الموقع</p>
              <p className="text-xs text-muted-foreground">{store.city}</p>
            </div>
          </div>
        )}

        {/* Working hours */}
        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <IoTimeOutline className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">أوقات العمل</p>
            <p className="text-xs text-muted-foreground">يومياً من 9 صباحاً - 10 مساءً</p>
          </div>
        </div>

        {/* Back */}
        <div className="text-center pt-6">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center h-11 px-6 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
