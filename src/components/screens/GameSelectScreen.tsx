import { useGameStore } from '../../store/useGameStore';

export function GameSelectScreen() {
  const setCurrentGame = useGameStore(s => s.setCurrentGame);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 gap-10">
      <div className="text-center">
        <div className="text-7xl mb-4">🐉</div>
        <h1 className="text-5xl font-bold text-white mb-2">Dragon Masters</h1>
        <p className="text-gray-400 text-lg">Choose your adventure</p>
      </div>

      <div className="flex gap-6 flex-wrap justify-center">
        <button
          onClick={() => setCurrentGame('STORM_CASTLE')}
          className="bg-gray-900 border-2 border-gray-700 hover:border-yellow-500 rounded-2xl p-8 w-72 text-left transition-all hover:shadow-lg hover:shadow-yellow-900/30 group"
        >
          <div className="text-5xl mb-4">🏰</div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Storm the Castle</h2>
          <p className="text-gray-400 text-sm mb-6">
            Navigate a maze, solve math puzzles to open doors, and reach the Final Vault. Collect charms and outsmart dragons!
          </p>
          <div className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-colors">
            Play
          </div>
        </button>

        <button
          onClick={() => setCurrentGame('HATCHERY')}
          className="bg-gray-900 border-2 border-gray-700 hover:border-green-500 rounded-2xl p-8 w-72 text-left transition-all hover:shadow-lg hover:shadow-green-900/30 group"
        >
          <div className="text-5xl mb-4">🥚</div>
          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Dragon Egg Hatchery</h2>
          <p className="text-gray-400 text-sm mb-6">
            Solve math problems to hatch dragon eggs! Unlock all 20 dragons, earn speed and streak bonuses, and build your collection.
          </p>
          <div className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-center transition-colors">
            Play
          </div>
        </button>
      </div>
    </div>
  );
}
