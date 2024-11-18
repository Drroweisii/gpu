import { useState, useEffect, useCallback } from 'react';
import { WORKER_TYPES } from '../utils/workerTypes';
import { WorkerType } from '../types/workers';
import { GameState } from '../types/game';

export function useWorkerSelection(
  gameState: GameState,
  onHire: (type: WorkerType) => boolean
) {
  const [selectedWorkerType, setSelectedWorkerType] = useState<WorkerType>('emsx');

  useEffect(() => {
    const affordableTypes = Object.entries(WORKER_TYPES)
      .filter(([_, config]) => gameState.balances.emsx >= config.cost)
      .sort((a, b) => b[1].cost - a[1].cost);

    const currentConfig = WORKER_TYPES[selectedWorkerType];
    if (!currentConfig || gameState.balances.emsx < currentConfig.cost) {
      if (affordableTypes.length > 0) {
        setSelectedWorkerType(affordableTypes[0][0] as WorkerType);
      }
    }
  }, [gameState.balances.emsx, selectedWorkerType]);

  const handleHire = useCallback(() => {
    if (onHire(selectedWorkerType)) {
      const currentConfig = WORKER_TYPES[selectedWorkerType];
      if (gameState.balances.emsx < currentConfig.cost) {
        const affordableType = Object.entries(WORKER_TYPES)
          .filter(([_, config]) => gameState.balances.emsx >= config.cost)
          .sort((a, b) => b[1].cost - a[1].cost)[0];
          
        if (affordableType) {
          setSelectedWorkerType(affordableType[0] as WorkerType);
        }
      }
    }
  }, [selectedWorkerType, onHire, gameState.balances.emsx]);

  return {
    selectedWorkerType,
    setSelectedWorkerType,
    handleHire
  };
}