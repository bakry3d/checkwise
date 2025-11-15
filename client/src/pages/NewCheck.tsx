import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ArrowRight, CreditCard, Package } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";

export default function NewCheck() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [productUrl, setProductUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);

  // Redirect if not authenticated
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

  const checkMutation = useMutation({
    mutationFn: async (data: { productUrl: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/checks", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/checks/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "تم الفحص بنجاح! ✅",
        description: "تم تحليل المنتج وحساب نسبة الثقة",
      });
      setLocation(`/result/${data.id}`);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مصرح",
          description: "انتهت الجلسة. جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      setIsChecking(false);
      setProgress(0);
      toast({
        title: "خطأ في الفحص",
        description: error.message || "حدث خطأ أثناء فحص المنتج. حاول مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productUrl.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رابط المنتج",
        variant: "destructive",
      });
      return;
    }

    if (!platform) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار نوع الموقع",
        variant: "destructive",
      });
      return;
    }

    const typedUser = user as User;
    if (typedUser.creditsRemaining <= 0) {
      toast({
        title: "نفد الرصيد",
        description: "ليس لديك فحوص متبقية. قم بترقية خطتك للمتابعة.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/credits"), 1000);
      return;
    }

    setIsChecking(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    checkMutation.mutate({ productUrl, platform });
  };

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

  if (isChecking) {
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

        <LoadingScreen progress={progress} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          رجوع إلى الرئيسية
        </Button>

        <Card className="p-8 lg:p-12 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-[#3B82F6]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">فحص منتج جديد</h1>
            <p className="text-[#6B7280]">الصق رابط المنتج واحصل على تحليل مفصل بالذكاء الاصطناعي</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                رابط المنتج
              </label>
              <Input
                type="url"
                placeholder="https://www.amazon.com/product/..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="h-12 rounded-xl"
                data-testid="input-product-url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                نوع الموقع
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-12 rounded-xl" data-testid="select-platform">
                  <SelectValue placeholder="اختر الموقع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="temu">Temu</SelectItem>
                  <SelectItem value="tiktok">TikTok Shop</SelectItem>
                  <SelectItem value="aliexpress">AliExpress</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#3B82F6]" />
                <div className="flex-1">
                  <p className="text-sm text-[#111827] font-medium">
                    سيتم خصم 1 فحص من رصيدك
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    الرصيد المتبقي: {typedUser.creditsRemaining} / {typedUser.creditsTotal}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
              disabled={checkMutation.isPending}
              data-testid="button-submit-check"
            >
              {checkMutation.isPending ? "جاري الفحص..." : "افحص المنتج الآن"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
