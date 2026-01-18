'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  duration: number;
  isRunning: boolean;
  onTick: (timeRemaining: number, intensity: number) => void;
  onComplete: () => void;
}

// Intensity calculation:
// - 0 from start until 90 seconds remaining
// - Then ramps from 0 to 1 as time goes from 90s to 0s
function calculateIntensity(timeRemaining: number): number {
  const INTENSITY_START_TIME = 90; // Start building intensity at 90s remaining

  if (timeRemaining >= INTENSITY_START_TIME) {
    return 0;
  }

  // Linear ramp from 0 to 1 as time goes from 90s to 0s
  return 1 - (timeRemaining / INTENSITY_START_TIME);
}

export function useTimer({ duration, isRunning, onTick, onComplete }: UseTimerProps) {
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const timeRemaining = Math.max(0, duration - elapsed);
    const intensity = calculateIntensity(timeRemaining);

    onTick(timeRemaining, intensity);

    if (timeRemaining <= 0) {
      onComplete();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [duration, onTick, onComplete]);

  useEffect(() => {
    if (isRunning && duration > 0) {
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, duration, tick]);

  const getIntensity = useCallback(() => {
    if (!isRunning || duration <= 0) return 0;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const timeRemaining = Math.max(0, duration - elapsed);
    return calculateIntensity(timeRemaining);
  }, [isRunning, duration]);

  return { getIntensity };
}
