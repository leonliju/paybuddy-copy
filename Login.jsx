import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/shared/Toast';
import PayBuddyLogo from '../components/shared/PayBuddyLogo';
import CinematicAuthSuccess from '../components/shared/CinematicAuthSuccess';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cinematic post-auth state
  const [showCinematic, setShowCinematic] = useState(false);
  const [authSuccessData, setAuthSuccessData] = useState(null);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const data = await authService.register(username.trim(), password);
        login(data);
        addToast('Account created successfully! Welcome to PayBuddy.', 'success');
        setAuthSuccessData({ username: data.username, isRegister: true });
        setShowCinematic(true);
      } else {
        const data = await authService.login(username.trim(), password);
        login(data);
        addToast(`Welcome back, ${data.username}!`, 'success');
        setAuthSuccessData({ username: data.username, isRegister: false });
        setShowCinematic(true);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCinematicComplete = () => {
    navigate(from, { replace: true });
  };

  const fillDemoCredentials = () => {
    setIsRegister(false);
    setUsername('demo');
    setPassword('demo123');
    setError('');
  };

  return (
    <>
      {showCinematic && authSuccessData && (
        <CinematicAuthSuccess
          username={authSuccessData.username}
          isRegister={authSuccessData.isRegister}
          onComplete={handleCinematicComplete}
          duration={2400}
        />
      )}

      <div className="min-h-screen bg-[#0B0B0C] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Background ambient lighting in classy silver & obsidian */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-zinc-400/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Ambient subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Main Container */}
        <div className="w-full max-w-md z-10 animate-fade-in relative">
          {/* Cinematic Brand Header */}
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="mb-2 transform hover:scale-105 transition-transform duration-500">
              <PayBuddyLogo
                size="xl"
                layout="stacked"
                showTagline={false}
                animated={true}
                className="drop-shadow-[0_0_30px_rgba(255,255,255,0.22)]"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
              Pay<span className="text-metallic-silver">Buddy</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 font-sans tracking-wide lowercase mt-1">
              pay, analyse, predict
            </p>
          </div>

          {/* Auth Card with Classy Silver & Obsidian finish */}
          <div className="bg-[#141416]/90 border border-white/15 rounded-3xl p-6 md:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
            {/* Specular border shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Tab selector */}
            <div className="flex rounded-xl bg-[#0B0B0C] p-1 mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isRegister
                    ? 'bg-[#222226] text-white shadow-md border border-white/10 text-metallic-silver'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isRegister
                    ? 'bg-[#222226] text-white shadow-md border border-white/10 text-metallic-silver'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#0B0B0C] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#0B0B0C] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 font-mono uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#0B0B0C] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Classy Brushed Silver & Titanium Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFFFFF] via-[#E4E4E7] to-[#D4D4D8] text-[#09090B] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,255,255,0.22)] disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegister ? 'Initialize Intelligence Workspace' : 'Access Workspace'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Fill Demo Credentials (demo / demo123)</span>
              </button>
            </div>
          </div>

          {/* Security badge note */}
          <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5 font-mono">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>Black & Silver Intelligence • In-Memory DuckDB Engine</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
