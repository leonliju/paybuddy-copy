import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TopBar() {
  const location = useLocation();
  const { user } = useAuth();

  const routeTitles = {
    '/dashboard': 'Financial Overview',
    '/ingestion': 'Transaction Ingestion',
    '/categorisation': 'Categorisation Review',
    '/analytics': 'Intelligence Analytics',
    '/forecasting': 'Forecasting & Projections',
    '/anomalies': 'Anomaly & Outlier Monitoring',
    '/health-score': 'Financial Health Score',
    '/budgets-goals': 'Budgets & Savings Goals',
    '/assistant': 'Grounded AI Financial Assistant',
  };

  const currentTitle = routeTitles[location.pathname] || 'PayBuddy Intelligence';

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0B0B0C]/85 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      {/* Title & Context */}
      <div>
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
          {currentTitle}
        </h2>
        <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
          Personal Financial Intelligence Workspace • Black & Silver
        </p>
      </div>

      {/* Top right actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono">
          <Database className="w-3.5 h-3.5 text-zinc-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>DuckDB In-Memory</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
            {user?.username?.[0] || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
