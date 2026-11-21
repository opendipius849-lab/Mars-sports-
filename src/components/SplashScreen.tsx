import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const fullText = 'MARS SPORTS';
  const [displayedText, setDisplayedText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar fill over 2.2s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 45);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Typewriter effect for "MARS SPORTS" from left to right
    let currentIndex = 0;
    // Initial short delay before typing begins
    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100); // 100ms per letter = ~1.1s for "MARS SPORTS"

      return () => clearInterval(typeInterval);
    }, 300);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    // Trigger exit animation after typing and progress finish
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Wait for fade transition before calling onComplete
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(doneTimer);
    }, 2400);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-all duration-500 select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic stadium lighting glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated App Icon MS in athletic blue */}
        <div className="relative mb-6">
          {/* Pulsing glow aura */}
          <div className="absolute -inset-3 bg-blue-500/25 rounded-3xl blur-xl animate-pulse" />

          <div
            className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-2xl shadow-blue-500/40 border-2 border-blue-400/40 overflow-hidden transform hover:scale-105 transition-transform"
          >
            {/* Athletic dynamic slash reflection */}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
            <span
              className="relative font-black italic tracking-tighter text-white text-4xl sm:text-5xl drop-shadow-md font-sans"
              style={{
                transform: 'skewX(-6deg)',
                letterSpacing: '-0.07em',
              }}
            >
              MS
            </span>
          </div>
        </div>

        {/* Name Typed Slowly from Left to Right */}
        <div className="h-10 sm:h-12 flex items-center justify-center">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans"
            style={{ letterSpacing: '-0.03em' }}
          >
            {/* Split displayed text to highlight MARS in white and SPORTS in blue */}
            {displayedText.split('').map((char, index) => {
              const isSportsPart = index >= 5; // "MARS " is 5 chars
              return (
                <span
                  key={index}
                  className={`inline-block transition-all duration-150 ${
                    isSportsPart ? 'text-blue-500' : 'text-white'
                  }`}
                  style={{
                    animation: 'fadeSlideIn 0.15s ease-out',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
            {/* Blinking athletic cursor while typing */}
            {displayedText.length < fullText.length && (
              <span className="inline-block w-1 h-6 sm:h-8 bg-blue-400 ml-1 animate-pulse" />
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-opacity duration-700 text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mt-2 ${
            displayedText.length >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Live Scores & AI Predictions
        </div>

        {/* Sleek Progress Indicator Bar */}
        <div className="w-48 sm:w-56 h-1 bg-slate-800/80 rounded-full mt-7 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Attribution at bottom of intro */}
        <div className="mt-6 text-[11px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>Powered by PIUS TECH 256</span>
        </div>
      </div>

      {/* Quick Skip button on top right */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onComplete, 200);
        }}
        className="absolute top-6 right-6 px-3 py-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
      >
        Skip
      </button>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
