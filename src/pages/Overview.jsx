import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  UploadCloud,
  Layers,
  BarChart3,
  AlertTriangle,
  HeartPulse,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { healthService } from '../services/healthService';
import GlassCard from '../components/shared/GlassCard';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/shared/Skeleton';
import ErrorState from '../components/shared/ErrorState';
import BottomSheet from '../components/shared/BottomSheet';
import { getCategoryColor } from '../lib/chartTheme';
import {
  InteractiveCategoryDonut,
  InteractiveBarChartComponent,
} from '../components/shared/InteractiveChartElements';

export function Overview() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bottom Sheet for selected transaction detail
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, catRes, trendRes, recentRes, healthRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getByCategory(),
        analyticsService.getMonthlyTrend(),
        analyticsService.getRecent(),
        healthService.getScore().catch(() => null),
      ]);
      setSummary(sumRes);
      setCategories(catRes || []);
      setTrend(trendRes || []);
      setRecentTxns(recentRes || []);
      setHealthScore(healthRes);
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
      setError('Unable to retrieve financial intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-5 space-y-3">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-32 h-8" />
              <Skeleton className="w-40 h-3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Health Score Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141416] p-6 rounded-3xl border border-white/15 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">
              Live Financial Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
            Financial Health & Spending Overview
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg">
            PayBuddy continuous ingestion pipeline and hybrid classifier active.
          </p>
        </div>

        {healthScore && (
          <Link
            to="/health-score"
            className="flex items-center gap-4 bg-[#0B0B0C] hover:bg-[#1A1A1E] border border-white/15 px-5 py-3.5 rounded-2xl transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#00D09C]/15 border border-[#00D09C]/30 flex items-center justify-center text-[#00D09C] group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-mono text-zinc-400">Health Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tabular-nums font-display">
                  {healthScore.score}
                </span>
                <span className="text-xs font-medium text-[#00D09C]">{healthScore.risk_classification}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          </Link>
        )}
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Total Income</span>
            <div className="w-8 h-8 rounded-full bg-[#00D09C]/15 flex items-center justify-center text-[#00D09C]">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              <AnimatedNumber value={summary?.total_income || 0} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Current Month Credit Inflow</p>
          </div>
        </GlassCard>

        {/* Total Expenses */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Total Expenses</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              <AnimatedNumber value={summary?.total_expenses || 0} />
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={summary?.expense_change_pct > 0 ? 'text-amber-400' : 'text-[#00D09C]'}>
                {summary?.expense_change_pct > 0 ? `+${summary?.expense_change_pct}%` : `${summary?.expense_change_pct}%`}
              </span>
              <span className="text-zinc-400">vs last month</span>
            </div>
          </div>
        </GlassCard>

        {/* Net Monthly Balance */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Net Surplus</span>
            <div className="w-8 h-8 rounded-full bg-[#00D09C]/15 flex items-center justify-center text-[#00D09C]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#00D09C]">
              <AnimatedNumber value={summary?.net || 0} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Available for savings & goals</p>
          </div>
        </GlassCard>

        {/* Active Transactions */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Active Records</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white tabular-nums">
              {summary?.transaction_count || recentTxns.length}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Processed in DuckDB database</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Trend Chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">6-Month Spending Trend</h3>
              <p className="text-xs text-zinc-400">Monthly debit expenditure aggregates • Hover for details</p>
            </div>
            <Link to="/analytics" className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-medium font-mono">
              <span>Deep Dive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <InteractiveBarChartComponent
              data={trend}
              xKey="month"
              yKey="total"
              height={240}
              unitLabel="Monthly Spend"
            />
          </div>
        </GlassCard>

        {/* Category Breakdown Donut */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">Category Mix</h3>
              <p className="text-xs text-zinc-400">Interactive spending distribution</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">{categories.length} Categories</span>
          </div>

          <InteractiveCategoryDonut
            data={categories}
            dataKey="total"
            nameKey="category"
            height={200}
            innerRadius={55}
            outerRadius={80}
            showLegend={true}
            maxLegendItems={3}
          />
        </GlassCard>
      </div>

      {/* Quick Launchpad Action Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/ingestion"
          className="flex items-center gap-3 p-4 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/30 hover:bg-[#1A1A1E] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Import Data</div>
            <div className="text-[11px] text-zinc-400 font-mono">CSV, PDF, SMS</div>
          </div>
        </Link>

        <Link
          to="/categorisation"
          className="flex items-center gap-3 p-4 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/30 hover:bg-[#1A1A1E] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Review Queue</div>
            <div className="text-[11px] text-zinc-400 font-mono">Classifier Feedback</div>
          </div>
        </Link>

        <Link
          to="/forecasting"
          className="flex items-center gap-3 p-4 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/30 hover:bg-[#1A1A1E] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Forecast Model</div>
            <div className="text-[11px] text-zinc-400 font-mono">ARIMA vs LR Duel</div>
          </div>
        </Link>

        <Link
          to="/assistant"
          className="flex items-center gap-3 p-4 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/30 hover:bg-[#1A1A1E] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">AI Assistant</div>
            <div className="text-[11px] text-zinc-400 font-mono">Grounded RAG</div>
          </div>
        </Link>
      </div>

      {/* Recent Transactions List */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white font-display">Recent Ingested Transactions</h3>
            <p className="text-xs text-zinc-400">Latest financial records categorized by PayBuddy</p>
          </div>
          <Link to="/ingestion" className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 font-medium font-mono">
            <span>Manage All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentTxns.length > 0 ? (
            recentTxns.slice(0, 7).map((t) => (
              <div
                key={t.transaction_id}
                onClick={() => setSelectedTxn(t)}
                className="py-3.5 px-2 flex items-center justify-between hover:bg-white/[0.02] rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold ${
                      t.direction === 'credit'
                        ? 'bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30'
                        : 'bg-white/5 text-[#8A8F98] border border-white/10'
                    }`}
                  >
                    {t.direction === 'credit' ? '+' : '₹'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white tracking-tight">
                      {t.merchant || t.description || 'Transaction'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span className="text-zinc-200 font-medium">{t.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-semibold tabular-nums ${
                      t.direction === 'credit' ? 'text-[#00D09C]' : 'text-white'
                    }`}
                  >
                    {t.direction === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-0.5">
                    <Badge
                      size="sm"
                      variant={t.confidence >= 0.8 ? 'green' : t.confidence >= 0.6 ? 'amber' : 'silver'}
                    >
                      {Math.round((t.confidence || 0.5) * 100)}% conf
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-400">
              No transactions recorded yet. Click 'Import Data' to get started.
            </div>
          )}
        </div>
      </GlassCard>

      {/* Transaction Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Intelligence Detail"
        subtitle={`ID: #${selectedTxn?.transaction_id} • Source: ${selectedTxn?.source || 'Manual'}`}
      >
        {selectedTxn && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/8">
              <div>
                <span className="text-xs text-zinc-400 font-mono uppercase">Amount</span>
                <div className="text-2xl font-bold text-white">
                  {selectedTxn.direction === 'credit' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString('en-IN')}
                </div>
              </div>
              <Badge variant={selectedTxn.direction === 'credit' ? 'green' : 'silver'} size="lg">
                {selectedTxn.direction.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 font-mono uppercase">Merchant</span>
                <div className="font-semibold text-white mt-1">{selectedTxn.merchant || 'N/A'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 font-mono uppercase">Category</span>
                <div className="font-semibold text-white mt-1">{selectedTxn.category}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 font-mono uppercase">Date</span>
                <div className="font-semibold text-white mt-1">{selectedTxn.date}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-zinc-400 font-mono uppercase">Confidence</span>
                <div className="font-semibold text-[#00D09C] mt-1">
                  {Math.round((selectedTxn.confidence || 0.5) * 100)}%
                </div>
              </div>
            </div>

            {selectedTxn.description && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                <span className="text-zinc-400 font-mono uppercase">Raw Description</span>
                <p className="text-white mt-1 font-mono text-[11px] break-all">{selectedTxn.description}</p>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <Link
                to="/categorisation"
                className="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-xs hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                Review Category Feedback
              </Link>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default Overview;
