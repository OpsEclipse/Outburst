'use client';

import { useState, useEffect, useCallback } from 'react';

interface ShakeOffset {
  x: number;
  y: number;
}

export function useScreenShake(intensity: number, isActive: boolean): ShakeOffset {
  const [offset, setOffset] = useState<ShakeOffset>({ x: 0, y: 0 });

  const calculateShake = useCallback(() => {
    // Only shake when intensity > 0.7
    if (intensity <= 0.7 || !isActive) {
      return { x: 0, y: 0 };
    }

    // Scale shake amount based on intensity (0 at 0.7, max 5px at 1.0)
    const shakeIntensity = (intensity - 0.7) / 0.3; // Normalize 0.7-1.0 to 0-1
    const maxOffset = 5 * shakeIntensity;

    return {
      x: (Math.random() - 0.5) * 2 * maxOffset,
      y: (Math.random() - 0.5) * 2 * maxOffset,
    };
  }, [intensity, isActive]);

  useEffect(() => {
    if (intensity <= 0.7 || !isActive) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    // Shake at a rate proportional to intensity
    const interval = setInterval(() => {
      setOffset(calculateShake());
    }, 50);

    return () => clearInterval(interval);
  }, [intensity, isActive, calculateShake]);

  return offset;
}
