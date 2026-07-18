"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatPrice } from "@/lib/format";

export interface MortgageLabels {
  title: string;
  price: string;
  downPayment: string;
  interest: string;
  term: string;
  years: string;
  monthly: string;
  loan: string;
  disclaimer: string;
}

/**
 * Interactive mortgage estimator. Down payment is a percentage slider, and the
 * monthly figure uses the standard amortized-loan formula. Pure display — no
 * data leaves the client.
 */
export function MortgageCalculator({
  price,
  currency,
  labels,
}: {
  price: number;
  currency: string;
  labels: MortgageLabels;
}) {
  const [downPct, setDownPct] = useState(30);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(25);

  const { loan, monthly } = useMemo(() => {
    const loanAmount = Math.max(0, Math.round(price * (1 - downPct / 100)));
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    let payment: number;
    if (monthlyRate === 0) {
      payment = n > 0 ? loanAmount / n : 0;
    } else {
      const factor = Math.pow(1 + monthlyRate, n);
      payment = (loanAmount * monthlyRate * factor) / (factor - 1);
    }
    return { loan: loanAmount, monthly: Math.round(payment) };
  }, [price, downPct, rate, years]);

  const downAmount = Math.round(price * (downPct / 100));

  return (
    <div className="rounded-[var(--radius-base)] border border-cream/10 bg-charcoal/60 p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
          <Calculator className="h-4 w-4 text-accent" />
        </span>
        <h2 className="font-display text-2xl text-cream">{labels.title}</h2>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-7">
          <Slider
            label={labels.downPayment}
            value={`${downPct}% · ${formatPrice(downAmount, currency)}`}
            min={0}
            max={90}
            step={5}
            current={downPct}
            onChange={setDownPct}
          />
          <Slider
            label={labels.interest}
            value={`${rate.toFixed(1)}%`}
            min={0.5}
            max={10}
            step={0.1}
            current={rate}
            onChange={setRate}
          />
          <Slider
            label={labels.term}
            value={`${years} ${labels.years}`}
            min={5}
            max={35}
            step={1}
            current={years}
            onChange={setYears}
          />
        </div>

        <div className="flex flex-col justify-center rounded-[var(--radius-base)] border border-accent/20 bg-accent/[0.06] p-7 text-center">
          <p className="text-xs uppercase tracking-widest text-cream/45">
            {labels.monthly}
          </p>
          <p className="mt-3 font-display text-4xl text-accent">
            {formatPrice(monthly, currency)}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-cream/55">
            <span>{labels.loan}</span>
            <span className="text-cream/80">{formatPrice(loan, currency)}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-cream/35">
        {labels.disclaimer}
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-widest text-cream/45">
          {label}
        </span>
        <span className="font-display text-lg text-cream">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-cream/15 accent-accent"
        aria-label={label}
      />
    </div>
  );
}
