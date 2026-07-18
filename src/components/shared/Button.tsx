import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "solid";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 rounded-full disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base";

const variants: Record<Variant, string> = {
  // Gold accent, dark text. Soft gold glow + magnetic pull (btn-glow / data-magnetic).
  primary: "btn-glow bg-accent text-base hover:bg-accent-soft",
  // Cream solid.
  solid: "btn-glow bg-cream text-base hover:bg-cream/90",
  // Outlined, inherits current text color.
  outline:
    "border border-current/30 hover:border-accent hover:text-accent bg-transparent",
  // Minimal.
  ghost: "hover:text-accent bg-transparent",
};

// Filled variants get the cursor-follow magnetism wired by <ScrollFX>.
const magnetic: Record<Variant, boolean> = {
  primary: true,
  solid: true,
  outline: false,
  ghost: false,
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-sm px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...(magnetic[variant] ? { "data-magnetic": "" } : {})}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "className"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(magnetic[variant] ? { "data-magnetic": "" } : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}
