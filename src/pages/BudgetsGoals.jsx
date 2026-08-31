import React, { useState, useEffect } from 'react';
import {
  Target,
  PlusCircle,
  TrendingDown,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { budgetGoalService } from '../services/budgetGoalService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import BottomSheet from '../components/shared/BottomSheet';
import Skeleton from '../components/shared/Skeleton';
import { useToast } from '../components/shared/Toast';
import { getCategoryColor } from '../lib/chartTheme';

const CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Education',
  'Medical', 'Entertainment', 'Other'
];

export function BudgetsGoals() {
  const [activeTab, setActiveTab] = useState('budgets'); // 'budgets' | 'goals' | 'deadmoney'
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [deadMoney, setDeadMoney] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(CATEGORIES[0]);
  const [budgetLimitAmount, setBudgetLimitAmount] = useState('');

  const [goalForm, setGoalForm] = useState({
    name: '',
    target_amount: '',
    target_date: '',
  });

  // Feasibility Check state
  const [feasibilityData, setFeasibilityData] = useState(null);

  const { addToast } = useToast();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [budRes, goalRes, deadRes] = await Promise.all([
        budgetGoalService.getBudgetStatus(),
        budgetGoalService.getSavingsGoals(),
        budgetGoalService.getDeadMoney(),
      ]);
      setBudgets(budRes?.categories || budRes || []);
      setGoals(goalRes?.goals || goalRes || []);
      setDeadMoney(deadRes || null);
    } catch (err) {
      console.error('Failed to load budget/goal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!budgetLimitAmount || isNaN(budgetLimitAmount)) return;

    try {
      await budgetGoalService.setBudget({ category: selectedBudgetCategory, limit_amount: parseFloat(budgetLimitAmount) });
      addToast(`Budget for ${selectedBudgetCategory} set to ₹${parseFloat(budgetLimitAmount).toLocaleString('en-IN')}`, 'success');
      setBudgetModalOpen(false);
      setBudgetLimitAmount('');
      loadAll();
    } catch (err) {
      addToast('Failed to save category budget ceiling.', 'error');
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.target_amount || !goalForm.target_date) return;

    try {
      await budgetGoalService.createSavingsGoal({
        title: goalForm.name,
        target_amount: parseFloat(goalForm.target_amount),
        target_date: goalForm.target_date,
      });
      addToast(`Goal "${goalForm.name}" created successfully!`, 'success');
      setGoalModalOpen(false);
      setGoalForm({ name: '', target_amount: '', target_date: '' });
      loadAll();
    } catch (err) {
      addToast('Failed to create savings milestone.', 'error');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await budgetGoalService.deleteSavingsGoal(id);
      addToast('Goal removed.', 'info');
      loadAll();
    } catch (err) {
      addToast('Failed to remove goal.', 'error');
    }
  };

  const checkFeasibility = async (goal) => {
    try {
      const result = await budgetGoalService.getFeasibility(goal.id);
      setFeasibilityData({ ...result, goal });
    } catch (err) {
      addToast('Failed to run goal feasibility simulation.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
            Budgets, Savings Goals & Leaks
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Set proactive category spending limits, track milestone savings targets, and discover silent dead money leaks.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-2xl bg-[#141416] p-1 border border-white/15 overflow-x-auto custom-scrollbar">
          {[
            { id: 'budgets', label: 'Category Budgets' },
            { id: 'goals', label: 'Savings Goals' },
            { id: 'deadmoney', label: 'Dead Money Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: CATEGORY BUDGETS */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white font-display">
              Active Category Budgets ({budgets.length})
            </h3>
            <button
              onClick={() => setBudgetModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-xs font-semibold hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Set Category Limit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const pct = b.percentage || (b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0);
              const isOver = pct >= 100;
              const isWarning = pct >= 80 && !isOver;

              return (
                <GlassCard
                  key={b.category}
                  className={`space-y-4 ${
                    isOver
                      ? 'border-red-500/30 bg-red-500/[0.02]'
                      : isWarning
                      ? 'border-amber-500/30 bg-amber-500/[0.02]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: getCategoryColor(b.category),
                          boxShadow: `0 0 8px ${getCategoryColor(b.category)}40`,
                        }}
                      />
                      <span className="font-bold text-white text-sm font-display">{b.category}</span>
                      <Badge
                        variant={isOver ? 'red' : isWarning ? 'amber' : 'green'}
                        size="sm"
                      >
                        {isOver ? 'Exceeded' : isWarning ? 'Warning 80%+' : 'On Track'}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      {pct}% Used
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? 'bg-[#EF4444]'
                          : isWarning
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#00D09C]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <div>
                      <span className="text-zinc-400 font-mono">Spent: </span>
                      <span className="font-semibold text-white tabular-nums">
                        ₹{b.spent?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-mono">Limit: </span>
                      <span className="font-semibold text-white tabular-nums">
                        ₹{b.limit?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SAVINGS GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white font-display">
              Target Milestone Goals ({goals.length})
            </h3>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-xs font-semibold hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Savings Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => (
              <GlassCard key={g.id} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white font-display">{g.name}</h4>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-lg transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#00D09C] font-display">
                      ₹{g.target_amount?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-zinc-400">target by {g.target_date}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">
                    Approx: <strong className="text-white font-semibold">₹{Math.round(g.target_amount / 6).toLocaleString('en-IN')}/mo</strong>
                  </span>
                  <button
                    onClick={() => checkFeasibility(g)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white hover:text-black text-xs font-semibold text-zinc-200 transition-all border border-white/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Feasibility Audit</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEAD MONEY AUDIT */}
      {activeTab === 'deadmoney' && (
        <div className="space-y-6">
          {deadMoney ? (
            <div className="space-y-6">
              {/* Dead Money Hero Banner */}
              <GlassCard className="p-6 bg-[#141416] border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-[#F59E0B] border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Identified Dead Money Leaks
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
                      Subscriptions with no recent engagement, forgotten gym/app memberships, and recurring digital renewals totaling <strong className="text-[#EF4444]">₹{deadMoney.total_leakage?.toLocaleString('en-IN')}</strong> in monthly drain.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Leaks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deadMoney.items?.map((item, idx) => (
                  <GlassCard key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{item.merchant}</span>
                      <Badge variant="amber" size="sm">₹{item.amount?.toLocaleString('en-IN')}/mo</Badge>
                    </div>
                    <p className="text-xs text-zinc-400">{item.reason}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          ) : (
            <Skeleton className="h-64 rounded-3xl" />
          )}
        </div>
      )}

      {/* Set Budget Bottom Sheet */}
      <BottomSheet
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        title="Set Monthly Category Budget"
        subtitle="Establish hard spending limits to track progress"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Category</label>
            <select
              value={selectedBudgetCategory}
              onChange={(e) => setSelectedBudgetCategory(e.target.value)}
              className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Monthly Ceiling (₹ INR)</label>
            <input
              type="number"
              placeholder="e.g. 8000"
              value={budgetLimitAmount}
              onChange={(e) => setBudgetLimitAmount(e.target.value)}
              className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-xs font-semibold shadow-[0_0_20px_rgba(255,255,255,0.18)]"
          >
            Save Category Budget
          </button>
        </form>
      </BottomSheet>

      {/* Create Savings Goal Bottom Sheet */}
      <BottomSheet
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title="Create Savings Milestone Goal"
        subtitle="Track personal capital objectives over time"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Goal Title</label>
            <input
              type="text"
              placeholder="e.g. Emergency Fund, Laptop Upgrade"
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Target Amount (₹ INR)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={goalForm.target_amount}
              onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
              className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Target Date</label>
            <input
              type="date"
              value={goalForm.target_date}
              onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
              className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black text-xs font-semibold shadow-[0_0_20px_rgba(255,255,255,0.18)]"
          >
            Create Goal
          </button>
        </form>
      </BottomSheet>

      {/* Goal Feasibility Audit Bottom Sheet */}
      <BottomSheet
        isOpen={!!feasibilityData}
        onClose={() => setFeasibilityData(null)}
        title="Savings Goal Feasibility Audit"
        subtitle={`Goal: ${feasibilityData?.goal?.name}`}
      >
        {feasibilityData && (
          <div className="space-y-4 text-xs">
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                feasibilityData.feasible
                  ? 'bg-[#00D09C]/10 border-[#00D09C]/30 text-white'
                  : 'bg-amber-500/10 border-amber-500/30 text-white'
              }`}
            >
              {feasibilityData.feasible ? (
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
              )}
              <div>
                <h5 className="font-bold text-sm">
                  {feasibilityData.feasible ? 'Goal is Mathematically Feasible' : 'Requires Budget Adjustments'}
                </h5>
                <p className="text-zinc-400 mt-1 leading-relaxed">
                  {feasibilityData.recommendation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-zinc-400 font-mono uppercase text-[10px]">Monthly Surplus</span>
                <div className="text-base font-bold text-white mt-1">
                  ₹{feasibilityData.monthly_surplus?.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-zinc-400 font-mono uppercase text-[10px]">Required Monthly</span>
                <div className="text-base font-bold text-zinc-200 mt-1">
                  ₹{feasibilityData.required_monthly?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {feasibilityData.deficit > 0 && feasibilityData.suggestions && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2">
                <h5 className="font-semibold text-white font-mono uppercase text-[11px]">
                  Suggested Category Reductions to Meet Target
                </h5>
                {feasibilityData.suggestions.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-white/5">
                    <span className="text-zinc-400">{s.category}</span>
                    <span className="text-amber-400 font-semibold">-₹{s.reduction_amount?.toLocaleString('en-IN')}/mo</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setFeasibilityData(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default BudgetsGoals;
