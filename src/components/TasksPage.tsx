import React from 'react';
import { CheckCircle2, ExternalLink, Clock } from 'lucide-react';
import { Task } from '../types/tasks';
import { useTelegramUser } from '../hooks/useTelegramUser';
import { useTaskSystem } from '../hooks/useTaskSystem';
import { useGameState } from '../hooks/useGameState';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => Promise<void>;
  canClaimReward: (taskId: string) => boolean;
  onClaimReward: (taskId: string) => void;
}

function TaskCard({ task, onTaskClick, canClaimReward, onClaimReward }: TaskCardProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onTaskClick(task);
  };

  const handleClaimReward = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClaimReward(task.id);
  };

  const isExpired = task.completedAt && Date.now() - task.completedAt > 24 * 60 * 60 * 1000;

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white/5 rounded-2xl p-4 border
        ${task.completed 
          ? isExpired
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-green-500/30 bg-green-500/10' 
          : 'border-white/10 hover:bg-white/10 cursor-pointer'}
        transition-all duration-200
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white mb-1">{task.title}</h3>
          <p className="text-sm text-gray-400">{task.description}</p>
        </div>
        
        {task.completed ? (
          isExpired ? (
            <Clock className="w-6 h-6 text-red-400" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          )
        ) : (
          <ExternalLink className="w-5 h-5 text-blue-400" />
        )}
      </div>

      {task.completed && !isExpired && canClaimReward(task.id) && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-300">
              Reward: Level {task.reward.level} {task.reward.minerType.toUpperCase()} Miner
            </span>
            <button
              onClick={handleClaimReward}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm transition-colors"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="mt-3 pt-3 border-t border-red-500/20">
          <p className="text-sm text-red-400">
            Reward expired. Complete the task again to claim.
          </p>
        </div>
      )}
    </div>
  );
}

export function TasksPage() {
  const user = useTelegramUser();
  const { tasks, completeTask, canClaimReward, claimReward } = useTaskSystem();
  const { addStoredMiner } = useGameState();

  const handleTaskClick = async (task: Task) => {
    if (!task.completed) {
      const completed = await completeTask(task.id);
      if (completed) {
        const rewardMiner = claimReward(task.id);
        if (rewardMiner) {
          addStoredMiner(rewardMiner);
        }
      }
    }
  };

  const handleClaimReward = (taskId: string) => {
    const rewardMiner = claimReward(taskId);
    if (rewardMiner) {
      addStoredMiner(rewardMiner);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <p className="text-center text-gray-400">Please open this app in Telegram to access tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Daily Tasks</h2>
        
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              canClaimReward={canClaimReward}
              onClaimReward={handleClaimReward}
            />
          ))}
        </div>
      </div>
    </div>
  );
}