export type Screen = 'START' | 'GAME' | 'VICTORY' | 'GAMEOVER';
export type GameMode = 'SELECT' | 'STORM_CASTLE' | 'HATCHERY';
export type HatcheryScreen = 'START' | 'GAME' | 'VICTORY';
export type CharmType = 'FIRE' | 'ICE' | 'LIGHTNING';
export type RoomType = 'ENTRANCE' | 'FLOOR' | 'DOOR' | 'TREASURE' | 'CHARM_FIRE' | 'CHARM_ICE' | 'CHARM_LIGHTNING' | 'FINAL_VAULT';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Grade = 1 | 2 | 3 | 4 | 5;
export type Direction = 'N' | 'S' | 'E' | 'W';

export interface Room {
  id: string;
  type: RoomType;
  connections: Partial<Record<Direction, string>>;
  solved: boolean;
  visited: boolean;
  gridX: number;
  gridY: number;
}

export interface PuzzleConfig {
  target: number;
  numbers: number[];      // all shown numbers (includes distractors for easy/medium)
  coreCount: number;      // how many numbers the solution actually uses
  operations: string[];
  requireAll: boolean;    // hard=true, easy/medium=false
  solution: string;       // a valid expression that produces the target
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  grade: Grade;
  difficulty: Difficulty;
  date: string;
}

export interface HatcheryProblem {
  expression: string;
  answer: number;
  hint: string;
}

export interface HatcheryLeaderboardEntry {
  name: string;
  grade: Grade;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  dragonsUnlocked: number;
  date: string;
}
