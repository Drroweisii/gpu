import { WORKER_CONFIG } from '../constants/workers';

export function calculateUpgradeCost(level: number): number {
  return WORKER_CONFIG.WORKER_COSTS.emsx * 
         Math.pow(WORKER_CONFIG.UPGRADE_COST_MULTIPLIER, level - 1);
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}