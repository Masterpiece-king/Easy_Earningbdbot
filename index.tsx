import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, Zap, Award, Wallet, Coins, LogOut, TrendingUp, ArrowRight, User, 
  ChevronRight, Loader2, CheckCircle2, Tv, Trophy, Send, Users, 
  ExternalLink, Copy, UserPlus, Star, Info, ShieldCheck, History, Clock, X,
  ClipboardList, AlertCircle, Sparkles, LayoutDashboard, CreditCard, 
  Smartphone, DollarSign, Landmark, Phone, ShieldAlert, Key, Search,
  Layout, Layers, MonitorPlay, PlayCircle, Fingerprint
} from 'lucide-react';

// --- Components ---
import Dashboard from './components/Dashboard.tsx';
import EarnView from './components/EarnView.tsx';
import WalletView from './components/WalletView.tsx';
import AdminPanel from './components/AdminPanel.tsx';

// --- Types ---
import { UserRole, AppView, UserProfile, WithdrawalRecord } from './types.ts';

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
          };
        };
      };
    };
  }
}

const getPersistentUserId = () => {
  const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (tgId) return `TG-${tgId}`;
  
  const savedId = localStorage.getItem('ebd_user_id_v3');
  if (savedId) return savedId;
  
  const newId = `EBD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  localStorage.setItem('ebd_user_id_v3', newId);
  return newId;
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [view, setView] = useState<AppView>('home');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    return {
      id: getPersistentUserId(), 
      username: tgUser?.username || tgUser?.first_name || 'Earner', 
      balance: 150, 
      completedTasks: 5, 
      completedTaskIds: [], 
      streak: 1,
      referralCode: `REF-${Math.floor(1000 + Math.random() * 9000)}`, 
      referralCount: 0, 
      withdrawalHistory: [],
      role: 'user'
    };
  });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    setInitialized(true);
  }, []);

  const handleReward = (amount: number, taskId?: string) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      completedTaskIds: taskId ? [...prev.completedTaskIds, taskId] : prev.completedTaskIds,
      completedTasks: taskId ? prev.completedTasks + 1 : prev.completedTasks
    }));
  };

  const handleWithdrawal = async (amount: number, method: string, account: string) => {
    const record: WithdrawalRecord = {
      id: `W${Math.floor(1000 + Math.random() * 9000)}`,
      amount,
      method,
      account,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };

    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
      withdrawalHistory: [record, ...prev.withdrawalHistory],
      pendingWithdrawal: { amount, method, date: record.date }
    }));
  };

  const handleNavigate = (v: AppView) => setView(v);

  if (!initialized) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (role === 'guest') {
    return (
      <div className="h-screen bg-slate-950 flex flex-col p-10 justify-center items-center space-y-12 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <Zap className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">earningBD</h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Next Gen Reward Hub</p>
        </div>

        {!isAdminLoginVisible ? (
          <div className="w-full max-w-xs space-y-4">
            <button onClick={() => setRole('user')} className="w-full bg-white text-slate-950 py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
               Portal Access <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setIsAdminLoginVisible(true)} className="w-full text-slate-700 font-black text-[10px] uppercase tracking-widest py-4">
               Admin Entry
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs space-y-6 animate-fadeIn">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Secure Pass Key</label>
               <input 
                type="password" 
                placeholder="Enter Key" 
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl px-8 py-5 text-center font-black text-red-600 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAdminLoginVisible(false)} className="flex-1 bg-slate-800 text-slate-500 py-5 rounded-2xl font-black text-[10px] uppercase">Back</button>
              <button 
                onClick={() => { 
                  if (adminKeyInput === 'admin123') {
                    setRole('admin');
                    setView('admin_dashboard');
                  } else {
                    alert("Wrong Key! Use admin123");
                  }
                }}
                className="flex-[2] bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/20"
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-slate-950 text-slate-100 relative overflow-hidden">
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-900 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            {role === 'admin' ? <ShieldCheck className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 fill-white text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">earningBD</h1>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{role} Portal</span>
          </div>
        </div>
        <button onClick={() => { setRole('guest'); setView('home'); }} className="p-2 text-slate-800 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {role === 'admin' ? (
          <AdminPanel view={view} onNavigate={handleNavigate} />
        ) : (
          <>
            {view === 'home' && <Dashboard user={user} onNavigate={handleNavigate} />}
            {view === 'earn' && <EarnView user={user} onComplete={handleReward} onReferralAdded={() => handleReward(10)} />}
            {view === 'wallet' && <WalletView user={user} onWithdraw={handleWithdrawal} onClearPending={() => setUser(p => ({...p, pendingWithdrawal: undefined}))} />}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-3xl border-t border-slate-800 flex justify-around py-6 z-50 px-6">
        {role === 'user' ? (
          <>
            {[
              { id: 'home', icon: Home, label: 'Hub' },
              { id: 'earn', icon: Zap, label: 'Earn' },
              { id: 'wallet', icon: Wallet, label: 'Wallet' }
            ].map(n => (
              <button key={n.id} onClick={() => setView(n.id as AppView)} className={`flex flex-col items-center gap-2 transition-all ${view === n.id ? 'text-red-600' : 'text-slate-500'}`}>
                <n.icon className={`w-7 h-7 ${view === n.id ? 'fill-red-600/10' : ''}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{n.label}</span>
              </button>
            ))}
          </>
        ) : (
          <>
            {[
              { id: 'admin_dashboard', icon: LayoutDashboard, label: 'Dash' },
              { id: 'admin_users', icon: Users, label: 'Users' },
              { id: 'admin_payouts', icon: CreditCard, label: 'Payouts' }
            ].map(n => (
              <button key={n.id} onClick={() => setView(n.id as AppView)} className={`flex flex-col items-center gap-2 transition-all ${view === n.id ? 'text-red-600' : 'text-slate-500'}`}>
                <n.icon className="w-7 h-7" />
                <span className="text-[9px] font-black uppercase tracking-widest">{n.label}</span>
              </button>
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}