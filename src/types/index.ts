export type Screen = 'START' | 'GAME' | 'VICTORY' | 'GAMEOVER';
export type GameMode = 'SELECT' | 'STORM_CASTLE' | 'HATCHERY' | 'BATTLE';
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

export type BattlePhase =
  | 'SETUP'
  | 'COLLECTION_P1'
  | 'PASS_TO_P2'
  | 'COLLECTION_P2'
  | 'DRAGON_SELECT_P1'
  | 'PASS_TO_P1_SELECT'
  | 'DRAGON_SELECT_P2'
  | 'BATTLE'
  | 'VICTORY';

export type DragonRarity = 'common' | 'uncommon' | 'rare';
export type DragonShape = 'serpentine' | 'wyvern' | 'drake';
export type FireColor = 'blazing' | 'icy' | 'storm' | 'toxic' | 'holy';

export interface BattleDragon {
  id: string;
  name: string;
  shape: DragonShape;
  colorName: string;
  colorBg: string;
  colorBorder: string;
  fireColor: FireColor;
  fireEmoji: string;
  rarity: DragonRarity;
  power: number;
  health: number;
}

export interface BattlePlayer {
  name: string;
  grade: Grade;
  dragons: BattleDragon[];
  selectedDragon: BattleDragon | null;
  correctTowardNextDragon: number;
}

export interface BattleProblem {
  expression: string;
  answer: number;
}
