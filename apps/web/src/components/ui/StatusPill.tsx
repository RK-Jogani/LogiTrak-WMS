import { STATUS_COLORS } from "@/lib/constants";

interface StatusPillProps {
  status: string;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function StatusPill({ status, size = "sm", showDot = true }: StatusPillProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  const displayText = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-semibold tracking-wide uppercase
        ${colors.bg} ${colors.text} ${colors.border}
        ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}
      `}
    >
      {showDot && (
        <span className={`rounded-full ${colors.text.replace("text-", "bg-")} mr-1.5 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      )}
      {displayText}
    </span>
  );
}
