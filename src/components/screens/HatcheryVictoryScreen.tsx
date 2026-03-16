import { useEffect, useRef } from 'react';
import { useHatcheryStore } from '../../store/useHatcheryStore';
import { useGameStore } from '../../store/useGameStore';

const DRAGON_NAMES = [
  'Ember', 'Sparky', 'Blaze', 'Sunny', 'Cinder',
  'Crimson', 'Scarlet', 'Fury', 'Ember Rose', 'Magma',
];

export function HatcheryVictoryScreen() {
  const { playerName, grade, score, dragonsUnlocked, saveToLeaderboard, resetGame } = useHatcheryStore();
  const setCurrentGame = useGameStore(s => s.setCurrentGame);
  const saved = useRef(false);

  useEffect(() => {
    if (!saved.current) {
      saved.current = true;
      saveToLeaderboard();
    }
  }, [saveToLeaderboard]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-6xl mb-3">🎉🐉🎉</div>
        <h1 className="text-4xl font-bold text-white mb-2">All Dragons Hatched!</h1>
        <p className="text-green-400 text-xl">
          {playerName} collected all 10 dragons!
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="bg-gray-800 text-yellow-400 font-bold text-2xl px-6 py-2 rounded-xl border border-gray-700">
            {score} pts
          </span>
          <span className="bg-gray-800 text-blue-400 font-bold px-4 py-2 rounded-xl border border-gray-700">
            Grade {grade}
          </span>
        </div>
      </div>

      {/* Dragon collection */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-white font-semibold text-lg mb-4">Your Dragon Collection</h2>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: dragonsUnlocked }, (_, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-green-700 rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <div className="text-2xl">🐉</div>
              <div className="text-green-300 text-xs font-medium text-center">{DRAGON_NAMES[i]}</div>
              <div className="text-gray-500 text-xs">#{i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            resetGame();
          }}
          className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg"
        >
          Play Again 🥚
        </button>
        <button
          onClick={() => {
            resetGame();
            setCurrentGame('SELECT');
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg"
        >
          Game Select
        </button>
      </div>
    </div>
  );
}
