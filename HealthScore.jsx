import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { healthService } from '../services/healthService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/shared/Skeleton';
import ErrorState from '../components/shared/ErrorState';

export function HealthScore() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await healthService.getScore();
      setHealth(res);
    } catch (err) {
      console.error('Failed to load health score:', err);
      setError('Unable to calculate financial health score. Please ensure transaction data is loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={fetchScore} />;
  }

  const score = health?.score || 0;
  const classification = health?.risk_classification || 'Balanced';

  const badgeColor =
    classification === 'Saver'
      ? 'green'
      : classification === 'Balanced'
      ? 'silver'
      : classification === 'Risky'
      ? 'amber'
      : 'red';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
          Financial Health & Risk Profile
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          Multi-factor algorithmic health score evaluating savings discipline, budget compliance, discretionary ratios, and cashflow stability.
        </p>
      </div>

      {/* Hero Health Gauge Banner */}
      <GlassCard className="p-8 relative overflow-hidden bg-[#141416] border-white/15">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Outer Circular Progress SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${
                    score >= 80
                      ? 'stroke-[#00D09C]'
                      : score >= 60
                      ? 'stroke-white'
                      : score >= 40
                      ? 'stroke-[#F59E0B]'
                      : 'stroke-[#EF4444]'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white tabular-nums font-display">
                  {score}
                </span>
                <span className="text-[10px] font-mono uppercase text-zinc-400">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-zinc-400">Classification</span>
                <Badge variant={badgeColor} size="sm">
                  {classification}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {classification === 'Saver' && 'Exemplary Capital Discipline'}
                {classification === 'Balanced' && 'Healthy Balanced Cashflow'}
                {classification === 'Risky' && 'Moderate Financial Vulnerability'}
                {classification === 'Impulsive' && 'High Burn Rate Detected'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed">
                Your monthly score reflects strong control over non-essential expenses and regular savings allocations.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[11px] font-mono uppercase text-zinc-400">Savings Rate</div>
              <div className="text-xl font-bold text-[#00D09C] mt-1 tabular-nums">
                {health?.savings_rate || 25}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[11px] font-mono uppercase text-zinc-400">Essential Ratio</div>
              <div className="text-xl font-bold text-white mt-1 tabular-nums">
                {health?.essential_ratio || 55}%
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 5-Factor Health Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white font-display">Factor Decomposition</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Factor 1: Savings Rate */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D09C]" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Savings Rate (Weight: 25%)
                </h4>
              </div>
              <span className="text-sm font-bold text-white font-display">
                {health?.components?.savings_rate?.score || 90}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#00D09C] rounded-full"
                style={{ width: `${health?.components?.savings_rate?.score || 90}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {health?.components?.savings_rate?.description ||
                'Measures percentage of total monthly income retained as net surplus.'}
            </p>
          </GlassCard>

          {/* Factor 2: Budget Adherence */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Budget Adherence (Weight: 25%)
                </h4>
              </div>
              <span className="text-sm font-bold text-white font-display">
                {health?.components?.budget_adherence?.score || 85}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-zinc-300 rounded-full"
                style={{ width: `${health?.components?.budget_adherence?.score || 85}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {health?.components?.budget_adherence?.description ||
                'Assesses how closely monthly spending stays within established category ceilings.'}
            </p>
          </GlassCard>

          {/* Factor 3: Discretionary Ratio */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Discretionary Ratio (Weight: 20%)
                </h4>
              </div>
              <span className="text-sm font-bold text-white font-display">
                {health?.components?.discretionary_ratio?.score || 75}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-full"
                style={{ width: `${health?.components?.discretionary_ratio?.score || 75}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {health?.components?.discretionary_ratio?.description ||
                'Monitors proportion of funds directed to wants (Dining, Shopping) versus essential bills.'}
            </p>
          </GlassCard>

          {/* Factor 4: Income Stability */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Income Stability (Weight: 15%)
                </h4>
              </div>
              <span className="text-sm font-bold text-white font-display">
                {health?.components?.income_stability?.score || 90}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${health?.components?.income_stability?.score || 90}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {health?.components?.income_stability?.description ||
                'Evaluates consistency of salary inflow dates and recurring deposit predictability.'}
            </p>
          </GlassCard>

          {/* Factor 5: Anomaly Frequency */}
          <GlassCard className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Anomaly Penalty (Weight: 15%)
                </h4>
              </div>
              <span className="text-sm font-bold text-white font-display">
                {health?.components?.anomaly_frequency?.score || 85}/100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#F59E0B] rounded-full"
                style={{ width: `${health?.components?.anomaly_frequency?.score || 85}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">
              {health?.components?.anomaly_frequency?.description ||
                'Penalizes uncharacteristic single-day large expense bursts that disrupt savings trajectories.'}
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <GlassCard className="space-y-4">
        <div className="border-b border-white/5 pb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-300" />
          <h3 className="text-base font-semibold text-white font-display">
            Personalised Action Recommendations
          </h3>
        </div>

        <div className="space-y-3">
          {health?.recommendations && health.recommendations.length > 0 ? (
            health.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs leading-relaxed"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </div>
                <div>
                  <h5 className="font-semibold text-white">{rec.title}</h5>
                  <p className="text-zinc-400 mt-0.5">{rec.action}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-white">Maintain Current Savings Cadence</h5>
                <p className="text-zinc-400 mt-0.5">
                  Continue capping discretionary shopping below ₹5,000 to maximize surplus for upcoming targets.
                </p>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default HealthScore;
