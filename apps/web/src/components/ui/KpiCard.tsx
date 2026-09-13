import type { KpiData } from "@/types";

interface KpiCardProps extends KpiData {
  className?: string;
}

export function KpiCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  accentColor = "bg-status-info",
  className = "",
}: KpiCardProps) {
  const changeColors = {
    positive: "text-status-success",
    negative: "text-status-error",
    neutral: "text-on-surface-variant",
  };

  const changeIcons = {
    positive: "arrow_upward",
    negative: "arrow_downward",
    neutral: "",
  };

  return (
    <div
      className={`bg-surface-container-lowest border border-low rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${accentColor} opacity-80`} />

      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
        {label}
      </span>

      <div className="flex items-end justify-between">
        <span className="text-display-lg font-bold text-on-surface leading-tight">{value}</span>

        {change && (
          <span className={`text-body-md flex items-center gap-0.5 ${changeColors[changeType]}`}>
            {changeIcons[changeType] && (
              <span className="material-symbols-outlined text-[16px]">
                {changeIcons[changeType]}
              </span>
            )}
            {change}
          </span>
        )}

        {icon && !change && (
          <div className="w-12 h-12 rounded-full bg-status-info/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-status-info">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
