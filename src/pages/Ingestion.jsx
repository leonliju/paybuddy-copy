import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  MessageSquare,
  PlusCircle,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { transactionService } from '../services/transactionService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import BottomSheet from '../components/shared/BottomSheet';
import { useToast } from '../components/shared/Toast';

const CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Education',
  'Medical', 'Entertainment', 'Income', 'Other'
];

export function Ingestion() {
  const [activeTab, setActiveTab] = useState('csv'); // 'csv' | 'pdf' | 'sms' | 'manual' | 'simulated'
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('');

  // CSV / PDF state
  const [selectedFile, setSelectedFile] = useState(null);

  // SMS state
  const [smsText, setSmsText] = useState(
    'Sent Rs. 450.00 from HDFC Bank to Swiggy on 15-08-2026. Ref UPI/423456789. Available balance Rs 45,230.00'
  );

  // Manual transaction state
  const [manualForm, setManualForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    direction: 'debit',
    merchant: '',
    description: '',
    category: '',
    note: '',
  });

  // Simulated count
  const [simCount, setSimCount] = useState(5);

  const { addToast } = useToast();

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getTransactions({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        direction: directionFilter || undefined,
        search: search || undefined,
      });
      setTransactions(data || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [categoryFilter, directionFilter, search]);

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast('Please select a CSV file to upload.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await transactionService.importCsv(selectedFile);
      setImportSummary({
        source: 'CSV File Upload',
        count: res.imported,
        preview: res.preview,
      });
      setSelectedFile(null);
      addToast(`Successfully imported ${res.imported} records from CSV!`, 'success');
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to import CSV';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast('Please select a PDF bank statement file.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await transactionService.importPdf(selectedFile);
      setImportSummary({
        source: 'PDF Bank Statement',
        count: res.imported,
        preview: res.preview,
      });
      setSelectedFile(null);
      addToast(`Successfully parsed and imported ${res.imported} transactions from PDF!`, 'success');
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to import PDF';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSmsImport = async (e) => {
    e.preventDefault();
    if (!smsText.trim()) {
      addToast('Please enter SMS text to parse.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await transactionService.importSms(smsText);
      setImportSummary({
        source: 'SMS Parser',
        count: res.imported,
        preview: res.preview,
      });
      addToast(`Extracted ${res.imported} transactions from SMS text!`, 'success');
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to import SMS';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.amount || !manualForm.date) {
      addToast('Please enter transaction date and amount.', 'warning');
      return;
    }
    setLoading(true);
    try {
      await transactionService.addManual({
        ...manualForm,
        amount: parseFloat(manualForm.amount),
      });
      addToast('Transaction recorded and categorized successfully!', 'success');
      setManualForm({
        date: new Date().toISOString().slice(0, 10),
        amount: '',
        direction: 'debit',
        merchant: '',
        description: '',
        category: '',
        note: '',
      });
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to add transaction';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await transactionService.importSimulated(simCount);
      setImportSummary({
        source: 'Synthetic Event Simulator',
        count: res.imported,
        preview: res.preview,
      });
      addToast(`Generated ${res.imported} synthetic transactions for analysis!`, 'success');
      fetchTransactions();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to simulate events';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      addToast('Transaction deleted.', 'info');
      fetchTransactions();
    } catch (err) {
      addToast('Failed to delete transaction.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
          Transaction Ingestion Engine
        </h2>
        <p className="text-xs text-[#8A8F98] mt-1 max-w-xl">
          Multi-channel ingestion supporting CSV spreadsheets, PDF statements, SMS text parsing, manual entry, and synthetic test streams.
        </p>
      </div>

      {/* 5-Mode Tab Selector */}
      <div className="flex rounded-2xl bg-[#141414] p-1.5 border border-white/10 overflow-x-auto custom-scrollbar">
        {[
          { id: 'csv', label: 'CSV Spreadsheet', icon: UploadCloud },
          { id: 'pdf', label: 'PDF Statement', icon: FileText },
          { id: 'sms', label: 'SMS Bank Alerts', icon: MessageSquare },
          { id: 'manual', label: 'Manual Entry', icon: PlusCircle },
          { id: 'simulated', label: 'Simulated Stream', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ingestion Workspaces */}
      <GlassCard className="p-6 md:p-8">
        {/* CSV MODE */}
        {activeTab === 'csv' && (
          <form onSubmit={handleCsvUpload} className="space-y-6 max-w-xl mx-auto text-center">
            <div className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-3xl p-8 transition-colors bg-white/[0.01]">
              <UploadCloud className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">Select or Drag CSV Statement</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Accepted headers: <span className="font-mono text-zinc-300">date, amount, direction, merchant, description, category</span>
              </p>

              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="csv-file-input"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer border border-white/15 transition-colors"
              >
                {selectedFile ? selectedFile.name : 'Browse CSV File'}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-40"
            >
              {loading ? 'Processing & Categorising...' : 'Ingest & Categorise CSV'}
            </button>
          </form>
        )}

        {/* PDF MODE */}
        {activeTab === 'pdf' && (
          <form onSubmit={handlePdfUpload} className="space-y-6 max-w-xl mx-auto text-center">
            <div className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-3xl p-8 transition-colors bg-white/[0.01]">
              <FileText className="w-12 h-12 text-[#00D09C] mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">Upload Bank PDF Statement</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                The PayBuddy PDF engine automatically extracts dates, merchants, and debit amounts.
              </p>

              <input
                type="file"
                accept=".pdf"
                id="pdf-file-input"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="pdf-file-input"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer border border-white/15 transition-colors"
              >
                {selectedFile ? selectedFile.name : 'Browse PDF Statement'}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-40"
            >
              {loading ? 'Parsing PDF Transactions...' : 'Parse & Ingest PDF'}
            </button>
          </form>
        )}

        {/* SMS MODE */}
        {activeTab === 'sms' && (
          <form onSubmit={handleSmsImport} className="space-y-5 max-w-2xl mx-auto">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-zinc-400">Paste Bank SMS Alerts</label>
                <button
                  type="button"
                  onClick={() =>
                    setSmsText(
                      'Sent Rs. 380.00 from ICICI Bank to Uber on 16-08-2026.\nSent Rs. 1499.00 from HDFC Bank to Netflix India.\nCredited Rs. 45000.00 from Tech Consulting.'
                    )
                  }
                  className="text-xs text-zinc-300 hover:text-white font-mono underline"
                >
                  Load Example Batch
                </button>
              </div>
              <textarea
                rows={5}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="Paste SMS notifications here..."
                className="w-full bg-[#0E0E10] border border-white/15 rounded-2xl p-4 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !smsText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-40"
            >
              {loading ? 'Extracting Entities...' : 'Parse Bank SMS Stream'}
            </button>
          </form>
        )}

        {/* MANUAL MODE */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Date</label>
                <input
                  type="date"
                  value={manualForm.date}
                  onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1250"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Direction</label>
                <select
                  value={manualForm.direction}
                  onChange={(e) => setManualForm({ ...manualForm, direction: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value="debit">Debit (Expense)</option>
                  <option value="credit">Credit (Income)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Merchant</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Uber, Netflix"
                  value={manualForm.merchant}
                  onChange={(e) => setManualForm({ ...manualForm, merchant: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Category (Optional Auto)</label>
                <select
                  value={manualForm.category}
                  onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value="">Auto-Detect via Classifier</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Description / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend team dinner"
                  value={manualForm.description}
                  onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
                  className="w-full bg-[#0E0E10] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-40"
            >
              {loading ? 'Classifying...' : 'Save Manual Record'}
            </button>
          </form>
        )}

        {/* SIMULATED MODE */}
        {activeTab === 'simulated' && (
          <form onSubmit={handleSimulatedSubmit} className="space-y-6 max-w-xl mx-auto text-center">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10">
              <Cpu className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">Generate Synthetic Events</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Simulates real-world UPI, card POS, and salary events across multiple categories for academic testing.
              </p>

              <div className="flex items-center justify-center gap-3">
                {[3, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSimCount(num)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      simCount === num
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    {num} Records
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-sm hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(255,255,255,0.18)] disabled:opacity-40"
            >
              {loading ? 'Simulating Pipeline...' : `Inject ${simCount} Synthetic Records`}
            </button>
          </form>
        )}
      </GlassCard>

      {/* Transaction Records Database View */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white font-display">Ingested Transactions</h3>
            <p className="text-xs text-zinc-400">Stored locally in DuckDB tables</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search merchant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0E0E10] border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#0E0E10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="bg-[#0E0E10] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="">All Types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/8 text-zinc-400 font-mono uppercase">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Merchant / Description</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Source</th>
                <th className="py-3 px-2">Confidence</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.transaction_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-2 whitespace-nowrap text-zinc-400 font-mono">{t.date}</td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-white">{t.merchant || t.description || 'Unknown'}</div>
                      {t.description && t.merchant && (
                        <div className="text-[11px] text-zinc-500 truncate max-w-xs">{t.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className="uppercase text-[10px] font-mono text-zinc-400">{t.source}</span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <Badge
                        size="sm"
                        variant={t.confidence >= 0.8 ? 'green' : t.confidence >= 0.6 ? 'amber' : 'silver'}
                      >
                        {Math.round((t.confidence || 0.5) * 100)}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <span
                        className={`font-semibold tabular-nums ${
                          t.direction === 'credit' ? 'text-[#00D09C]' : 'text-white'
                        }`}
                      >
                        {t.direction === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(t.transaction_id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-zinc-400">
                    No transactions found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Import Summary Bottom Sheet */}
      <BottomSheet
        isOpen={!!importSummary}
        onClose={() => setImportSummary(null)}
        title="Ingestion Summary"
        subtitle={`Source: ${importSummary?.source}`}
      >
        {importSummary && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#00D09C]/10 border border-[#00D09C]/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#00D09C]" />
              <div>
                <div className="text-sm font-semibold text-white">
                  Successfully Ingested {importSummary.count} Transactions
                </div>
                <div className="text-xs text-[#00D09C]">All records processed & inserted into DuckDB</div>
              </div>
            </div>

            {importSummary.preview && importSummary.preview.length > 0 && (
              <div>
                <h5 className="text-xs font-mono uppercase text-zinc-400 mb-2">Ingestion Preview</h5>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {importSummary.preview.map((p, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{p.merchant || 'Record'}</div>
                        <div className="text-zinc-400">{p.date} • {p.category}</div>
                      </div>
                      <div className="text-white font-semibold">₹{p.amount.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setImportSummary(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black font-semibold text-xs shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default Ingestion;
