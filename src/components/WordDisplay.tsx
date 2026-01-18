'use client';

interface WordDisplayProps {
  word: string;
  intensity: number;
}

export function WordDisplay({ word, intensity }: WordDisplayProps) {
  // Color transitions from green (120) to red (0) based on intensity
  const hue = Math.round(120 * (1 - intensity));
  const color = `hsl(${hue}, 80%, 50%)`;

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center uppercase tracking-wide transition-colors duration-200"
        style={{ color }}
      >
        {word}
      </h1>
    </div>
  );
}
