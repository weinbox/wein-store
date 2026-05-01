import StoreClient from "./StoreClient";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wlzwtsvvvzlprlmzukks.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsend0c3Z2dnpscHJsbXp1a2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzc0MzYsImV4cCI6MjA5Mjg1MzQzNn0.1LlRBp6V2FY2kqtqJ-rFqQTtfnq8b2MeTd8KQRSALBQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Convert a Supabase product row into the shape KachaBazar components expect.
 */
function toKBProduct(p) {
  return {
    _id: String(p.id),
    slug: p.slug || String(p.id),
    title: p.name, // showingTranslateValue handles strings
    image: p.image ? [p.image] : [],
    prices: {
      price: p.price || 0,
      originalPrice: p.original_price || p.price || 0,
    },
    stock: p.stock ?? 999,
    isCombination: false,
    variants: [],
    categories: [],
    description: p.description || "",
    average_rating: 0,
    total_reviews: 0,
    campaign: null,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: store } = await supabase
    .from("stores")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return {
    title: store?.name || "المتجر",
    description: store?.description || "",
  };
}

export default async function StorePage({ params }) {
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
        <div className="text-center px-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            المتجر غير موجود
          </h2>
          <p className="text-sm text-muted-foreground">
            تأكد من الرابط وحاول مرة أخرى
          </p>
        </div>
      </div>
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const kbProducts = (products || []).map(toKBProduct);

  return <StoreClient store={store} products={kbProducts} />;
}
