interface TrustBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TrustBadge({ score, size = "md", showLabel = true }: TrustBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return { bg: "bg-[#16A34A]", text: "text-[#16A34A]", label: "موثوق" };
    if (score >= 50) return { bg: "bg-[#F59E0B]", text: "text-[#F59E0B]", label: "تحذير" };
    return { bg: "bg-[#DC2626]", text: "text-[#DC2626]", label: "غير موثوق" };
  };

  const getSizeClasses = () => {
    if (size === "sm") return "w-6 h-6 text-xs";
    if (size === "lg") return "w-12 h-12 text-lg font-bold";
    return "w-8 h-8 text-sm";
  };

  const color = getColor(score);

  return (
    <div className="flex items-center gap-2">
      <div className={`${color.bg} ${getSizeClasses()} rounded-full flex items-center justify-center text-white font-bold`}>
        {score}
      </div>
      {showLabel && <span className={`${color.text} font-medium text-sm`}>{color.label}</span>}
    </div>
  );
}

interface TrustBadgePillProps {
  level: "trusted" | "warning" | "untrusted";
}

export function TrustBadgePill({ level }: TrustBadgePillProps) {
  const colors = {
    trusted: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    untrusted: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
  };

  const labels = {
    trusted: "موثوق",
    warning: "تحذير",
    untrusted: "غير موثوق",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
}
