export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center px-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">منصة المتاجر</h1>
        <p className="text-muted-foreground mb-6">للوصول لمتجرك، استخدم الرابط: <code className="bg-muted px-2 py-1 rounded text-sm">/اسم-المتجر</code></p>
      </div>
    </div>
  );
}
