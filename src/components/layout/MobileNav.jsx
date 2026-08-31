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
} from 'lucide-react';

export function MobileNav() {
  const items = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Ingest', to: '/ingestion', icon: UploadCloud },
    { label: 'Review', to: '/categorisation', icon: Layers },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Forecast', to: '/forecasting', icon: TrendingUp },
    { label: 'Anomalies', to: '/anomalies', icon: AlertTriangle },
    { label: 'Health', to: '/health-score', icon: HeartPulse },
    { label: 'Budgets', to: '/budgets-goals', icon: Target },
    { label: 'AI', to: '/assistant', icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E10]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around overflow-x-auto custom-scrollbar">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-medium min-w-[52px] transition-colors
              ${
                isActive
                  ? 'text-white font-bold bg-white/10 border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }
            `}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default MobileNav;
