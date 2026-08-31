import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Database,
  Tag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { assistantService } from '../services/assistantService';
import GlassCard from '../components/shared/GlassCard';
import Badge from '../components/shared/Badge';
import { useToast } from '../components/shared/Toast';
import PayBuddyLogo from '../components/shared/PayBuddyLogo';

const SUGGESTED_QUERIES = [
  'How much did I spend on Food this month?',
  'What is my largest expense category and how does it compare to last month?',
  'Did I have any anomalous or unusually high expenses recently?',
  'Am I on track to meet my savings goals with my current monthly surplus?',
  'Show me my top 3 recurring merchants.',
];

export function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm your PayBuddy AI Financial Assistant. I am directly grounded in your live DuckDB transaction records. Ask me anything about your spending habits, category breakdowns, budgets, or forecast projections.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText = null) => {
    const query = (questionText || input).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await assistantService.ask(query);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer,
        intent: res.intent,
        groundingSources: res.context_sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I encountered an issue connecting to the AI financial intelligence engine. Please try again.',
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversation history cleared. How can I assist with your finances today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    addToast('Chat history cleared.', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight flex items-center gap-2">
            Grounded AI Financial Assistant
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/20">
              Gemini + DuckDB RAG
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Directly grounded in your personal transactions database with citation attribution.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#121214] text-white flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20 overflow-hidden p-0.5">
                <PayBuddyLogo size="xs" showText={false} animated={false} />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/20 text-white shadow-lg'
                  : 'bg-[#141416] border border-white/10 text-zinc-200'
              }`}
            >
              {/* Message Header (Intent Tag if present) */}
              {msg.intent && (
                <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                  <Tag className="w-3 h-3 text-zinc-400" />
                  <span className="font-mono text-[10px] text-zinc-300 uppercase font-semibold">
                    Intent: {msg.intent}
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap leading-relaxed text-sm font-sans">{msg.content}</div>

              {/* Grounding Context Sources / Citations */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-400">
                    <Database className="w-3 h-3 text-[#00D09C]" />
                    <span>Grounded Sources ({msg.groundingSources.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.groundingSources.slice(0, 5).map((src, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400"
                      >
                        {src.merchant || src.category || 'Record'}: ₹{src.amount?.toLocaleString('en-IN')} ({src.date})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[10px] font-mono text-right ${
                  msg.role === 'user' ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-white to-zinc-400 text-black flex items-center justify-center flex-shrink-0 font-bold text-xs">
                <User className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse border border-white/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#141416] border border-white/10 rounded-2xl p-4 text-xs text-zinc-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-mono text-[11px]">Querying DuckDB & Gemini Intelligence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      {messages.length <= 2 && (
        <div className="py-2 overflow-x-auto custom-scrollbar flex gap-2">
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <span>{q}</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="pt-3">
        <div className="relative flex items-center">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about spending trends, categories, budgets, or anomalies..."
            className="w-full bg-[#121214] border border-white/15 rounded-2xl pl-4 pr-12 py-3.5 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 resize-none shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-black hover:opacity-95 transition-opacity disabled:opacity-30 shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold"
            aria-label="Send query"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-2 pt-1.5 font-mono">
          <span>Press Enter to send</span>
          <span className="flex items-center gap-1 text-[#00D09C]">
            <ShieldCheck className="w-3 h-3" />
            <span>Strict zero-leakage prompt containment</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Assistant;
