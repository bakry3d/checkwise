import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Check, TrendingDown, Star } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Check as CheckType } from "@shared/schema";

export default function Alternatives() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
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

  const { data: check, isLoading } = useQuery<CheckType>({
    queryKey: [`/api/checks/${id}`],
    enabled: isAuthenticated && !!id,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !check) {
    return null;
  }

  const alternatives = check.alternatives || [];

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

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(`/result/${id}`)}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          رجوع إلى النتيجة
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111827] mb-4">بدائل أفضل</h1>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            وجدنا لك {alternatives.length} بدائل أفضل بناءً على التقييمات والأسعار
          </p>
        </div>

        {/* Why Section */}
        <Card className="p-6 rounded-3xl mb-8 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5">
          <h3 className="text-lg font-bold text-[#111827] mb-3">لماذا نوصي بهذه البدائل؟</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[#6B7280]">نسب ثقة أعلى من المنتج الأصلي</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[#6B7280]">أسعار أفضل مع جودة مماثلة أو أعلى</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span className="text-[#6B7280]">تقييمات أكثر موثوقية من مستخدمين حقيقيين</span>
            </li>
          </ul>
        </Card>

        {/* Alternatives */}
        <div className="grid md:grid-cols-3 gap-6">
          {alternatives.map((alt, index) => (
            <Card
              key={index}
              className="p-6 rounded-3xl hover:shadow-xl transition-all hover-elevate active-elevate-2"
              data-testid={`card-alternative-${index}`}
            >
              {alt.savings && (
                <Badge className="mb-4 bg-[#16A34A] text-white">
                  <TrendingDown className="w-3 h-3 ml-1" />
                  وفر {alt.savings}
                </Badge>
              )}

              <h3 className="text-lg font-bold text-[#111827] mb-3 line-clamp-2">
                {alt.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] flex items-center justify-center text-white font-bold">
                  {alt.trustScore}
                </div>
                <div>
                  <div className="text-sm text-[#6B7280]">نسبة الثقة</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-sm font-medium text-[#111827]">عالي</span>
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-[#3B82F6] mb-4">{alt.price}</div>

              <div className="space-y-2 mb-6">
                {alt.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6B7280]">{highlight}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => window.open(alt.url, "_blank")}
                data-testid={`button-view-alternative-${index}`}
              >
                عرض المنتج
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
