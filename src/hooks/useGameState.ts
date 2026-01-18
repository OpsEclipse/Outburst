'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GameAction } from '@/types/game';
import { getRandomWord } from '@/lib/words/wordList';

const initialState: GameState = {
  status: 'ready',
  currentWord: '',
  usedWords: new Set<string>(),
  wordsGuessed: 0,
  timerDuration: 0,
  timeRemaining: 0,
  intensity: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const usedWords = new Set<string>();
      const firstWord = getRandomWord(usedWords);
      usedWords.add(firstWord);
      return {
        ...state,
        status: 'playing',
        currentWord: firstWord,
        usedWords,
        wordsGuessed: 0,
        timerDuration: action.duration,
        timeRemaining: action.duration,
        intensity: 0,
      };
    }
    case 'NEXT_WORD': {
      const newUsedWords = new Set(state.usedWords);
      newUsedWords.add(action.word);
      return {
        ...state,
        currentWord: action.word,
        usedWords: newUsedWords,
        wordsGuessed: state.wordsGuessed + 1,
      };
    }
    case 'TICK': {
      return {
        ...state,
        timeRemaining: action.timeRemaining,
        intensity: action.intensity,
      };
    }
    case 'EXPLODE': {
      return {
        ...state,
        status: 'exploded',
        intensity: 1,
      };
    }
    case 'RESET': {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    // Random duration between 90-130 seconds
    const duration = Math.floor(Math.random() * 41) + 90;
    dispatch({ type: 'START_GAME', duration });
  }, []);

  const nextWord = useCallback(() => {
    const word = getRandomWord(state.usedWords);
    dispatch({ type: 'NEXT_WORD', word });
  }, [state.usedWords]);

  const tick = useCallback((timeRemaining: number, intensity: number) => {
    dispatch({ type: 'TICK', timeRemaining, intensity });
  }, []);

  const explode = useCallback(() => {
    dispatch({ type: 'EXPLODE' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    startGame,
    nextWord,
    tick,
    explode,
    reset,
  };
}
