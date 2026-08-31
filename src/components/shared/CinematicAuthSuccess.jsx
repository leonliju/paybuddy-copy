import React, { useEffect, useState } from 'react';
import PayBuddyLogo from './PayBuddyLogo';

/**
 * Minimalist Loading & Auth Transition Screen
 * Features:
 * - Pure obsidian backdrop with subtle center radial aura
 * - Centered PayBuddy Logo with animated concentric ripple waves & breathing pulse
 * - Minimalist description: "pay, analyse, predict"
 * - Sleek, hairline metallic loading line indicating session readiness
 */
export function CinematicAuthSuccess({
  username = 'User',
  isRegister = false,
  onComplete,
  duration = 2000,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-[#08080A] flex flex-col items-center justify-center p-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Subtle Deep Radial Ambient Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(8,8,10,0.98)_70%)] pointer-events-none" />

      {/* Centered Minimalist Logo & Description */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Animated Brand Logo Mark with Concentric Radar Wave Rings */}
        <PayBuddyLogo
          size="hero"
          layout="minimal-loader"
          showTagline={false}
          animated={true}
        />

        {/* Minimalist Lowercase Description Tagline */}
        <div className="mt-8 space-y-3">
          <p className="text-sm md:text-base font-sans font-medium tracking-[0.2em] text-zinc-300 lowercase animate-fade-in">
            pay, analyse, predict
          </p>

          {/* Minimalist Sleek Loading Hairline */}
          <div className="w-36 h-[2px] rounded-full bg-white/10 overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicAuthSuccess;
