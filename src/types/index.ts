export interface Risk {
  id: string;
  riskNumber: number;
  name: string;
  description?: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
}

export type ProbabilityLevel = 1 | 2 | 3 | 4 | 5;
export type ImpactLevel = 1 | 2 | 3 | 4 | 5;

export const PROBABILITY_LABELS: Record<ProbabilityLevel, string> = {
  1: 'Minimale',
  2: 'Peu probable',
  3: 'Probable',
  4: 'Très probable',
  5: 'Certain',
};

export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  1: 'Mineur',
  2: 'Significatif',
  3: 'Grave',
  4: 'Critique',
  5: 'Catastrophique',
};

export function getRiskColor(score: number): string {
  if (score <= 4) return 'bg-green-500';
  if (score <= 9) return 'bg-yellow-400';
  if (score <= 15) return 'bg-orange-500';
  return 'bg-red-600';
}

export function getRiskColorHex(score: number): string {
  if (score <= 4) return '#22c55e';
  if (score <= 9) return '#facc15';
  if (score <= 15) return '#f97316';
  return '#dc2626';
}
