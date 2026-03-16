import { useGameStore } from '../../store/useGameStore';

export function GameOverScreen() {
  const score = useGameStore(s => s.score);
  const playerName = useGameStore(s => s.playerName);
  const resetGame = useGameStore(s => s.resetGame);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-8xl mb-4">💀</div>
        <h1 className="text-4xl font-bold text-red-400 mb-2">Game Over</h1>
        <p className="text-white text-xl">The castle defeated you, {playerName}...</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center w-full max-w-sm">
        <div className="text-gray-400 text-sm mb-1">Final Score</div>
        <div className="text-6xl font-bold text-red-400">{score}</div>
      </div>

      <button
        onClick={resetGame}
        className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg"
      >
        Try Again
      </button>
    </div>
  );
}
