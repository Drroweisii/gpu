export interface Task {
  id: string;
  title: string;
  description: string;
  link: string;
  completed: boolean;
  completedAt?: number;
  reward: {
    type: 'miner';
    level: number;
    minerType: string;
  };
}

export interface TaskState {
  tasks: Task[];
  claimedRewards: string[];
}