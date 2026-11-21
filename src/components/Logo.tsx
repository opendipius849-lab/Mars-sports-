import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, onClick }) => {
  const iconDimensions = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-lg',
    lg: 'w-12 h-12 text-2xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 select-none cursor-pointer group"
    >
      {/* MS Icon in bold athletic blue style */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-md shadow-blue-500/25 border border-blue-400/30 overflow-hidden transform group-hover:scale-105 transition-transform duration-200`}
      >
        {/* Athletic dynamic slash background effect */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.25)_0%,transparent_50%)]" />
        <span
          className="relative font-black italic tracking-tighter text-white drop-shadow-sm font-sans"
          style={{
            transform: 'skewX(-6deg)',
            letterSpacing: '-0.07em',
          }}
        >
          MS
        </span>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className="text-white font-black tracking-tight uppercase text-lg sm:text-xl font-sans"
              style={{ letterSpacing: '-0.03em' }}
            >
              MARS <span className="text-blue-500 font-black">SPORTS</span>
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
            Live Scores & AI Predictions
          </span>
        </div>
      )}
    </div>
  );
};
