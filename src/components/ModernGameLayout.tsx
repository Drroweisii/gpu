import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { ModernGameBoard } from './ModernGameBoard';
import { ModernGameStats } from './ModernGameStats';
import { ModernControls } from './ModernControls';
import { ModernHeader } from './ModernHeader';
import { ModernNavigation } from './ModernNavigation';
import { ReferralSystem } from './ReferralSystem';
import { TasksPage } from './TasksPage';
import { FloatingMiner } from './FloatingMiner';
import { useGameState } from '../hooks/useGameState';
import { useScaling } from '../hooks/useScaling';
import { useTaskSystem } from '../hooks/useTaskSystem';

interface ModernGameLayoutProps {
  gameState: GameState;
}

export function ModernGameLayout({ gameState }: ModernGameLayoutProps) {
  const [activeTab, setActiveTab] = useState('mine');
  const { 
    hireWorker, 
    handleWorkerClick,
    removeWorker,
    removeMinerPermanently,
    unlockSlot,
    canHireWorker,
    selectedWorkerId,
    canMergeWorkers,
    useMiner,
    hasAvailableSpace,
    addStoredMiner
  } = useGameState();
  
  const scale = useScaling();
  const { tasks, claimReward } = useTaskSystem();

  // Check for unclaimed rewards
  useEffect(() => {
    tasks.forEach(task => {
      if (task.completed) {
        const rewardMiner = claimReward(task.id);
        if (rewardMiner) {
          addStoredMiner(rewardMiner);
        }
      }
    });
  }, [tasks, claimReward, addStoredMiner]);

  const renderContent = () => {
    switch (activeTab) {
      case 'referral':
        return <ReferralSystem />;
      case 'tasks':
        return <TasksPage />;
      case 'mine':
      default:
        return (
          <>
            <ModernGameStats gameState={gameState} />
            <div className="grid grid-cols-1 gap-4 mt-4">
              <ModernGameBoard
                gridState={gameState.gridState}
                workers={gameState.workers}
                onCellClick={(pos) => {
                  const worker = gameState.workers.find(w => w.position === pos);
                  handleWorkerClick(worker?.id || '', pos);
                }}
                onRemoveWorker={removeWorker}
                onUnlockSlot={unlockSlot}
                balance={gameState.balances.emsx}
                selectedWorkerId={selectedWorkerId}
                canMergeWorkers={canMergeWorkers}
                unlockedSlots={gameState.unlockedSlots}
              />
              <ModernControls
                gameState={gameState}
                onHire={hireWorker}
                canHireWorker={canHireWorker}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ModernHeader />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full w-full max-w-6xl mx-auto p-4 space-y-4">
          <div 
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              minHeight: `${100 / scale}%`
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
      <FloatingMiner
        storedMiners={gameState.storedMiners || []}
        onUseMiner={useMiner}
        onRemoveMiner={removeMinerPermanently}
        balance={gameState.balances.emsx}
        hasAvailableSpace={hasAvailableSpace}
      />
      <ModernNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}