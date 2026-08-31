import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Layers,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  Target,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PayBuddyLogo from '../shared/PayBuddyLogo';

export function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Import Transactions', to: '/ingestion', icon: UploadCloud },
    { label: 'Categorisation Review', to: '/categorisation', icon: Layers },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Forecasting', to: '/forecasting', icon: TrendingUp },
    { label: 'Anomaly Alerts', to: '/anomalies', icon: AlertTriangle },
    { label: 'Financial Health', to: '/health-score', icon: HeartPulse },
    { label: 'Budgets & Goals', to: '/budgets-goals', icon: Target },
    { label: 'AI Assistant', to: '/assistant', icon: Sparkles, badge: 'RAG' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0E0E10] border-r border-white/10 min-h-screen fixed left-0 top-0 bottom-0 z-30 select-none">
      {/* Brand Header with Brand Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <PayBuddyLogo size="sm" showText={true} subtitle="pay, analyse, predict" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
          Intelligence Suite
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group
                ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)] font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-zinc-200 border border-white/20">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 bg-[#09090B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center text-xs font-bold text-white uppercase border border-white/20 shadow-inner">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{user?.username || 'User'}</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Protected</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
