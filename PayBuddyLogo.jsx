import React from 'react';

/**
 * PayBuddy Official Brand Logo Component
 * Exact match to user's uploaded logo & aesthetic:
 * - Bold stark white geometric 'P'
 * - Clean horizontal baseline divider bar underneath the 'P'
 * - Concentric radar / ripple wave rings radiating smoothly behind the mark
 * - Tagline: "pay, analyse, predict" in crisp lowercase typography
 * - Smooth, minimalist animations (floating, pulsing, rippling waves, specular light sweep)
 */
export function PayBuddyLogo({
  size = 'md',
  showText = true,
  showTagline = false,
  subtitle = 'pay, analyse, predict',
  badge = null,
  animated = true,
  layout = 'horizontal', // 'horizontal' | 'stacked' | 'minimal-loader'
  className = '',
}) {
  const sizeMap = {
    xs: { icon: 26, fontSize: 18, barWidth: 16, barHeight: 2, text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 34, fontSize: 24, barWidth: 22, barHeight: 2.2, text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 46, fontSize: 32, barWidth: 30, barHeight: 2.5, text: 'text-base', sub: 'text-xs' },
    lg: { icon: 68, fontSize: 46, barWidth: 44, barHeight: 3, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 96, fontSize: 64, barWidth: 62, barHeight: 4, text: 'text-2xl', sub: 'text-sm' },
    cinematic: { icon: 130, fontSize: 88, barWidth: 84, barHeight: 5, text: 'text-3xl', sub: 'text-sm' },
    hero: { icon: 160, fontSize: 110, barWidth: 104, barHeight: 6, text: 'text-4xl', sub: 'text-base' },
  };

  const config = sizeMap[size] || sizeMap.md;

  // Minimal Loader / Stacked Hero Layout (pure minimalist representation matching the uploaded image)
  if (layout === 'stacked' || layout === 'minimal-loader') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {/* Animated Central Brand Mark */}
        <div
          className={`relative flex items-center justify-center flex-shrink-0 ${
            animated ? 'animate-logo-float' : ''
          }`}
          style={{ width: config.icon * 1.8, height: config.icon * 1.6 }}
        >
          {/* Animated Concentric Radar Wave Rings radiating outwards */}
          {animated ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Outer Ripple Wave 3 */}
              <div
                className="absolute rounded-full border border-white/20 animate-ripple-3"
                style={{
                  width: config.icon * 0.85,
                  height: config.icon * 0.85,
                }}
              />
              {/* Mid Ripple Wave 2 */}
              <div
                className="absolute rounded-full border border-white/30 animate-ripple-2"
                style={{
                  width: config.icon * 0.85,
                  height: config.icon * 0.85,
                }}
              />
              {/* Inner Ripple Wave 1 */}
              <div
                className="absolute rounded-full border border-white/40 animate-ripple-1"
                style={{
                  width: config.icon * 0.85,
                  height: config.icon * 0.85,
                }}
              />
              {/* Subtle Static Ambient Orbit Guide Rings for depth */}
              <div
                className="absolute rounded-full border border-white/[0.04] w-[140%] h-[140%]"
              />
              <div
                className="absolute rounded-full border border-white/[0.07] w-[110%] h-[110%]"
              />
              {/* Ambient Radiant Center Glow */}
              <div className="absolute w-28 h-28 rounded-full bg-white/[0.06] blur-2xl animate-logo-pulse" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="absolute rounded-full border border-white/10 w-[140%] h-[140%]" />
              <div className="absolute rounded-full border border-white/15 w-[110%] h-[110%]" />
              <div className="absolute rounded-full border border-white/20 w-[80%] h-[80%]" />
            </div>
          )}

          {/* SVG Vector of the "P" and Underline Bar */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pb-p-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#FAFAFA" />
                  <stop offset="100%" stopColor="#E4E4E7" />
                </linearGradient>
                <linearGradient id="pb-bar-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#52525B" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#52525B" />
                </linearGradient>
                <filter id="silver-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Bold Geometric "P" */}
              <text
                x="50"
                y="58"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="url(#pb-p-grad)"
                filter="url(#silver-glow)"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                fontWeight="900"
                fontSize="54"
                letterSpacing="-1"
              >
                P
              </text>

              {/* Sleek Horizontal Baseline Divider */}
              <line
                x1="24"
                y1="72"
                x2="76"
                y2="72"
                stroke="url(#pb-bar-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Minimalist Lowercase Tagline / Description: "pay, analyse, predict" */}
        {(showTagline || subtitle) && (
          <div className="mt-6">
            <p className="font-sans font-medium text-zinc-300 text-xs md:text-sm tracking-wider lowercase transition-all duration-700">
              {subtitle || 'pay, analyse, predict'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Horizontal Layout (for TopBar, Sidebar, Badges)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Icon Box */}
      <div
        className="relative flex items-center justify-center flex-shrink-0 group"
        style={{ width: config.icon, height: config.icon }}
      >
        {/* Subtle Ambient Hover Glow */}
        <div
          className={`absolute inset-0 rounded-2xl bg-white/[0.06] blur-md transition-all duration-500 pointer-events-none ${
            animated ? 'group-hover:bg-white/[0.18] group-hover:blur-lg group-hover:scale-110' : ''
          }`}
        />

        {/* SVG Container with "P" and Horizontal Line */}
        <div className="relative w-full h-full rounded-2xl bg-[#121214] border border-white/15 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Concentric rings inside the icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-[85%] h-[85%] rounded-full border border-white/10" />
            <div className="absolute w-[55%] h-[55%] rounded-full border border-white/10" />
          </div>

          <svg
            viewBox="0 0 60 60"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pb-p-compact" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FAFAFA" />
                <stop offset="100%" stopColor="#E4E4E7" />
              </linearGradient>
              <linearGradient id="pb-bar-compact" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#71717A" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#71717A" />
              </linearGradient>
            </defs>

            {/* The Bold Geometric P */}
            <text
              x="30"
              y="32"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="url(#pb-p-compact)"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontWeight="900"
              fontSize="28"
              letterSpacing="-0.5"
            >
              P
            </text>

            {/* The Baseline Underline */}
            <line
              x1="18"
              y1="42"
              x2="42"
              y2="42"
              stroke="url(#pb-bar-compact)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Light Sweep Shimmer */}
          {animated && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-25 -translate-x-full animate-metallic-shimmer" />
            </div>
          )}
        </div>
      </div>

      {/* Brand Typography & Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-extrabold tracking-tight text-white ${config.text} flex items-center gap-1`}
            >
              Pay<span className="text-metallic-silver">Buddy</span>
            </span>

            {badge && (
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-200 border border-white/20">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <span
              className={`font-sans text-zinc-400 tracking-wide lowercase font-normal ${config.sub} mt-0.5`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default PayBuddyLogo;
