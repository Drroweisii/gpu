import React from 'react';
import { GRID_SIZE } from '../utils/constants';
import { GridCell as GridCellType, Worker as WorkerType } from '../types/game';
import { ModernGridCell } from './ModernGridCell';

interface ModernGridProps {
  gridState: GridCellType[];
  workers: WorkerType[];
  onCellClick: (position: number) => void;
  balance: number;
  selectedWorkerId: string | null;
  canMergeWorkers: (worker1: WorkerType, worker2: WorkerType) => boolean;
  unlockedSlots: number;
  onUnlockSlot: (position: number) => void;
}

export function ModernGrid({
  gridState,
  workers,
  onCellClick,
  balance,
  selectedWorkerId,
  canMergeWorkers,
  unlockedSlots,
  onUnlockSlot,
}: ModernGridProps) {
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  return (
    <div 
      className="grid gap-2 sm:gap-4 w-full aspect-[4/3]"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE.COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${GRID_SIZE.ROWS}, minmax(0, 1fr))`,
      }}
    >
      {gridState.map((cell, index) => {
        const worker = workers.find(w => w.id === cell.workerId);
        const canMerge = worker && selectedWorker && worker.id !== selectedWorker.id && 
                        canMergeWorkers(worker, selectedWorker);
        const isValidMove = selectedWorker && !worker;
        const isLocked = index >= unlockedSlots;

        return (
          <ModernGridCell
            key={cell.position}
            cell={cell}
            worker={worker}
            onClick={() => onCellClick(cell.position)}
            balance={balance}
            isSelected={worker?.id === selectedWorkerId}
            canMerge={canMerge}
            isValidMove={isValidMove}
            isLocked={isLocked}
            onUnlock={() => onUnlockSlot(index)}
            unlockCost={getSlotCost(index)}
          />
        );
      })}
    </div>
  );
}

function getSlotCost(position: number): number {
  const costs = {
    6: 100,
    7: 250,
    8: 500,
    9: 1000,
    10: 2500,
    11: 5000,
    12: 10000,
  };
  return costs[position + 1 as keyof typeof costs] || 0;
}