'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { allWords } from '@/lib/words/wordList';
import { StartScreen } from './StartScreen';
import { WordDisplay } from './WordDisplay';
import { NextWordButton } from './NextWordButton';

const MAX_TIME = 100; // seconds until fully red
const LOW_WORDS_THRESHOLD = 100;

export function GameContainer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showLowWordsWarning, setShowLowWordsWarning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Calculate intensity: 0 at start, 1 at MAX_TIME seconds
  const intensity = Math.min(1, elapsedTime / MAX_TIME);

  const getRandomWord = useCallback((words: string[]): { word: string; remaining: string[] } => {
    if (words.length === 0) {
      // Reset the pool if empty
      const shuffled = [...allWords].sort(() => Math.random() - 0.5);
      const word = shuffled[0];
      return { word, remaining: shuffled.slice(1) };
    }
    const index = Math.floor(Math.random() * words.length);
    const word = words[index];
    const remaining = [...words.slice(0, index), ...words.slice(index + 1)];
    return { word, remaining };
  }, []);

  const handleStart = useCallback(() => {
    let words = availableWords;

    // Only initialize words on first start
    if (words.length === 0) {
      words = [...allWords].sort(() => Math.random() - 0.5);
    }

    const { word, remaining } = getRandomWord(words);

    setCurrentWord(word);
    setAvailableWords(remaining);
    setElapsedTime(0);
    setShowLowWordsWarning(remaining.length < LOW_WORDS_THRESHOLD && remaining.length > 0);
    startTimeRef.current = Date.now();
    setIsPlaying(true);
  }, [availableWords, getRandomWord]);

  const nextWord = useCallback(() => {
    const { word, remaining } = getRandomWord(availableWords);
    setCurrentWord(word);
    setAvailableWords(remaining);

    // Check if words are running low
    if (remaining.length < LOW_WORDS_THRESHOLD && remaining.length > 0) {
      console.warn(`Low words warning: Only ${remaining.length} words remaining!`);
      setShowLowWordsWarning(true);
    }
  }, [availableWords, getRandomWord]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setElapsedTime(0);
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
          onClick={handleReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors touch-manipulation"
        >
          Reset
        </button>
      </div>

      {showLowWordsWarning && (
        <div className="absolute top-4 left-4 z-10 px-3 py-2 bg-yellow-500 text-black text-sm font-medium rounded-lg">
          {availableWords.length} words left
        </div>
      )}

      <WordDisplay word={currentWord} intensity={intensity} />
      <NextWordButton onClick={nextWord} intensity={intensity} />
    </div>
  );
}
