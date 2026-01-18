'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { getRandomWord } from '@/lib/words/wordList';
import { StartScreen } from './StartScreen';
import { WordDisplay } from './WordDisplay';
import { NextWordButton } from './NextWordButton';

const MAX_TIME = 100; // seconds until fully red

export function GameContainer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Calculate intensity: 0 at start, 1 at MAX_TIME seconds
  const intensity = Math.min(1, elapsedTime / MAX_TIME);

  const handleStart = useCallback(() => {
    const firstWord = getRandomWord(new Set());
    setCurrentWord(firstWord);
    setUsedWords(new Set([firstWord]));
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    setIsPlaying(true);
  }, []);

  const nextWord = useCallback(() => {
    const word = getRandomWord(usedWords);
    setCurrentWord(word);
    setUsedWords(prev => new Set([...prev, word]));
  }, [usedWords]);

  const resetTimer = useCallback(() => {
    setElapsedTime(0);
    startTimeRef.current = Date.now();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  if (!isPlaying) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors touch-manipulation"
        >
          Reset
        </button>
      </div>
      <WordDisplay word={currentWord} intensity={intensity} />
      <NextWordButton onClick={nextWord} intensity={intensity} />
    </div>
  );
}
