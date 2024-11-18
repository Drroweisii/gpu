import { useCallback } from 'react';
import { Task, TaskState } from '../types/tasks';
import { useLocalStorage } from './useLocalStorage';
import { Worker } from '../types/game';
import { WORKER_TYPES } from '../utils/workerTypes';
import { GAME_CONFIG } from '../utils/constants';
import { CurrencyType } from '../types/workers';
import WebApp from '@twa-dev/sdk';

const INITIAL_TASKS: Task[] = [
  {
    id: 'join_telegram',
    title: 'Join Telegram Channel',
    description: 'Join the official EMSX Mining Telegram channel',
    link: 'https://t.me/EMSXM',
    completed: false,
    reward: {
      type: 'miner',
      level: 5,
      minerType: 'emsx'
    }
  },
  {
    id: 'follow_twitter',
    title: 'Follow on Twitter',
    description: 'Follow EMSX Mining official Twitter account',
    link: 'https://x.com/EMSX_M',
    completed: false,
    reward: {
      type: 'miner',
      level: 5,
      minerType: 'emsx'
    }
  },
  {
    id: 'visit_google',
    title: 'Visit Google',
    description: 'Visit Google.com to test task completion',
    link: 'https://google.com',
    completed: false,
    reward: {
      type: 'miner',
      level: 3,
      minerType: 'emsx'
    }
  }
];

const initialState: TaskState = {
  tasks: INITIAL_TASKS,
  claimedRewards: []
};

export function useTaskSystem() {
  const [taskState, setTaskState] = useLocalStorage<TaskState>('taskSystem', initialState);

  const verifyTaskCompletion = useCallback(async (taskId: string): Promise<boolean> => {
    return true;
  }, []);

  const handleTaskLink = useCallback(async (task: Task) => {
    if (task.completed) return false;

    if (task.id === 'join_telegram') {
      await WebApp.openTelegramLink(task.link);
    } else {
      window.open(task.link, '_blank');
    }

    // Random delay between 5-15 seconds
    const delay = Math.floor(Math.random() * (15000 - 5000 + 1) + 5000);
    await new Promise(resolve => setTimeout(resolve, delay));

    const verified = await verifyTaskCompletion(task.id);
    if (verified) {
      setTaskState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === task.id ? { ...t, completed: true, completedAt: Date.now() } : t
        )
      }));
      return true;
    }
    return false;
  }, [setTaskState, verifyTaskCompletion]);

  const completeTask = useCallback(async (taskId: string): Promise<boolean> => {
    const task = taskState.tasks.find(t => t.id === taskId);
    if (!task || task.completed) return false;

    const completed = await handleTaskLink(task);
    return completed;
  }, [taskState.tasks, handleTaskLink]);

  const canClaimReward = useCallback((taskId: string): boolean => {
    const task = taskState.tasks.find(t => t.id === taskId);
    return Boolean(
      task?.completed && 
      !taskState.claimedRewards.includes(taskId) &&
      (!task.completedAt || Date.now() - task.completedAt < 24 * 60 * 60 * 1000)
    );
  }, [taskState.tasks, taskState.claimedRewards]);

  const createRewardMiner = useCallback((task: Task): Worker => {
    const workerConfig = WORKER_TYPES[task.reward.minerType];
    const minerType = task.reward.minerType as CurrencyType;
    const baseRate = GAME_CONFIG.BASE_MINING_RATES[minerType] * 
                    workerConfig.stats.baseRate * 
                    Math.pow(GAME_CONFIG.LEVEL_MULTIPLIER, task.reward.level - 1);

    return {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: task.reward.minerType,
      level: task.reward.level,
      position: -1,
      miningRate: baseRate,
      stats: { ...workerConfig.stats },
      lastCollected: Date.now()
    };
  }, []);

  const claimReward = useCallback((taskId: string): Worker | null => {
    const task = taskState.tasks.find(t => t.id === taskId);
    if (!task || !canClaimReward(taskId)) return null;

    const rewardMiner = createRewardMiner(task);
    setTaskState(prev => ({
      ...prev,
      claimedRewards: [...prev.claimedRewards, taskId]
    }));

    return rewardMiner;
  }, [taskState.tasks, canClaimReward, setTaskState, createRewardMiner]);

  return {
    tasks: taskState.tasks,
    completeTask,
    canClaimReward,
    claimReward
  };
}