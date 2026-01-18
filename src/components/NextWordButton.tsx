'use client';

interface NextWordButtonProps {
  onClick: () => void;
  intensity: number;
}

export function NextWordButton({ onClick, intensity }: NextWordButtonProps) {
  // Color transitions from green (120) to red (0) based on intensity
  const hue = Math.round(120 * (1 - intensity));
  const backgroundColor = `hsl(${hue}, 70%, 40%)`;
  const hoverColor = `hsl(${hue}, 70%, 35%)`;

  return (
    <button
      onClick={onClick}
      className="w-full h-1/2 min-h-[200px] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] touch-manipulation select-none"
      style={{
        backgroundColor,
        ['--hover-bg' as string]: hoverColor,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backgroundColor)}
    >
      Next Word
    </button>
  );
}
