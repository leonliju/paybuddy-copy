import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { forecastService } from '../services/forecastService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import Skeleton from '../components/shared/Skeleton';
import ErrorState from '../components/shared/ErrorState';
import { formatINR, CHART_ANIMATION, getCategoryColor } from '../lib/chartTheme';

const CATEGORIES = [
  'all', 'Food', 'Travel', 'Bills', 'Shopping', 'Education', 'Medical', 'Entertainment'
];

export function Forecasting() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const data = await forecastService.getForecast(cat);
      setForecastData(data);
    } catch (err) {
      console.error('Failed to load forecast:', err);
      setError('Unable to compute statistical time-series projections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedCategory);
  }, [selectedCategory]);

  // Construct chart series
  const buildChartData = () => {
    const historicalList = forecastData?.historical || forecastData?.history;
    if (!forecastData || forecastData.insufficient_data || !Array.isArray(historicalList) || historicalList.length === 0) {
      return [];
    }

    const series = historicalList.map((h) => ({
      month: h.month,
      actual: h.total,
      lr_forecast: null,
      arima_forecast: null,
    }));

    // Add forecast point for next month
    const projMonth = forecastData.forecast_month || 'Next Month';
    const lastItem = series[series.length - 1];

    series.push({
      month: projMonth.includes('(Proj)') ? projMonth : `${projMonth} (Proj)`,
      actual: null,
      lr_forecast: forecastData.lr_forecast ?? null,
      arima_forecast: forecastData.arima_forecast ?? null,
    });

    // Bridge last actual to projection for smooth visual continuity
    if (lastItem) {
      lastItem.lr_forecast = lastItem.actual;
      if (forecastData.arima_forecast) {
        lastItem.arima_forecast = lastItem.actual;
      }
    }

    return series;
  };

  const chartData = buildChartData();

  const championModel =
    forecastData?.champion_model === 'arima' ? 'ARIMA (1,1,1)' : 'Linear Regression';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
            Predictive Spending Forecasting
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Dual statistical engine comparing Ordinary Least Squares Linear Regression vs Autoregressive Integrated Moving Average (ARIMA).
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex rounded-2xl bg-[#141416] p-1 border border-white/15 overflow-x-auto custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const dotColor = cat !== 'all' ? getCategoryColor(cat) : null;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {dotColor && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: dotColor,
                      boxShadow: isSelected ? 'none' : `0 0 6px ${dotColor}`,
                    }}
                  />
                )}
                <span>{cat === 'all' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      ) : error ? (
        <ErrorState description={error} onRetry={() => fetchForecast(selectedCategory)} />
      ) : forecastData?.insufficient_data ? (
        /* Insufficient Data Warning Notice */
        <GlassCard className="p-8 text-center space-y-4 max-w-xl mx-auto border-amber-500/30 bg-amber-500/[0.02]">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F59E0B] mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Insufficient Data For Time-Series Forecasting</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {forecastData.message || 'Need at least 3 consecutive months of recorded debit spending to construct statistical regression models.'}
          </p>
          <div className="p-3.5 rounded-xl bg-white/5 text-xs text-zinc-300 font-mono">
            Tip: Use the Ingestion tab to import older CSV statement history or generate a simulated stream.
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Top Projection Hero Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="space-y-2 border-white/20 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Next Month Forecast ({selectedCategory})
                </span>
                <Badge variant="silver" size="sm">
                  {championModel}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white font-display">
                <AnimatedNumber
                  value={
                    championModel === 'ARIMA (1,1,1)'
                      ? forecastData.arima_forecast
                      : forecastData.lr_forecast
                  }
                />
              </div>
              <p className="text-xs text-zinc-400">
                Estimated total expected outflow based on optimal model
              </p>
            </GlassCard>

            <GlassCard className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Linear Regression Fit</span>
                <span className="text-xs font-mono text-zinc-400">MAE: ₹{forecastData.mae_lr}</span>
              </div>
              <div className="text-2xl font-bold text-white font-display">
                <AnimatedNumber value={forecastData.lr_forecast} />
              </div>
              <p className="text-xs text-zinc-400">Linear trend extrapolation</p>
            </GlassCard>

            <GlassCard className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">ARIMA (1,1,1) Time-Series</span>
                <span className="text-xs font-mono text-zinc-400">
                  {forecastData.arima_forecast ? `MAE: ₹${forecastData.mae_arima}` : 'Req. 6 Months'}
                </span>
              </div>
              <div className="text-2xl font-bold text-white font-display">
                {forecastData.arima_forecast ? (
                  <AnimatedNumber value={forecastData.arima_forecast} />
                ) : (
                  <span className="text-sm font-normal text-zinc-400">Needs 6+ months history</span>
                )}
              </div>
              <p className="text-xs text-zinc-400">Autoregressive Moving Average</p>
            </GlassCard>
          </div>

          {/* Forecast Chart */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  Historical vs Model Projections
                </h3>
                <p className="text-xs text-zinc-400">Solid line: Historical spend • Dashed lines: Model forecast projections</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00D09C] shadow-[0_0_8px_#00D09C]" />
                  <span className="text-xs text-zinc-300 font-medium">Observed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  <span className="text-xs text-zinc-300 font-medium">Linear Reg</span>
                </div>
                {forecastData.arima_forecast && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
                    <span className="text-xs text-zinc-300 font-medium">ARIMA (1,1,1)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-[#121214]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-2xl min-w-[190px] select-none animate-fade-in">
                          <div className="text-xs font-mono font-medium text-zinc-400 mb-2 pb-1 border-b border-white/10">
                            {label}
                          </div>
                          <div className="space-y-1.5 text-xs">
                            {payload.map((p, idx) => {
                              const nameLabel =
                                p.dataKey === 'actual'
                                  ? 'Observed Outflow'
                                  : p.dataKey === 'lr_forecast'
                                  ? 'Linear Regression'
                                  : 'ARIMA (1,1,1)';
                              return (
                                <div key={idx} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-zinc-300 font-medium">{nameLabel}</span>
                                  </div>
                                  <span className="font-bold text-white tabular-nums font-mono">
                                    {p.value ? formatINR(p.value) : 'N/A'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#00D09C"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#00D09C', strokeWidth: 1, stroke: '#FFFFFF' }}
                    activeDot={{ r: 7, fill: '#00D09C', stroke: '#FFFFFF', strokeWidth: 2 }}
                    name="actual"
                    {...CHART_ANIMATION}
                  />
                  <Line
                    type="monotone"
                    dataKey="lr_forecast"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: '#38BDF8' }}
                    activeDot={{ r: 6, fill: '#38BDF8', stroke: '#FFFFFF', strokeWidth: 2 }}
                    name="lr_forecast"
                    {...CHART_ANIMATION}
                  />
                  {forecastData.arima_forecast && (
                    <Line
                      type="monotone"
                      dataKey="arima_forecast"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#F59E0B' }}
                      activeDot={{ r: 6, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
                      name="arima_forecast"
                      {...CHART_ANIMATION}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Model Duel Comparison Table */}
          <GlassCard className="space-y-4">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-semibold text-white font-display">Statistical Model Duel</h3>
              <p className="text-xs text-zinc-400">Comparative evaluation of prediction error metrics</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/8 text-zinc-400 font-mono uppercase">
                    <th className="py-3 px-3">Model Architecture</th>
                    <th className="py-3 px-3">Projected Amount</th>
                    <th className="py-3 px-3">Mean Absolute Error (MAE)</th>
                    <th className="py-3 px-3">Evaluation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className={championModel === 'Linear Regression' ? 'bg-white/5' : ''}>
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-zinc-300" />
                      <span>Ordinary Least Squares Linear Regression</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white tabular-nums">
                      ₹{forecastData.lr_forecast?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-400">₹{forecastData.mae_lr}</td>
                    <td className="py-3 px-3">
                      {championModel === 'Linear Regression' ? (
                        <Badge variant="green" size="sm">Champion Fit</Badge>
                      ) : (
                        <span className="text-zinc-400">Secondary</span>
                      )}
                    </td>
                  </tr>

                  <tr className={championModel === 'ARIMA (1,1,1)' ? 'bg-white/5' : ''}>
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                      <span>Autoregressive Integrated Moving Average ARIMA(1,1,1)</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white tabular-nums">
                      {forecastData.arima_forecast ? `₹${forecastData.arima_forecast.toLocaleString('en-IN')}` : 'N/A'}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-400">
                      {forecastData.mae_arima !== undefined ? `₹${forecastData.mae_arima}` : 'Insufficient points (<6)'}
                    </td>
                    <td className="py-3 px-3">
                      {forecastData.arima_forecast ? (
                        championModel === 'ARIMA (1,1,1)' ? (
                          <Badge variant="green" size="sm">Champion Fit</Badge>
                        ) : (
                          <span className="text-zinc-400">Secondary</span>
                        )
                      ) : (
                        <Badge variant="amber" size="sm">Needs 6+ Months</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}

export default Forecasting;
