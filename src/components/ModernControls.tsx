import React from 'react';
import { GameState } from '../types/game';
import { WorkerType } from '../types/workers';
import { WORKER_TYPES } from '../utils/workerTypes';
import { useWorkerSelection } from '../hooks/useWorkerSelection';
import { Cpu, ArrowRight } from 'lucide-react';

interface ModernControlsProps {
  gameState: GameState;
  onHire: (type: WorkerType) => boolean;
  canHireWorker: (type: WorkerType) => boolean;
}

export function ModernControls({ gameState, onHire, canHireWorker }: ModernControlsProps) {
  const { selectedWorkerType, setSelectedWorkerType, handleHire } = useWorkerSelection(
    gameState,
    onHire
  );

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20">
          <Cpu className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Hire Miners</h2>
          <p className="text-blue-300">Select and hire new mining units</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(WORKER_TYPES).map(([type, config]) => {
          const isSelected = selectedWorkerType === type;
          const canAfford = gameState.balances.emsx >= config.cost;

          return (
            <div
              key={type}
              onClick={() => canAfford && setSelectedWorkerType(type as WorkerType)}
              className={`
                relative p-4 rounded-2xl border transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500/20 border-blue-500/40' 
                  : canAfford
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
                    : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`bg-${config.color}-500/20 rounded-xl p-2`}>
                  <Cpu className={`w-5 h-5 text-${config.color}-400`} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white">{config.name}</p>
                  <p className="text-sm text-gray-400">{config.cost} EMSX</p>
                </div>
                {isSelected && canHireWorker(type as WorkerType) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHire();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                             bg-blue-500 hover:bg-blue-600 text-white
                             transition-all duration-200 mt-2"
                  >
                    <span>Hire</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}