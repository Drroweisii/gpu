import { useCallback, useEffect } from 'react';
import { GameState, Worker } from '../types/game';
import { GAME_CONFIG, GRID_SIZE } from '../utils/constants';
import { useMining } from './useMining';
import { useLocalStorage } from './useLocalStorage';
import { useWorkerMerge } from './useWorkerMerge';
import { WorkerType } from '../types/workers';
import { WORKER_TYPES } from '../utils/workerTypes';

const initialGridState = Array.from(
  { length: GRID_SIZE.TOTAL_CELLS },
  (_, i) => ({
    position: i,
    workerId: null,
    isOccupied: false,
    isLocked: i >= GRID_SIZE.INITIAL_SLOTS
  })
);

const initialState: GameState = {
  balances: GAME_CONFIG.INITIAL_BALANCES,
  workers: [],
  storedMiners: [],
  miningRates: {
    emsx: 0,
    usdt: 0,
    btc: 0
  },
  gridState: initialGridState,
  lastUpdate: Date.now(),
  unlockedSlots: GRID_SIZE.INITIAL_SLOTS,
};

const createWorker = (type: WorkerType, level: number = 1, position: number = -1): Worker => {
  const workerConfig = WORKER_TYPES[type];
  if (!workerConfig) throw new Error(`Invalid worker type: ${type}`);

  return {
    id: `w${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    level,
    position,
    miningRate: GAME_CONFIG.BASE_MINING_RATES[workerConfig.currency] * 
                workerConfig.stats.baseRate * 
                Math.pow(GAME_CONFIG.LEVEL_MULTIPLIER, level - 1),
    stats: { ...workerConfig.stats },
    lastCollected: Date.now()
  };
};

export function useGameState() {
  const [gameState, setGameState] = useLocalStorage<GameState>('miningGame', initialState);
  const { miningRates } = useMining(gameState.workers);
  const { selectedWorkerId, handleWorkerSelect, canMergeWorkers } = useWorkerMerge();

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const now = Date.now();
      setGameState(prev => {
        const timeDiff = (now - (prev.lastUpdate || now)) / 1000;

        return {
          ...prev,
          balances: {
            emsx: prev.balances.emsx + (miningRates.emsx * timeDiff),
            usdt: prev.balances.usdt + (miningRates.usdt * timeDiff),
            btc: prev.balances.btc + (miningRates.btc * timeDiff)
          },
          miningRates,
          lastUpdate: now,
        };
      });
    }, GAME_CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(updateInterval);
  }, [miningRates, setGameState]);

  const unlockSlot = useCallback((position: number) => {
    setGameState(prev => {
      const slotNumber = position + 1;
      const cost = GAME_CONFIG.SLOT_COSTS[slotNumber as keyof typeof GAME_CONFIG.SLOT_COSTS];
      
      if (!cost || prev.balances.emsx < cost || position < prev.unlockedSlots) {
        return prev;
      }

      return {
        ...prev,
        balances: {
          ...prev.balances,
          emsx: prev.balances.emsx - cost
        },
        unlockedSlots: position + 1,
        gridState: prev.gridState.map((cell, index) => ({
          ...cell,
          isLocked: index >= position + 1
        }))
      };
    });
  }, [setGameState]);

  const removeWorker = useCallback((workerId: string) => {
    setGameState(prev => {
      const worker = prev.workers.find(w => w.id === workerId);
      if (!worker) return prev;

      const updatedWorkers = prev.workers.filter(w => w.id !== workerId);
      const updatedStoredMiners = [...(prev.storedMiners || []), { ...worker }];
      const updatedGridState = prev.gridState.map(cell =>
        cell.workerId === workerId
          ? { ...cell, workerId: null, isOccupied: false }
          : cell
      );

      return {
        ...prev,
        workers: updatedWorkers,
        storedMiners: updatedStoredMiners.slice(0, 5),
        gridState: updatedGridState,
      };
    });
  }, [setGameState]);

  const removeMinerPermanently = useCallback((worker: Worker) => {
    setGameState(prev => ({
      ...prev,
      storedMiners: prev.storedMiners.filter(w => w.id !== worker.id)
    }));
  }, [setGameState]);

  const useMiner = useCallback((worker: Worker) => {
    setGameState(prev => {
      const availableCell = prev.gridState.find(cell => !cell.isOccupied && !cell.isLocked);
      if (!availableCell) return prev;

      const newWorker = createWorker(worker.type as WorkerType, worker.level, availableCell.position);
      const updatedStoredMiners = prev.storedMiners.filter(w => w.id !== worker.id);

      return {
        ...prev,
        workers: [...prev.workers, newWorker],
        storedMiners: updatedStoredMiners,
        gridState: prev.gridState.map(cell =>
          cell.position === availableCell.position
            ? { ...cell, workerId: newWorker.id, isOccupied: true }
            : cell
        ),
      };
    });
  }, [setGameState]);

  const moveWorker = useCallback((workerId: string, newPosition: number) => {
    setGameState(prev => {
      const worker = prev.workers.find(w => w.id === workerId);
      if (!worker) return prev;

      const targetCell = prev.gridState[newPosition];
      if (targetCell.isOccupied || targetCell.isLocked) return prev;

      return {
        ...prev,
        workers: prev.workers.map(w =>
          w.id === workerId ? { ...w, position: newPosition } : w
        ),
        gridState: prev.gridState.map(cell => {
          if (cell.workerId === workerId) {
            return { ...cell, workerId: null, isOccupied: false };
          }
          if (cell.position === newPosition) {
            return { ...cell, workerId, isOccupied: true };
          }
          return cell;
        }),
      };
    });
  }, [setGameState]);

  const handleWorkerClick = useCallback((workerId: string, targetPosition?: number) => {
    handleWorkerSelect(
      workerId,
      gameState.workers,
      (worker1, worker2) => {
        const workerConfig = WORKER_TYPES[worker1.type as WorkerType];
        if (!workerConfig) return false;

        const newWorker = createWorker(
          worker1.type as WorkerType,
          worker1.level + 1,
          worker2.position
        );

        setGameState(prev => ({
          ...prev,
          workers: [
            ...prev.workers.filter(w => w.id !== worker1.id && w.id !== worker2.id),
            newWorker,
          ],
          gridState: prev.gridState.map(cell => {
            if (cell.workerId === worker1.id) {
              return { ...cell, workerId: null, isOccupied: false };
            }
            if (cell.workerId === worker2.id) {
              return { ...cell, workerId: newWorker.id };
            }
            return cell;
          }),
        }));

        return true;
      },
      moveWorker,
      targetPosition
    );
  }, [gameState.workers, handleWorkerSelect, moveWorker, setGameState]);

  const hireWorker = useCallback((type: WorkerType = 'emsx') => {
    const workerConfig = WORKER_TYPES[type];
    if (!workerConfig || gameState.balances.emsx < workerConfig.cost) return false;

    const availableCells = gameState.gridState.filter(cell => !cell.isOccupied && !cell.isLocked);
    if (availableCells.length === 0) return false;

    const emptyCell = availableCells[0];
    const newWorker = createWorker(type, 1, emptyCell.position);

    setGameState(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        emsx: prev.balances.emsx - workerConfig.cost
      },
      workers: [...prev.workers, newWorker],
      gridState: prev.gridState.map(cell =>
        cell.position === emptyCell.position
          ? { ...cell, workerId: newWorker.id, isOccupied: true }
          : cell
      ),
    }));

    return true;
  }, [gameState.balances.emsx, gameState.gridState, setGameState]);

  const addStoredMiner = useCallback((worker: Worker) => {
    setGameState(prev => {
      if (prev.storedMiners.length >= 5) return prev;

      const newWorker = createWorker(worker.type as WorkerType, worker.level);
      
      return {
        ...prev,
        storedMiners: [...prev.storedMiners, newWorker]
      };
    });
  }, [setGameState]);

  const hasAvailableSpace = gameState.gridState.some(cell => !cell.isOccupied && !cell.isLocked);

  return {
    gameState,
    hireWorker,
    removeWorker,
    removeMinerPermanently,
    handleWorkerClick,
    unlockSlot,
    selectedWorkerId,
    canMergeWorkers,
    useMiner,
    hasAvailableSpace,
    addStoredMiner,
    canHireWorker: (type: WorkerType) => {
      const workerConfig = WORKER_TYPES[type];
      return workerConfig && 
             gameState.balances.emsx >= workerConfig.cost && 
             hasAvailableSpace;
    },
  };
}