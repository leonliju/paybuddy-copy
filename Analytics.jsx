import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Store,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import GlassCard from '../components/shared/GlassCard';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/shared/Skeleton';
import ErrorState from '../components/shared/ErrorState';
import { getCategoryColor, formatINR, CHART_ANIMATION } from '../lib/chartTheme';
import {
  InteractiveCategoryDonut,
  InteractiveBarChartComponent,
} from '../components/shared/InteractiveChartElements';

export function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trend, setTrend] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState([]);
  const [merchantFreq, setMerchantFreq] = useState([]);
  const [cashflow, setCashflow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, catRes, trendRes, dayRes, merchRes, cashRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getByCategory(),
        analyticsService.getMonthlyTrend(),
        analyticsService.getDayOfWeek(),
        analyticsService.getMerchantFrequency(),
        analyticsService.getCashflowCalendar(),
      ]);
      setSummary(sumRes);
      setCategories(catRes || []);
      setTrend(trendRes || []);
      setDayOfWeek(dayRes || []);
      setMerchantFreq(merchRes || []);
      setCashflow(cashRes || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Unable to retrieve financial intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={fetchAnalytics} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
          Financial Intelligence & Behavioural Analytics
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          Statistical aggregates computed across DuckDB transaction records for deep pattern identification.
        </p>
      </div>

      {/* MoM Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Current Month Outflow</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              <AnimatedNumber value={summary?.total_expenses || 0} />
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={summary?.expense_change_pct > 0 ? 'text-amber-400 font-semibold' : 'text-[#00D09C] font-semibold'}>
                {summary?.expense_change_pct > 0 ? `+${summary?.expense_change_pct}%` : `${summary?.expense_change_pct}%`}
              </span>
              <span className="text-zinc-400">vs previous month (₹{summary?.previous_month_expenses?.toLocaleString('en-IN')})</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Income Inflow</span>
            <div className="w-8 h-8 rounded-full bg-[#00D09C]/15 flex items-center justify-center text-[#00D09C]">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-[#00D09C]">
              <AnimatedNumber value={summary?.total_income || 0} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">Total recorded earnings</p>
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Net Monthly Surplus</span>
            <div className="w-8 h-8 rounded-full bg-[#00D09C]/15 flex items-center justify-center text-[#00D09C]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              <AnimatedNumber value={summary?.net || 0} />
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-mono">Available rate: {summary?.total_income > 0 ? Math.round((summary?.net / summary?.total_income) * 100) : 0}%</p>
          </div>
        </GlassCard>
      </div>

      {/* Row 1: 6-Month Income vs Expense Trend & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Month Area Trend Chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">6-Month Cashflow Trajectory</h3>
              <p className="text-xs text-zinc-400">Historical inflow vs expenditure trajectory • Hover data points</p>
            </div>
            <Badge variant="silver" size="sm">Monthly Aggregate</Badge>
          </div>

          <div className="h-72 w-full">
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D09C" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#00D09C" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-[#121214]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl min-w-[170px] select-none">
                          <div className="text-xs font-mono font-medium text-zinc-400 mb-2 pb-1 border-b border-white/10">
                            {label}
                          </div>
                          <div className="space-y-1.5 text-xs">
                            {payload.map((p, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                  <span className="text-zinc-300 font-medium">{p.name}</span>
                                </div>
                                <span className="font-bold text-white tabular-nums font-mono">
                                  {formatINR(p.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#A1A1AA', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#00D09C"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incomeGrad)"
                    name="Inflow (Income)"
                    activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                    {...CHART_ANIMATION}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#A855F7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#expenseGrad)"
                    name="Outflow (Expenses)"
                    activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                    {...CHART_ANIMATION}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">No historical data found.</div>
            )}
          </div>
        </GlassCard>

        {/* Category Share Breakdown */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">Category Portfolio</h3>
              <p className="text-xs text-zinc-400">Interactive budget allocation</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">{categories.length} Categories</span>
          </div>

          <InteractiveCategoryDonut
            data={categories}
            dataKey="total"
            nameKey="category"
            height={220}
            innerRadius={55}
            outerRadius={80}
            showLegend={true}
            maxLegendItems={4}
          />
        </GlassCard>
      </div>

      {/* Row 2: Day of Week Spending Distribution & Merchant Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day-of-Week Spending Heatmap / Distribution */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">Day-of-Week Spending Rhythm</h3>
              <p className="text-xs text-zinc-400">Identifies weekend spikes vs weekday baselines • Hover bars</p>
            </div>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="h-64 w-full">
            <InteractiveBarChartComponent
              data={dayOfWeek}
              xKey="day"
              yKey="total"
              height={240}
              unitLabel="Daily Spend"
            />
          </div>
        </GlassCard>

        {/* Top Merchant Frequency Table */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">Top Merchant Frequency</h3>
              <p className="text-xs text-zinc-400">Highest recurring spend destinations</p>
            </div>
            <Store className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/8 text-zinc-400 font-mono uppercase">
                  <th className="py-2.5 px-2">Merchant</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-center">Frequency</th>
                  <th className="py-2.5 px-2 text-right">Total Outflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {merchantFreq.length > 0 ? (
                  merchantFreq.map((m, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-2 font-semibold text-white">{m.merchant}</td>
                      <td className="py-2.5 px-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(m.category) }}
                          />
                          {m.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-zinc-400 font-mono">{m.count} txns</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-white tabular-nums">
                        ₹{m.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-zinc-400">
                      No merchant frequency records recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Cashflow Calendar (Recurring Outflow Day-of-Month) */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white font-display">Cashflow Recurring Calendar</h3>
            <p className="text-xs text-zinc-400">Day-of-month clustering of bills and regular commitments</p>
          </div>
          <Calendar className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {cashflow.length > 0 ? (
            cashflow.slice(0, 12).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">Day {item.day_of_month}</span>
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                </div>
                <div className="font-semibold text-xs text-white truncate">{item.merchant}</div>
                <div className="text-xs text-[#00D09C] font-semibold mt-1 tabular-nums">
                  ₹{item.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-xs text-zinc-400">
              No recurring commitments detected yet.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default Analytics;
