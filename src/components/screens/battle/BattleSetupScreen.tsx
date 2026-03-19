import { useState } from 'react';
import { useBattleStore } from '../../../store/useBattleStore';
import { useGameStore } from '../../../store/useGameStore';
import type { Grade } from '../../../types';

export function BattleSetupScreen() {
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p1Grade, setP1Grade] = useState<Grade>(3);
  const [p2Grade, setP2Grade] = useState<Grade>(3);
  const initSetup = useBattleStore(s => s.initSetup);
  const startCollection = useBattleStore(s => s.startCollection);
  const setCurrentGame = useGameStore(s => s.setCurrentGame);

  const handleStart = () => {
    initSetup(p1Name, p1Grade, p2Name, p2Grade);
    startCollection(1);
  };

  const GradeSelector = ({ value, onChange }: { value: Grade; onChange: (g: Grade) => void }) => (
    <div className="flex gap-1.5">
      {([1,2,3,4,5] as Grade[]).map(g => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`flex-1 py-2.5 rounded-xl font-bold text-lg transition-colors ${
            value === g ? 'bg-amber-600 text-white' : 'bg-purple-800 text-purple-300 hover:bg-purple-700'
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950 flex flex-col items-center justify-center p-4 gap-6">
      <div className="text-center">
        <div className="text-6xl mb-3">⚔️🐉⚔️</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">Battle of the Dragons</h1>
        <p className="text-purple-300">2-Player Local Battle</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        {/* Player 1 */}
        <div className="flex-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔵</span>
            <h2 className="text-lg font-bold text-purple-100">Player 1</h2>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={p1Name}
              onChange={e => setP1Name(e.target.value)}
              placeholder="Player 1 name"
              className="w-full bg-purple-950/60 border border-purple-600/40 rounded-xl px-3 py-2.5 text-white placeholder-purple-500 focus:outline-none focus:border-amber-500"
            />
            <div>
              <div className="text-purple-400 text-sm mb-1.5">Grade</div>
              <GradeSelector value={p1Grade} onChange={setP1Grade} />
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center">
          <span className="text-2xl font-extrabold text-purple-600">VS</span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔴</span>
            <h2 className="text-lg font-bold text-purple-100">Player 2</h2>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={p2Name}
              onChange={e => setP2Name(e.target.value)}
              placeholder="Player 2 name"
              className="w-full bg-purple-950/60 border border-purple-600/40 rounded-xl px-3 py-2.5 text-white placeholder-purple-500 focus:outline-none focus:border-amber-500"
            />
            <div>
              <div className="text-purple-400 text-sm mb-1.5">Grade</div>
              <GradeSelector value={p2Grade} onChange={setP2Grade} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-2xl text-xl transition-colors shadow-lg shadow-amber-900/30"
        >
          Begin Dragon Collection! 🐉
        </button>
        <button
          onClick={() => setCurrentGame('SELECT')}
          className="text-purple-400 hover:text-purple-200 text-center py-2 transition-colors"
        >
          ← Back to Game Select
        </button>
      </div>
    </div>
  );
}
