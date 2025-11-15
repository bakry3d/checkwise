import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Package, User, Bell, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";

export default function Settings() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

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

  const typedUser = user as UserType;

  const handleToggleNotification = (type: string, value: boolean) => {
    toast({
      title: "تم الحفظ ✅",
      description: `تم ${value ? "تفعيل" : "إيقاف"} ${type}`,
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "تأكيد مطلوب",
      description: "هذه الميزة متاحة قريباً. تواصل مع الدعم لحذف حسابك.",
      variant: "destructive",
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

      <div className="max-w-4xl mx-auto px-6 py-8">
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
          <h1 className="text-3xl font-bold text-[#111827] mb-2">الإعدادات</h1>
          <p className="text-[#6B7280]">إدارة حسابك وتفضيلاتك</p>
        </div>

        {/* Profile Section */}
        <Card className="p-6 lg:p-8 rounded-3xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">الملف الشخصي</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {typedUser.profileImageUrl && (
                <img
                  src={typedUser.profileImageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium text-[#111827]">
                  {typedUser.firstName && typedUser.lastName
                    ? `${typedUser.firstName} ${typedUser.lastName}`
                    : typedUser.email?.split("@")[0]}
                </div>
                <div className="text-sm text-[#6B7280]">{typedUser.email}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={typedUser.email || ""}
                disabled
                className="h-12 rounded-xl bg-gray-50"
                data-testid="input-email"
              />
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 lg:p-8 rounded-3xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">التنبيهات</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-[#111827]">تنبيهات البريد الإلكتروني</div>
                <div className="text-sm text-[#6B7280]">استقبل تحديثات عبر البريد</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newValue = !emailNotifications;
                  setEmailNotifications(newValue);
                  handleToggleNotification("تنبيهات البريد الإلكتروني", newValue);
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? "bg-[#16A34A]" : "bg-gray-300"
                }`}
                data-testid="toggle-email-notifications"
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    emailNotifications ? "right-1" : "right-7"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-[#111827]">إشعارات الدفع</div>
                <div className="text-sm text-[#6B7280]">استقبل إشعارات فورية</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newValue = !pushNotifications;
                  setPushNotifications(newValue);
                  handleToggleNotification("إشعارات الدفع", newValue);
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  pushNotifications ? "bg-[#16A34A]" : "bg-gray-300"
                }`}
                data-testid="toggle-push-notifications"
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    pushNotifications ? "right-1" : "right-7"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Account Management */}
        <Card className="p-6 lg:p-8 rounded-3xl border-[#DC2626]/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-[#DC2626]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">إدارة الحساب</h2>
          </div>

          <div className="space-y-4">
            <p className="text-[#6B7280]">
              حذف الحساب عملية نهائية ولا يمكن التراجع عنها. سيتم حذف جميع بياناتك وفحوصاتك بشكل دائم.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              data-testid="button-delete-account"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف الحساب
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
