import React from 'react';
import { GridCell, Worker } from '../types/game';
import { ModernGrid } from './ModernGrid';
import { Sparkles, Trash2 } from 'lucide-react';

interface ModernGameBoardProps {
  gridState: GridCell[];
  workers: Worker[];
  onCellClick: (position: number) => void;
  onRemoveWorker: (id: string) => void;
  onUnlockSlot: (position: number) => void;
  balance: number;
  selectedWorkerId: string | null;
  canMergeWorkers: (worker1: Worker, worker2: Worker) => boolean;
  unlockedSlots: number;
}

export function ModernGameBoard({
  gridState,
  workers,
  onCellClick,
  onRemoveWorker,
  onUnlockSlot,
  balance,
  selectedWorkerId,
  canMergeWorkers,
  unlockedSlots,
}: ModernGameBoardProps) {
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  const handleRemoveWorker = () => {
    if (selectedWorker) {
      onRemoveWorker(selectedWorker.id);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-purple-500/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-purple-500/20">
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">Mining Grid</h2>
            <p className="text-sm sm:text-base text-purple-300">{workers.length} Active Miners • {unlockedSlots} Slots</p>
          </div>
        </div>
        
        {selectedWorker && (
          <button
            onClick={handleRemoveWorker}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl
                     bg-red-500/10 hover:bg-red-500/20 text-red-400
                     border border-red-500/20 transition-all duration-200"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base">Remove</span>
          </button>
        )}
      </div>

      <ModernGrid
        gridState={gridState}
        workers={workers}
        onCellClick={onCellClick}
        balance={balance}
        selectedWorkerId={selectedWorkerId}
        canMergeWorkers={canMergeWorkers}
        unlockedSlots={unlockedSlots}
        onUnlockSlot={onUnlockSlot}
      />
    </div>
  );
}