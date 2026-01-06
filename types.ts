
export type UserRole = 'user' | 'admin' | 'guest';

export interface WithdrawalRecord {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  account: string;
}

export interface UserProfile {
  id: string;
  username: string;
  balance: number;
  completedTasks: number;
  completedTaskIds: string[];
  streak: number;
  lastCheckIn?: string;
  referralCode: string;
  referralCount: number;
  withdrawalHistory: WithdrawalRecord[];
  pendingWithdrawal?: {
    amount: number;
    method: string;
    date: string;
  };
  role: UserRole;
}

export interface AdCampaign {
  id: string;
  sponsorName: string;
  reward: number;
  category: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
}

export interface GeneratedAd {
  headline: string;
  body: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface EarnTask {
  id: string;
  title: string;
  reward: number;
  icon: string;
  status: 'available' | 'completed' | 'pending';
  description: string;
}

export type AppView = 'home' | 'earn' | 'leaderboard' | 'wallet' | 'admin_dashboard' | 'admin_users' | 'admin_payouts' | 'admin_tasks';
