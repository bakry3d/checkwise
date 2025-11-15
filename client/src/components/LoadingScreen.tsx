import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number; // 0-100
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "جاري جلب بيانات المنتج", icon: "🔍" },
    { label: "تحليل التقييمات", icon: "⭐" },
    { label: "كشف الإعلانات المزيفة", icon: "🔬" },
    { label: "حساب نسبة الثقة", icon: "📊" },
  ];

  useEffect(() => {
    if (progress >= 25 && currentStep < 1) setCurrentStep(1);
    if (progress >= 50 && currentStep < 2) setCurrentStep(2);
    if (progress >= 75 && currentStep < 3) setCurrentStep(3);
    if (progress >= 100 && currentStep < 4) setCurrentStep(4);
  }, [progress, currentStep]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
            {progress}%
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 scale-105"
                    : isCompleted
                    ? "bg-[#16A34A]/10"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#16A34A] text-white"
                      : isActive
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white animate-pulse"
                      : "bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : step.icon}
                </div>
                <span
                  className={`font-medium ${
                    isActive ? "text-[#111827]" : isCompleted ? "text-[#16A34A]" : "text-[#6B7280]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
