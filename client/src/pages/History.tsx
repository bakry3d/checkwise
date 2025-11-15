import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TrustBadgePill } from "@/components/TrustBadge";
import { EmptyState } from "@/components/EmptyState";
import { ArrowRight, Package, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Check } from "@shared/schema";

export default function History() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: checks = [], isLoading } = useQuery<Check[]>({
    queryKey: ["/api/checks"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredChecks = checks.filter((check) =>
    check.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-[#111827] mb-2">سجل الفحوص</h1>
          <p className="text-[#6B7280]">كل فحوصاتك السابقة في مكان واحد</p>
        </div>

        <Card className="p-6 lg:p-8 rounded-3xl">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 rounded-xl"
                data-testid="input-search"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredChecks.length === 0 ? (
            <EmptyState
              icon={<Package className="w-12 h-12 text-[#6B7280]" />}
              title={searchTerm ? "لا توجد نتائج" : "لا توجد فحوص بعد"}
              description={
                searchTerm
                  ? "جرب كلمات بحث أخرى"
                  : "ابدأ بفحص منتجك الأول واحصل على تحليل مفصل"
              }
              actionLabel={searchTerm ? undefined : "فحص منتج جديد"}
              onAction={searchTerm ? undefined : () => setLocation("/new-check")}
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
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[#6B7280]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map((check) => (
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
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            check.trustScore >= 80
                              ? "bg-[#16A34A]"
                              : check.trustScore >= 50
                              ? "bg-[#F59E0B]"
                              : "bg-[#DC2626]"
                          }`}
                        >
                          {check.trustScore}
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
