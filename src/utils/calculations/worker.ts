import { Worker } from '../../types/game';
import { WORKER_RARITY, WorkerRarityConfig } from '../constants/workers';
import { isAdjacent } from './grid';

export function calculateAdjacentBonus(worker: Worker, allWorkers: Worker[]): number {
  const adjacentWorkers = allWorkers.filter(w => 
    w.id !== worker.id && isAdjacent(w.position, worker.position)
  );

  return 1 + (adjacentWorkers.length * 0.1);
}

export function calculateRarityMultiplier(worker: Worker): number {
  const rarity = Object.entries(WORKER_RARITY).find(([_, config]) =>
    Math.random() < config.chance
  );
  
  return rarity ? rarity[1].multiplier : 1;
}

export function calculateComboMultiplier(worker: Worker, allWorkers: Worker[]): number {
  if (!worker.stats.comboBonus) return 1;

  const sameTypeWorkers = allWorkers.filter(w => 
    w.id !== worker.id && 
    w.type === worker.type &&
    isAdjacent(w.position, worker.position)
  );

  return 1 + (sameTypeWorkers.length * worker.stats.comboBonus);
}