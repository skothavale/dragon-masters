import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Grade, HatcheryScreen, HatcheryProblem, HatcheryLeaderboardEntry } from '../types';
import { generateHatcheryProblem } from '../lib/hatcheryPuzzleGenerator';

type Difficulty = 'easy' | 'medium' | 'hard';

const MAX_DRAGONS = 20;

interface HatcheryStore {
  screen: HatcheryScreen;
  playerName: string;
  grade: Grade;
  difficulty: Difficulty;
  score: number;
  dragonsUnlocked: number;
  correctAnswers: number;
  currentStreak: number;
  hatchProgress: number;
  currentProblem: HatcheryProblem | null;
  problemStartTime: number | null;
  hintUsed: boolean;
  leaderboard: HatcheryLeaderboardEntry[];

  initGame(name: string, grade: Grade, difficulty: Difficulty): void;
  submitAnswer(answer: number): { correct: boolean; pointsEarned: number; newDragon: boolean; newDragonIndex: number; newHatchProgress: number };
  useHint(): string | null;
  nextProblem(): void;
  saveToLeaderboard(): void;
  resetGame(): void;
}

export const useHatcheryStore = create<HatcheryStore>()(
  persist(
    (set, get) => ({
      screen: 'START',
      playerName: '',
      grade: 1,
      difficulty: 'medium',
      score: 0,
      dragonsUnlocked: 0,
      correctAnswers: 0,
      currentStreak: 0,
      hatchProgress: 0,
      currentProblem: null,
      problemStartTime: null,
      hintUsed: false,
      leaderboard: [],

      initGame(name, grade, difficulty) {
        const problem = generateHatcheryProblem(grade, difficulty);
        set({
          screen: 'GAME',
          playerName: name,
          grade,
          difficulty,
          score: 0,
          dragonsUnlocked: 0,
          correctAnswers: 0,
          currentStreak: 0,
          hatchProgress: 0,
          currentProblem: problem,
          problemStartTime: Date.now(),
          hintUsed: false,
        });
      },

      submitAnswer(answer) {
        const { currentProblem, score, correctAnswers, currentStreak, hatchProgress, dragonsUnlocked, problemStartTime, grade, difficulty } = get();
        if (!currentProblem) return { correct: false, pointsEarned: 0, newDragon: false, newDragonIndex: -1, newHatchProgress: 0 };

        if (answer === currentProblem.answer) {
          let pointsEarned = 20;
          if (problemStartTime && Date.now() - problemStartTime < 5000) pointsEarned += 10;
          const newStreak = currentStreak + 1;
          if (newStreak === 3 || newStreak === 5 || newStreak === 10) pointsEarned += 15;

          const newCorrect = correctAnswers + 1;
          const newHatchProgress = hatchProgress + 1;
          let newDragon = false;
          let newDragonsUnlocked = dragonsUnlocked;
          let newProgress = newHatchProgress;

          if (newHatchProgress >= 3) {
            newDragonsUnlocked = Math.min(MAX_DRAGONS, dragonsUnlocked + 1);
            newDragon = newDragonsUnlocked > dragonsUnlocked;
            newProgress = 0;
          }

          set({
            score: score + pointsEarned,
            correctAnswers: newCorrect,
            currentStreak: newStreak,
            dragonsUnlocked: newDragonsUnlocked,
            hatchProgress: newProgress,
            screen: newDragonsUnlocked >= MAX_DRAGONS ? 'VICTORY' : 'GAME',
          });

          const nextProblem = generateHatcheryProblem(grade, difficulty);
          set({ currentProblem: nextProblem, problemStartTime: Date.now(), hintUsed: false });

          return { correct: true, pointsEarned, newDragon, newDragonIndex: newDragonsUnlocked - 1, newHatchProgress: newProgress };
        } else {
          set(s => ({ score: Math.max(0, s.score - 5), currentStreak: 0, hatchProgress: 0 }));
          const nextProblem = generateHatcheryProblem(grade, difficulty);
          set({ currentProblem: nextProblem, problemStartTime: Date.now(), hintUsed: false });
          return { correct: false, pointsEarned: -5, newDragon: false, newDragonIndex: -1, newHatchProgress: 0 };
        }
      },

      useHint() {
        const { currentProblem, hintUsed } = get();
        if (!currentProblem || hintUsed) return null;
        set(s => ({ score: Math.max(0, s.score - 8), hintUsed: true }));
        return currentProblem.hint;
      },

      nextProblem() {
        const { grade, difficulty } = get();
        const problem = generateHatcheryProblem(grade, difficulty);
        set({ currentProblem: problem, problemStartTime: Date.now(), hintUsed: false });
      },

      saveToLeaderboard() {
        const { playerName, grade, difficulty, score, dragonsUnlocked, leaderboard } = get();
        const entry: HatcheryLeaderboardEntry = {
          name: playerName,
          grade,
          difficulty,
          score,
          dragonsUnlocked,
          date: new Date().toISOString(),
        };
        const gradeEntries = [...leaderboard.filter(e => e.grade === grade && e.difficulty === difficulty), entry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        const otherEntries = leaderboard.filter(e => !(e.grade === grade && e.difficulty === difficulty));
        set({ leaderboard: [...otherEntries, ...gradeEntries] });
      },

      resetGame() {
        set({
          screen: 'START',
          score: 0,
          dragonsUnlocked: 0,
          correctAnswers: 0,
          currentStreak: 0,
          hatchProgress: 0,
          currentProblem: null,
          problemStartTime: null,
          hintUsed: false,
        });
      },
    }),
    {
      name: 'dragon-hatchery',
      partialize: (state) => ({ leaderboard: state.leaderboard }),
    }
  )
);
