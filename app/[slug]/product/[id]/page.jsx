import ProductDetailClient from "./ProductDetailClient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wlzwtsvvvzlprlmzukks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsend0c3Z2dnpscHJsbXp1a2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzc0MzYsImV4cCI6MjA5Mjg1MzQzNn0.1LlRBp6V2FY2kqtqJ-rFqQTtfnq8b2MeTd8KQRSALBQ"
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .single();
  return { title: product?.name || "المنتج" };
}

export default async function ProductPage({ params }) {
  const { slug, id } = await params;

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">المتجر غير موجود</p>
      </div>
    );
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("store_id", store.id)
    .eq("is_active", true)
    .single();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">المنتج غير موجود</p>
      </div>
    );
  }

  // Convert to KachaBazar shape
  const kbProduct = {
    _id: String(product.id),
    id: String(product.id),
    slug: String(product.id),
    title: product.name,
    name: product.name,
    image: product.image ? [product.image] : [],
    prices: {
      price: product.price || 0,
      originalPrice: product.original_price || product.price || 0,
    },
    price: product.price || 0,
    stock: product.stock ?? 999,
    quantity: product.stock ?? 999,
    isCombination: false,
    variants: [],
    categories: [],
    description: product.description || "",
    average_rating: 0,
    total_reviews: 0,
    campaign: null,
  };

  return <ProductDetailClient store={store} product={kbProduct} />;
}
