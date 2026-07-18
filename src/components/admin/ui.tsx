import { cn } from "@/lib/cn";

/** Page title + optional description/action row for admin screens. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-cream">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-cream/50">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Panel surface used to group form sections and tables. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/50 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Labelled field wrapper. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-cream/35">{hint}</p>}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border border-cream/15 bg-base/60 px-3.5 py-2.5 text-sm text-cream outline-none transition focus:border-accent placeholder:text-cream/30";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea {...props} className={cn(inputBase, "min-h-24", props.className)} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputBase, "appearance-none", props.className)}>
      {props.children}
    </select>
  );
}
