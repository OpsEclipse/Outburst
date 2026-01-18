'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAudioEngine, AudioEngine } from '@/lib/audio/AudioEngine';

interface UseAudioProps {
  isPlaying: boolean;
  getIntensity: () => number;
}

export function useAudio({ isPlaying, getIntensity }: UseAudioProps) {
  const audioEngineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    audioEngineRef.current = getAudioEngine();
  }, []);

  useEffect(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.startTickingLoop(getIntensity);
    } else {
      engine.stopTicking();
    }

    return () => {
      engine.stopTicking();
    };
  }, [isPlaying, getIntensity]);

  // Must be called from a direct user gesture (e.g., button click)
  const initializeAudio = useCallback(async () => {
    await audioEngineRef.current?.initialize();
  }, []);

  const playBoom = useCallback(() => {
    audioEngineRef.current?.playBoom();
  }, []);

  return { initializeAudio, playBoom };
}
