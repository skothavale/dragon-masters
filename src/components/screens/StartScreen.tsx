import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { Grade, Difficulty } from '../../types';


export function StartScreen() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(2);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const initGame = useGameStore(s => s.initGame);
  const setCurrentGame = useGameStore(s => s.setCurrentGame);
  const leaderboard = useGameStore(s => s.leaderboard);

  const handleStart = () => {
    if (!name.trim()) return;
    initGame(name.trim(), grade, difficulty);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <div className="text-7xl mb-4">🏰🐉</div>
        <h1 className="text-4xl font-bold text-white mb-2">Storm the Castle</h1>
        <p className="text-yellow-400 text-lg">Dragon Math Quest</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-white font-semibold text-lg mb-4">Start Adventure</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Enter your name"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
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
                    grade === g ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
                  className={`flex-1 py-2 rounded-lg font-semibold capitalize transition-colors ${
                    difficulty === d ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-lg mt-2"
          >
            Start Adventure 🐉
          </button>

          <button
            onClick={() => setCurrentGame('SELECT')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors text-center"
          >
            Back to Game Select
          </button>
        </div>
      </div>

      {leaderboard.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-white font-semibold text-lg mb-3">🏆 Leaderboard</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-1">#</th>
                <th className="text-left py-1">Name</th>
                <th className="text-right py-1">Score</th>
                <th className="text-right py-1">Grade</th>
                <th className="text-right py-1">Diff</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="py-1 text-gray-500">{i + 1}</td>
                  <td className="py-1 text-white">{entry.name}</td>
                  <td className="py-1 text-yellow-400 text-right font-bold">{entry.score}</td>
                  <td className="py-1 text-gray-400 text-right">{entry.grade}</td>
                  <td className="py-1 text-gray-400 text-right capitalize">{entry.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
