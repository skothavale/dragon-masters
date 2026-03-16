import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useHatcheryStore } from '../../store/useHatcheryStore';
import type { Grade } from '../../types';

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string; desc: string }> = {
  easy:   { label: 'Easy',     color: 'bg-green-700 text-white',  desc: 'Smaller numbers' },
  medium: { label: 'Medium',   color: 'bg-yellow-700 text-white', desc: 'Standard challenge' },
  hard:   { label: 'Hard',     color: 'bg-red-700 text-white',    desc: 'Big numbers & multi-step' },
};

export function HatcheryStartScreen() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [lbGrade, setLbGrade] = useState<Grade>(1);
  const [lbDiff, setLbDiff] = useState<Difficulty>('medium');
  const setCurrentGame = useGameStore(s => s.setCurrentGame);
  const initGame = useHatcheryStore(s => s.initGame);
  const leaderboard = useHatcheryStore(s => s.leaderboard);

  const gradeLeaderboard = leaderboard
    .filter(e => e.grade === lbGrade && e.difficulty === lbDiff)
    .sort((a, b) => b.score - a.score);

  const handleStart = () => {
    if (!name.trim()) return;
    initGame(name.trim(), grade, difficulty);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-6xl mb-3">🥚🐉</div>
        <h1 className="text-4xl font-bold text-white mb-1">Dragon Egg Hatchery</h1>
        <p className="text-green-400 text-lg">Hatch all 10 dragons!</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-white font-semibold text-lg mb-4">Start Hatching</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Enter your name"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Grade</label>
            <div className="flex gap-2">
              {([1, 2, 3, 4, 5] as Grade[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    grade === g ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    difficulty === d
                      ? DIFFICULTY_LABELS[d].color
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {DIFFICULTY_LABELS[d].label}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-1">{DIFFICULTY_LABELS[difficulty].desc}</p>
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-lg mt-2"
          >
            Hatch Dragons! 🥚
          </button>

          <button
            onClick={() => setCurrentGame('SELECT')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors text-center"
          >
            Back to Game Select
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-lg">🏆 Leaderboard</h2>
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5] as Grade[]).map(g => (
              <button
                key={g}
                onClick={() => setLbGrade(g)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  lbGrade === g ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1 mb-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setLbDiff(d)}
              className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors ${
                lbDiff === d ? DIFFICULTY_LABELS[d].color : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {DIFFICULTY_LABELS[d].label}
            </button>
          ))}
        </div>
        {gradeLeaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm">No scores yet. Be the first!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-1">#</th>
                <th className="text-left py-1">Name</th>
                <th className="text-right py-1">Score</th>
                <th className="text-right py-1">Dragons</th>
              </tr>
            </thead>
            <tbody>
              {gradeLeaderboard.map((entry, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="py-1 text-gray-500">{i + 1}</td>
                  <td className="py-1 text-white">{entry.name}</td>
                  <td className="py-1 text-yellow-400 text-right font-bold">{entry.score}</td>
                  <td className="py-1 text-green-400 text-right">{entry.dragonsUnlocked}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
