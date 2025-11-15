import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Shield, Star, TrendingUp, Zap } from "lucide-react";
import { SiAmazon, SiTiktok } from "react-icons/si";

export default function Landing() {
  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "تحليل التقييمات الحقيقية",
      description: "نكشف المراجعات المزيفة ونحلل التقييمات الحقيقية باستخدام الذكاء الاصطناعي",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "كشف الإعلانات المبالغ فيها",
      description: "نتحقق من صحة ادعاءات البائعين ونحذرك من الإعلانات الكاذبة",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "نسبة ثقة واضحة",
      description: "تقييم شامل من 0-100 مع توصيات واضحة للشراء أو التجنب",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "نظام فحوص شهري",
      description: "خطط مرنة تناسب احتياجاتك مع تجديد شهري للفحوص",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: "€3.99",
      checks: "10 فحوص",
      duration: "شهرياً",
      features: ["10 فحوص شهرياً", "تحليل AI كامل", "كشف المراجعات المزيفة", "دعم فني"],
    },
    {
      name: "Standard",
      price: "€6.99",
      checks: "30 فحص",
      duration: "شهرياً",
      popular: true,
      features: [
        "30 فحص شهرياً",
        "تحليل AI متقدم",
        "اقتراح بدائل أفضل",
        "تتبع الأسعار",
        "دعم فني أولوية",
      ],
    },
    {
      name: "Pro",
      price: "€12.99",
      checks: "100 فحص",
      duration: "شهرياً",
      features: [
        "100 فحص شهرياً",
        "تحليل AI احترافي",
        "تقارير مفصلة PDF",
        "مقارنة المنتجات",
        "دعم فني VIP",
        "وصول مبكر للمميزات",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              CheckWise
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#6B7280] hover:text-[#111827] transition-colors">
              كيف يعمل؟
            </a>
            <a href="#pricing" className="text-[#6B7280] hover:text-[#111827] transition-colors">
              الأسعار
            </a>
            <a
              href="/api/login"
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
              data-testid="link-login"
            >
              تسجيل الدخول
            </a>
            <Button
              onClick={() => (window.location.href = "/api/login")}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
              data-testid="button-start-free"
            >
              ابدأ مجاناً
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] mb-6 leading-tight">
                افحص المنتج
                <br />
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                  قبل ما تشتريه
                </span>
              </h1>
              <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
                CheckWise يحلل التقييمات والإعلانات ويعطيك نسبة ثقة بالمنتج قبل ما تدفع. وفّر فلوسك وتجنب
                المنتجات المزيفة!
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/api/login")}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90 text-lg px-8"
                  data-testid="button-hero-start"
                >
                  جرّب الفحص الأول مجاناً
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2"
                  data-testid="button-hero-demo"
                >
                  شاهد مثال
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16A34A]" />
                  <span>3 فحوص مجانية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#16A34A]" />
                  <span>بدون بطاقة ائتمان</span>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-white rounded-3xl shadow-xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white text-4xl font-bold mb-4">
                    82%
                  </div>
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">نسبة الثقة</h3>
                  <p className="text-[#16A34A] font-semibold text-lg">ننصح بالشراء 👍</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#16A34A]/10 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-[#16A34A] mb-1">4.8★</div>
                    <div className="text-sm text-[#6B7280]">تقييم حقيقي</div>
                  </div>
                  <div className="bg-[#3B82F6]/10 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-[#3B82F6] mb-1">2,341</div>
                    <div className="text-sm text-[#6B7280]">مراجعة</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6B7280]">جودة ممتازة حسب المراجعات</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6B7280]">سعر مناسب مقارنة بالبدائل</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6B7280]">بائع موثوق مع تقييمات عالية</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t">
                  <SiAmazon className="w-8 h-8 text-[#FF9900]" />
                  <div className="w-8 h-8 rounded-lg bg-[#000000] flex items-center justify-center">
                    <SiTiktok className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[#6B7280] text-sm">+ المزيد</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">كيف يساعدك CheckWise؟</h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              نوفر لك أدوات ذكية لفحص المنتجات قبل الشراء وحمايتك من الإعلانات المضللة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 rounded-3xl hover:shadow-lg transition-all hover-elevate active-elevate-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 flex items-center justify-center text-[#3B82F6] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{feature.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">اختر الخطة المناسبة لك</h2>
            <p className="text-xl text-[#6B7280]">ابدأ بـ 3 فحوص مجانية، ثم اختر خطتك المفضلة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 rounded-3xl relative ${
                  plan.popular
                    ? "border-2 border-[#3B82F6] shadow-xl scale-105"
                    : "hover:shadow-lg hover-elevate"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شيوعاً
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold text-[#111827]">{plan.price}</span>
                    <span className="text-[#6B7280]">/ {plan.duration}</span>
                  </div>
                  <p className="text-[#6B7280]">{plan.checks}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7280]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  اختر {plan.name}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                  CheckWise
                </span>
              </div>
              <p className="text-[#6B7280] text-sm">افحص المنتج قبل ما تشتريه</p>
            </div>

            <div>
              <h4 className="font-semibold text-[#111827] mb-4">المنتج</h4>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                <li>
                  <a href="#features" className="hover:text-[#111827] transition-colors">
                    المميزات
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#111827] transition-colors">
                    الأسعار
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#111827] mb-4">الشركة</h4>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                <li>
                  <a href="#" className="hover:text-[#111827] transition-colors">
                    عن CheckWise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#111827] transition-colors">
                    اتصل بنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#111827] mb-4">قانوني</h4>
              <ul className="space-y-2 text-[#6B7280] text-sm">
                <li>
                  <a href="#" className="hover:text-[#111827] transition-colors">
                    الشروط والأحكام
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#111827] transition-colors">
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-[#6B7280] text-sm">
            © 2025 CheckWise. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
