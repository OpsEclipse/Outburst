export type GameStatus =
  | 'ready'
  | 'playing'
  | 'exploded';

export interface GameState {
  status: GameStatus;
  currentWord: string;
  usedWords: Set<string>;
  wordsGuessed: number;
  timerDuration: number;
  timeRemaining: number;
  intensity: number;
}

export type GameAction =
  | { type: 'START_GAME'; duration: number }
  | { type: 'NEXT_WORD'; word: string }
  | { type: 'TICK'; timeRemaining: number; intensity: number }
  | { type: 'EXPLODE' }
  | { type: 'RESET' };

export interface WordCategory {
  name: string;
  words: string[];
}
