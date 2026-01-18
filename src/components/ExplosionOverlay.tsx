'use client';

import { useEffect, useState } from 'react';

interface ExplosionOverlayProps {
  wordsGuessed: number;
  onPlayAgain: () => void;
}

export function ExplosionOverlay({ wordsGuessed, onPlayAgain }: ExplosionOverlayProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay showing content for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 animate-explosion">
      <div
        className={`text-center transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-8xl sm:text-9xl font-black text-white mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
          BOOM!
        </h1>

        <div className="space-y-4 text-white/90">
          <p className="text-2xl sm:text-3xl font-semibold">
            Time&apos;s up!
          </p>
          <p className="text-xl sm:text-2xl">
            Words guessed: <span className="font-bold text-yellow-300">{wordsGuessed}</span>
          </p>
        </div>

        <button
          onClick={onPlayAgain}
          className="mt-12 px-10 py-5 bg-white text-red-600 text-2xl font-bold rounded-xl transform hover:scale-105 active:scale-95 transition-transform duration-200 shadow-xl touch-manipulation"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
