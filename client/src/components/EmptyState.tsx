import { FileQuestion } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 flex items-center justify-center mb-6">
        {icon || <FileQuestion className="w-12 h-12 text-[#6B7280]" />}
      </div>
      <h3 className="text-xl font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-[#6B7280] mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#3B82F6]/90 hover:to-[#8B5CF6]/90"
          data-testid="button-empty-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
