import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  variant?: "on-white" | "on-color";
  className?: string;
}

const sizeMap = {
  sm: {
    box: "size-7",
    icon: "size-3.5",
    text: "text-base",
  },
  md: {
    box: "size-8",
    icon: "size-4",
    text: "text-xl",
  },
};

export function Logo({ size = "md", variant = "on-white", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          s.box,
          "rounded-xl flex items-center justify-center shrink-0",
          variant === "on-white" ? "bg-linear-to-br from-chart-3 to-chart-2" : "bg-white/20",
        )}
      >
        <Calendar className={cn(s.icon, "text-white")} />
      </div>
      <span
        className={cn(
          "font-heading font-black tracking-[-0.02em]",
          s.text,
          variant === "on-white" ? "text-slate-900" : "text-white",
        )}
      >
        Agendei
      </span>
    </div>
  );
}
