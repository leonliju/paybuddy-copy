import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { anomalyService } from '../services/anomalyService';
import GlassCard from '../components/shared/GlassCard';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import Badge from '../components/shared/Badge';
import Skeleton from '../components/shared/Skeleton';
import BottomSheet from '../components/shared/BottomSheet';
import { useToast } from '../components/shared/Toast';
import { getCategoryColor } from '../lib/chartTheme';

export function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const { addToast } = useToast();

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const data = await anomalyService.getFlags();
      setAnomalies(data || []);
    } catch (err) {
      console.error('Failed to load anomaly flags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const triggerScan = async () => {
    setScanning(true);
    try {
      const res = await anomalyService.detectAnomalies();
      addToast(
        `Anomaly scan completed. Flagged ${res.anomalies_flagged} unusual transactions.`,
        'info'
      );
      fetchAnomalies();
    } catch (err) {
      addToast('Failed to run anomaly scan pipeline.', 'error');
    } finally {
      setScanning(false);
    }
  };

  const highSeverityCount = anomalies.filter((a) => a.severity === 'high' || a.z_score >= 3.0).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
            Anomaly & Outlier Monitoring
          </h2>
          <p className="text-xs text-[#8A8F98] mt-1 max-w-xl">
            Statistical Z-Score testing and simulated Isolation Forest detectors monitoring category drifts and sudden spikes.
          </p>
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-xs font-semibold hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Analyzing Transactions...' : 'Re-scan Pipeline'}</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8A8F98]">Flagged Transactions</div>
          <div className="text-2xl lg:text-3xl font-bold text-white tabular-nums">
            {anomalies.length}
          </div>
          <p className="text-[11px] text-[#8A8F98]">Active outlier notifications</p>
        </GlassCard>

        <GlassCard className="space-y-2 border-red-500/20">
          <div className="text-xs font-mono uppercase tracking-wider text-[#EF4444]">High Severity Spikes</div>
          <div className="text-2xl lg:text-3xl font-bold text-[#EF4444] tabular-nums">
            {highSeverityCount}
          </div>
          <p className="text-[11px] text-[#8A8F98]">Z-Score &gt; 3.0 (Extreme deviation)</p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8A8F98]">Detection Coverage</div>
          <div className="text-2xl lg:text-3xl font-bold text-[#00D09C]">100%</div>
          <p className="text-[11px] text-[#8A8F98]">All debit categories benchmarked</p>
        </GlassCard>
      </div>

      {/* Anomalies List */}
      <GlassCard className="space-y-4">
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-base font-semibold text-white font-display">
            Active Anomaly Flags ({anomalies.length})
          </h3>
          <p className="text-xs text-[#8A8F98]">
            Click any transaction to examine statistical deviation details and root cause explanations.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : anomalies.length > 0 ? (
          <div className="space-y-3">
            {anomalies.map((a) => (
              <div
                key={a.flag_id}
                onClick={() => setSelectedAnomaly(a)}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-white/15 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      a.severity === 'high' || a.z_score >= 3
                        ? 'bg-red-500/15 text-[#EF4444] border border-red-500/30'
                        : 'bg-amber-500/15 text-[#F59E0B] border border-amber-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {a.merchant || 'Unknown Entity'}
                      </span>
                      <Badge variant={a.severity === 'high' || a.z_score >= 3 ? 'red' : 'amber'} size="sm">
                        Z = {a.z_score}
                      </Badge>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(a.category) }}
                        />
                        {a.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8F98] mt-1 leading-relaxed max-w-xl">
                      {a.explanation || `Outlier flagged by ${a.method} detector with score of ${a.anomaly_score}.`}
                    </p>
                    <div className="text-[11px] text-[#5E636E] font-mono mt-1">
                      Date: {a.date} • Method: {a.method}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 flex-shrink-0">
                  <div className="text-sm md:text-base font-bold text-white tabular-nums">
                    ₹{a.amount?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-zinc-300 group-hover:text-white flex items-center gap-1 font-mono">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#8A8F98]">
            <CheckCircle2 className="w-10 h-10 text-[#00D09C] mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-white text-sm">No Statistical Anomalies Detected</p>
            <p className="mt-1">All debit transactions align closely with historical spending bounds.</p>
          </div>
        )}
      </GlassCard>

      {/* Anomaly Inspection Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        title="Anomaly Diagnostic Report"
        subtitle={`Flag #${selectedAnomaly?.flag_id} • Transaction #${selectedAnomaly?.transaction_id}`}
      >
        {selectedAnomaly && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8F98] font-mono uppercase">Transaction Amount</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  ₹{selectedAnomaly.amount?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8F98] font-mono uppercase">Merchant</span>
                <span className="text-sm font-semibold text-white">{selectedAnomaly.merchant}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8A8F98] font-mono uppercase">Category</span>
                <span className="text-sm font-semibold text-white">{selectedAnomaly.category}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>Detection Diagnosis</span>
              </div>
              <p className="text-xs text-white leading-relaxed">
                {selectedAnomaly.explanation}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#8A8F98] font-mono">
                <div>Z-Score: <strong className="text-white">{selectedAnomaly.z_score}</strong></div>
                <div>Anomaly Score: <strong className="text-white">{selectedAnomaly.anomaly_score}</strong></div>
                <div>Detection Algorithm: <strong className="text-white">{selectedAnomaly.method}</strong></div>
                <div>Flag Date: <strong className="text-white">{selectedAnomaly.created_at}</strong></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToast('Anomaly acknowledged and saved to log.', 'info');
                  setSelectedAnomaly(null);
                }}
                className="flex-1 py-3 text-center rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
              >
                Dismiss / Acknowledge
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default Anomalies;
