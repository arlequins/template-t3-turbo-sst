import type { LucideIcon } from "lucide-react";

export function StatBlock(props: {
  change: string;
  icon: LucideIcon;
  label: string;
  tone?: "blue" | "green" | "pink" | "yellow";
  value: string;
}) {
  const Icon = props.icon;
  const tones = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    pink: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
    yellow: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };

  return (
    <div className="border-border flex min-w-0 items-start justify-between border-b px-5 py-5 last:border-b-0 sm:border-r sm:nth-last-2:border-b-0 sm:odd:border-r sm:even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0">
      <div>
        <p className="text-muted-foreground text-xs font-medium uppercase">
          {props.label}
        </p>
        <p className="mt-2 text-2xl font-semibold">{props.value}</p>
        <p className="text-muted-foreground mt-1 text-xs">{props.change}</p>
      </div>
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${tones[props.tone ?? "blue"]}`}
      >
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </div>
  );
}
