'use client';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center space-y-8">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 tracking-tight">
          OUTBURST
        </h1>

        <p className="text-xl sm:text-2xl text-gray-400 max-w-md mx-auto">
          Describe the word without saying it. Pass the phone before the bomb explodes!
        </p>

        <div className="space-y-4 text-gray-500 text-lg">
          <p>Get your team to guess the word</p>
          <p>Tap &quot;Next Word&quot; when they get it right</p>
          <p>Watch out for the ticking bomb!</p>
        </div>

        <button
          onClick={onStart}
          className="mt-8 px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl sm:text-3xl font-bold rounded-2xl transform hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-orange-500/30 touch-manipulation"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
