import { cn } from "@/lib/cn";

/** Centered max-width content wrapper with responsive gutters. */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[100rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}
