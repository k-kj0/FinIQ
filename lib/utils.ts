import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function calculateFiniqScore(answers: Record<string, any>): number {
  let score = 50;
  if (answers.risk === 'Aggressive') score += 15;
  if (answers.risk === 'Moderate') score += 10;
  if (answers.horizon === '10yr+') score += 15;
  if (answers.horizon === '5yr') score += 10;
  if (answers.monthly >= 10000) score += 10;
  return Math.min(score, 100);
}

export function calculateSIP(monthly: number, years: number, rate: number) {
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  let invested = monthly * months;
  let worth = 0;

  for (let i = 0; i < months; i++) {
    worth = (worth + monthly) * (1 + monthlyRate);
  }

  return { invested: Math.round(invested), worth: Math.round(worth) };
}

export function generateChartData(monthly: number, years: number, rate: number) {
  const data = [];
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  let worth = 0;

  for (let year = 0; year <= years; year++) {
    const yearMonths = year * 12;
    worth = 0;
    for (let i = 0; i < yearMonths; i++) {
      worth = (worth + monthly) * (1 + monthlyRate);
    }
    data.push({
      year: `Year ${year}`,
      worth: Math.round(worth),
      invested: monthly * yearMonths,
    });
  }

  return data;
}
