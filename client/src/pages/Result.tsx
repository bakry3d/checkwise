import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, X, Package, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Check as CheckType } from "@shared/schema";

export default function Result() {
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

  const { data: check, isLoading, error } = useQuery<CheckType>({
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: "from-[#16A34A] to-[#22C55E]", text: "text-[#16A34A]" };
    if (score >= 50) return { bg: "from-[#F59E0B] to-[#FBBF24]", text: "text-[#F59E0B]" };
    return { bg: "from-[#DC2626] to-[#EF4444]", text: "text-[#DC2626]" };
  };

  const getRecommendationEmoji = (level: string) => {
    if (level === "trusted") return "👍";
    if (level === "warning") return "⚠️";
    return "❌";
  };

  const scoreColor = getScoreColor(check.trustScore);

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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          رجوع إلى الرئيسية
        </Button>

        {/* Product Header */}
        <Card className="p-6 lg:p-8 rounded-3xl mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {check.productImage && (
              <img
                src={check.productImage}
                alt={check.productName}
                className="w-full md:w-48 h-48 object-cover rounded-2xl"
                data-testid="img-product"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#111827] mb-2" data-testid="text-product-name">
                {check.productName}
              </h1>
              {check.productPrice && (
                <p className="text-xl text-[#3B82F6] font-bold mb-3" data-testid="text-product-price">
                  {check.productPrice}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-[#6B7280]">
                  {check.platform}
                </span>
                <span className="text-sm text-[#6B7280]">
                  {new Date(check.createdAt!).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Score */}
        <Card className="p-8 lg:p-12 rounded-3xl mb-6 text-center">
          <div
            className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r ${scoreColor.bg} text-white text-5xl font-bold mb-6`}
            data-testid="text-trust-score"
          >
            {check.trustScore}%
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-2">نسبة الثقة</h2>
          <p className={`text-2xl font-semibold ${scoreColor.text} mb-6`}>
            {check.recommendation} {getRecommendationEmoji(check.trustLevel)}
          </p>
        </Card>

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-[#16A34A]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">نقاط إيجابية</h3>
            </div>
            <ul className="space-y-3">
              {check.positivesPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`positive-${index}`}>
                  <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280]">{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center">
                <X className="w-6 h-6 text-[#DC2626]" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">نقاط سلبية متكررة</h3>
            </div>
            <ul className="space-y-3">
              {check.negativePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`negative-${index}`}>
                  <X className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <span className="text-[#6B7280]">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          {check.alternatives && check.alternatives.length > 0 && (
            <Button
              size="lg"
              onClick={() => setLocation(`/alternatives/${check.id}`)}
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
              data-testid="button-alternatives"
            >
              <TrendingUp className="w-5 h-5 ml-2" />
              شاهد بدائل أفضل
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/history")}
            data-testid="button-history"
          >
            رجوع إلى السجل
          </Button>
        </div>
      </div>
    </div>
  );
}
