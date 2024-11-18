import { Worker } from '../../types/game';
import { GAME_CONFIG } from '../constants';
import { calculateAdjacentBonus, calculateRarityMultiplier, calculateComboMultiplier } from './worker';

export function calculateMiningRate(worker: Worker): number {
  const baseRate = GAME_CONFIG.BASE_MINING_RATES[worker.type as keyof typeof GAME_CONFIG.BASE_MINING_RATES] * 
                  worker.stats.baseRate * 
                  Math.pow(GAME_CONFIG.LEVEL_MULTIPLIER, worker.level - 1);
  
  const adjacentBonus = calculateAdjacentBonus(worker, []);
  const rarityMultiplier = calculateRarityMultiplier(worker);
  const comboMultiplier = calculateComboMultiplier(worker, []);
  
  return baseRate * adjacentBonus * rarityMultiplier * comboMultiplier;
}

export function calculateOfflineMining(lastUpdate: number): number {
  const now = Date.now();
  const timeDiff = Math.min(now - lastUpdate, GAME_CONFIG.MAX_OFFLINE_TIME);
  return (timeDiff / 1000) * GAME_CONFIG.OFFLINE_MINING_RATE;
}