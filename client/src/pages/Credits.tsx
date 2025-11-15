import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Package, Check, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { PLANS } from "@shared/schema";

export default function Credits() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "يجب تسجيل الدخول أولاً...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const typedUser = user as User;
  const progressPercentage = (typedUser.creditsRemaining / typedUser.creditsTotal) * 100;

  const handleSelectPlan = (planKey: string) => {
    toast({
      title: "جاري التحويل...",
      description: `سيتم توجيهك لإتمام عملية الدفع لخطة ${planKey}`,
    });
    // In real implementation, this would redirect to Stripe checkout
    setTimeout(() => {
      toast({
        title: "قريباً!",
        description: "نظام الدفع سيكون متاحاً قريباً",
        variant: "destructive",
      });
    }, 1000);
  };

  const handleBuyCredits = (amount: number) => {
    toast({
      title: "جاري التحويل...",
      description: `سيتم توجيهك لشراء ${amount} فحص إضافي`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              CheckWise
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          رجوع إلى الرئيسية
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">الرصيد والخطط</h1>
          <p className="text-[#6B7280]">اختر الخطة المناسبة لك أو اشترِ فحوص إضافية</p>
        </div>

        {/* Current Plan */}
        <Card className="p-8 rounded-3xl mb-12 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-4">
                الخطة الحالية: {PLANS[typedUser.planType as keyof typeof PLANS].name}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#6B7280]">الرصيد المتبقي</span>
                    <span className="font-bold text-[#111827]">
                      {typedUser.creditsRemaining} / {typedUser.creditsTotal}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                {typedUser.planType !== "free" && (
                  <p className="text-sm text-[#6B7280]">
                    يتجدد الرصيد في: {typedUser.creditsResetDate ? new Date(typedUser.creditsResetDate).toLocaleDateString("ar-SA") : "نهاية الشهر"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#111827] mb-2">
                  {typedUser.creditsRemaining}
                </div>
                <p className="text-[#6B7280]">فحوص متبقية</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">الخطط المتاحة</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLANS).filter(([key]) => key !== "free").map(([key, plan]) => (
              <Card
                key={key}
                className={`p-6 rounded-3xl relative ${
                  plan.popular
                    ? "border-2 border-[#3B82F6] shadow-xl scale-105"
                    : "hover-elevate"
                } ${typedUser.planType === key ? "bg-[#3B82F6]/5" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white">
                      الأكثر شيوعاً
                    </Badge>
                  </div>
                )}
                {typedUser.planType === key && (
                  <div className="absolute -top-4 left-4">
                    <Badge className="bg-[#16A34A] text-white">الخطة الحالية</Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#111827] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold text-[#111827]">€{plan.price}</span>
                    <span className="text-[#6B7280]">/ {plan.duration}</span>
                  </div>
                  <p className="text-[#6B7280]">{plan.credits} فحص شهرياً</p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">تحليل AI كامل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">اقتراح بدائل أفضل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">دعم فني</span>
                  </li>
                  {plan.popular && (
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7280]">تقارير مفصلة</span>
                    </li>
                  )}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  disabled={typedUser.planType === key}
                  onClick={() => handleSelectPlan(key)}
                  data-testid={`button-plan-${key}`}
                >
                  {typedUser.planType === key ? "الخطة الحالية" : `اختر ${plan.name}`}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Buy Additional Credits */}
        <Card className="p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">اشترِ فحوص إضافية</h2>
          </div>
          <p className="text-[#6B7280] mb-6">
            هل تحتاج المزيد من الفحوص؟ اشترِ فحوص إضافية بدون الترقية إلى خطة أعلى
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 rounded-2xl hover-elevate active-elevate-2">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[#111827] mb-1">10 فحوص</div>
                <div className="text-2xl font-bold text-[#3B82F6]">€5.99</div>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleBuyCredits(10)}
                data-testid="button-buy-10"
              >
                شراء الآن
              </Button>
            </Card>

            <Card className="p-6 rounded-2xl hover-elevate active-elevate-2 border-2 border-[#8B5CF6]">
              <div className="text-center mb-4">
                <Badge className="mb-2 bg-[#8B5CF6] text-white">الأكثر قيمة</Badge>
                <div className="text-3xl font-bold text-[#111827] mb-1">20 فحص</div>
                <div className="text-2xl font-bold text-[#3B82F6]">€9.99</div>
              </div>
              <Button
                className="w-full"
                onClick={() => handleBuyCredits(20)}
                data-testid="button-buy-20"
              >
                شراء الآن
              </Button>
            </Card>

            <Card className="p-6 rounded-2xl hover-elevate active-elevate-2">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[#111827] mb-1">50 فحص</div>
                <div className="text-2xl font-bold text-[#3B82F6]">€19.99</div>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleBuyCredits(50)}
                data-testid="button-buy-50"
              >
                شراء الآن
              </Button>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}
