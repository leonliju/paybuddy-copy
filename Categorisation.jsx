import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Edit3,
} from 'lucide-react';
import { categorisationService } from '../services/categorisationService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import BottomSheet from '../components/shared/BottomSheet';
import { useToast } from '../components/shared/Toast';
import { getCategoryColor } from '../lib/chartTheme';

const CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Education',
  'Medical', 'Entertainment', 'Income', 'Other'
];

export function Categorisation() {
  const [lowConfTxns, setLowConfTxns] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [stats, setStats] = useState({ total_transactions: 0, corrections_made: 0, needs_review: 0 });
  const [loading, setLoading] = useState(true);

  // Correction BottomSheet state
  const [activeTxn, setActiveTxn] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [lowRes, overRes, statsRes] = await Promise.all([
        categorisationService.getLowConfidence(),
        categorisationService.getOverrides(),
        categorisationService.getStats(),
      ]);
      setLowConfTxns(lowRes || []);
      setOverrides(overRes || []);
      setStats(statsRes || { total_transactions: 0, corrections_made: 0, needs_review: 0 });
    } catch (err) {
      console.error('Failed to load categorisation review data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCorrectionSheet = (txn) => {
    setActiveTxn(txn);
    setSelectedCategory(txn.category);
  };

  const handleCorrect = async (e) => {
    e.preventDefault();
    if (!activeTxn || !selectedCategory) return;

    setSubmitting(true);
    try {
      await categorisationService.correctCategory(activeTxn.transaction_id, selectedCategory);
      addToast(
        `Updated category to ${selectedCategory}. Learned override saved for future records!`,
        'success'
      );
      setActiveTxn(null);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to update category';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
          Hybrid Categorisation Engine
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          3-Stage classifier: 1) Learned Overrides & Merchant Dictionary, 2) Keyword Regex, 3) NLP Fallback with Active Learning.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Total Processed</div>
          <div className="text-2xl lg:text-3xl font-bold text-white tabular-nums">
            {stats.total_transactions}
          </div>
          <p className="text-[11px] text-zinc-400">Ingested across all sources</p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Learned Corrections</div>
          <div className="text-2xl lg:text-3xl font-bold text-[#00D09C] tabular-nums">
            {stats.corrections_made}
          </div>
          <p className="text-[11px] text-zinc-400">User-supplied overrides stored</p>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Needs Review</div>
          <div className="text-2xl lg:text-3xl font-bold text-[#F59E0B] tabular-nums">
            {stats.needs_review}
          </div>
          <p className="text-[11px] text-zinc-400">Confidence score below 80%</p>
        </GlassCard>
      </div>

      {/* Low Confidence Review Queue */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white font-display">
              Review Queue ({lowConfTxns.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Transactions categorized with lower certainty. Correcting them trains your personal override dictionary.
            </p>
          </div>
          <button
            onClick={loadData}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            title="Refresh Queue"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {lowConfTxns.length > 0 ? (
            lowConfTxns.map((t) => (
              <div
                key={t.transaction_id}
                className="py-3.5 px-2 flex items-center justify-between hover:bg-white/[0.02] rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      {t.merchant || t.description || 'Unknown Merchant'}
                    </span>
                    <Badge variant="amber" size="sm">
                      {Math.round((t.confidence || 0.5) * 100)}% Confidence
                    </Badge>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span>{t.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span>Current guess:</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 text-white font-medium">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(t.category) }}
                        />
                        {t.category}
                      </span>
                    </span>
                  </div>
                  {t.description && (
                    <div className="text-[11px] text-zinc-500 font-mono">{t.description}</div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-semibold text-white tabular-nums text-sm">
                    ₹{t.amount?.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => openCorrectionSheet(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-xs font-semibold text-zinc-200 transition-all border border-white/20 shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Correct</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-zinc-400">
              <CheckCircle2 className="w-8 h-8 text-[#00D09C] mx-auto mb-2 opacity-80" />
              All transactions have high classifier confidence! No manual reviews needed right now.
            </div>
          )}
        </div>
      </GlassCard>

      {/* Learned Merchant Overrides Dictionary */}
      <GlassCard className="space-y-4">
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-base font-semibold text-white font-display">
            Learned Merchant Dictionary & Overrides
          </h3>
          <p className="text-xs text-zinc-400">
            User-specific learned rules that override general dictionary entries on future ingestion batches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {overrides.length > 0 ? (
            overrides.map((ov, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white capitalize">{ov.keyword}</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5 font-mono">
                    Reinforced {ov.correction_count} {ov.correction_count === 1 ? 'time' : 'times'}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(ov.category) }}
                  />
                  {ov.category}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-xs text-zinc-400">
              No custom overrides recorded yet. As you correct transactions in the review queue, they will appear here.
            </div>
          )}
        </div>
      </GlassCard>

      {/* Correction Bottom Sheet */}
      <BottomSheet
        isOpen={!!activeTxn}
        onClose={() => setActiveTxn(null)}
        title="Correct Transaction Category"
        subtitle={`ID #${activeTxn?.transaction_id} • ${activeTxn?.merchant || activeTxn?.description}`}
      >
        {activeTxn && (
          <form onSubmit={handleCorrect} className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-mono">Merchant/Entity:</span>
                <span className="font-semibold text-white">{activeTxn.merchant || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-mono">Amount:</span>
                <span className="font-semibold text-white">₹{activeTxn.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-mono">Original Classifier Category:</span>
                <span className="text-[#F59E0B] font-semibold">{activeTxn.category}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                Select Correct Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const dotColor = getCategoryColor(cat);

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: isSelected ? 'none' : `0 0 6px ${dotColor}`,
                        }}
                      />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/15 text-xs text-zinc-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-400" />
              <span>
                Submitting this correction updates this record to 100% confidence and trains PayBuddy to automatically classify future transactions matching this merchant as <strong>{selectedCategory}</strong>.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-50"
            >
              {submitting ? 'Saving Feedback...' : 'Confirm Category Correction'}
            </button>
          </form>
        )}
      </BottomSheet>
    </div>
  );
}

export default Categorisation;
