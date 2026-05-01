import CheckoutClient from "./CheckoutClient";
import { createClient } from "@supabase/supabase-js";

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
  return { title: `إتمام الطلب - ${store?.name || "المتجر"}` };
}

export default async function CheckoutPage({ params }) {
  const { slug } = await params;
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

  return <CheckoutClient store={store} />;
}
