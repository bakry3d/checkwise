import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrustBadgePill } from "@/components/TrustBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  PackageCheck,
  AlertTriangle,
  TrendingUp,
  Search,
  LogOut,
  Settings,
  History,
  CreditCard,
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Check, User } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const { data: recentChecks = [], isLoading: checksLoading } = useQuery<Check[]>({
    queryKey: ["/api/checks/recent"],
    enabled: isAuthenticated,
  });

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
  const suspiciousCount = recentChecks.filter((check) => check.trustLevel === "untrusted").length;
  const checksThisMonth = typedUser.creditsTotal - typedUser.creditsRemaining;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <PackageCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              CheckWise
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/settings")}
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = "/api/logout")}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            أهلاً، {typedUser.firstName || typedUser.email?.split("@")[0]} 👋
          </h1>
          <p className="text-[#6B7280]">تابع إحصائيات فحوصاتك واكتشف المنتجات الموثوقة</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-3xl hover-elevate">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <span className="text-sm text-[#6B7280]">
                {typedUser.planType === "free" ? "تجربة مجانية" : typedUser.planType}
              </span>
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">
              {typedUser.creditsRemaining} / {typedUser.creditsTotal}
            </div>
            <p className="text-[#6B7280]">الرصيد المتبقي</p>
          </Card>

          <Card className="p-6 rounded-3xl hover-elevate">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{checksThisMonth}</div>
            <p className="text-[#6B7280]">عدد الفحوص هذا الشهر</p>
          </Card>

          <Card className="p-6 rounded-3xl hover-elevate">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{suspiciousCount}</div>
            <p className="text-[#6B7280]">منتجات مشكوك فيها</p>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:shadow-xl transition-all hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => setLocation("/new-check")}
            data-testid="card-new-check"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">فحص منتج جديد</h3>
                <p className="text-white/90">الصق رابط المنتج واحصل على التحليل</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className="p-6 rounded-3xl hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setLocation("/history")}
              data-testid="card-history"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mb-3">
                <History className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <h4 className="font-bold text-[#111827] mb-1">السجل</h4>
              <p className="text-sm text-[#6B7280]">كل الفحوص</p>
            </Card>

            <Card
              className="p-6 rounded-3xl hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setLocation("/credits")}
              data-testid="card-credits"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h4 className="font-bold text-[#111827] mb-1">الخطط</h4>
              <p className="text-sm text-[#6B7280]">ترقية الحساب</p>
            </Card>
          </div>
        </div>

        {/* Recent Checks */}
        <Card className="p-6 lg:p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#111827]">آخر الفحوص</h2>
            <Button
              variant="outline"
              onClick={() => setLocation("/history")}
              data-testid="button-view-all"
            >
              عرض الكل
            </Button>
          </div>

          {checksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : recentChecks.length === 0 ? (
            <EmptyState
              icon={<PackageCheck className="w-12 h-12 text-[#6B7280]" />}
              title="لا توجد فحوص بعد"
              description="ابدأ بفحص منتجك الأول واحصل على تحليل مفصل بالذكاء الاصطناعي"
              actionLabel="فحص منتج جديد"
              onAction={() => setLocation("/new-check")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      التاريخ
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      المنتج
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      الموقع
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      نسبة الثقة
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      النتيجة
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((check) => (
                    <tr
                      key={check.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      data-testid={`row-check-${check.id}`}
                    >
                      <td className="py-4 px-4 text-sm text-[#6B7280]">
                        {new Date(check.createdAt!).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {check.productImage && (
                            <img
                              src={check.productImage}
                              alt={check.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-[#111827] truncate">
                              {check.productName}
                            </div>
                            {check.productPrice && (
                              <div className="text-sm text-[#6B7280]">{check.productPrice}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-[#6B7280]">
                          {check.platform}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              check.trustScore >= 80
                                ? "bg-[#16A34A]"
                                : check.trustScore >= 50
                                ? "bg-[#F59E0B]"
                                : "bg-[#DC2626]"
                            }`}
                          >
                            {check.trustScore}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <TrustBadgePill level={check.trustLevel as any} />
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/result/${check.id}`)}
                          data-testid={`button-view-${check.id}`}
                        >
                          عرض
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
