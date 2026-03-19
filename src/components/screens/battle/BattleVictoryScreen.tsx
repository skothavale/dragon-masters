import { useBattleStore } from '../../../store/useBattleStore';
import { useGameStore } from '../../../store/useGameStore';
import { shapeEmoji, rarityStars } from '../../../lib/dragonGenerator';

export function BattleVictoryScreen() {
  const p1 = useBattleStore(s => s.p1);
  const p2 = useBattleStore(s => s.p2);
  const winner = useBattleStore(s => s.winner);
  const p1Hp = useBattleStore(s => s.p1Hp);
  const p2Hp = useBattleStore(s => s.p2Hp);
  const resetGame = useBattleStore(s => s.resetGame);
  const startCollection = useBattleStore(s => s.startCollection);
  const initSetup = useBattleStore(s => s.initSetup);
  const setCurrentGame = useGameStore(s => s.setCurrentGame);

  const winnerPlayer = winner === 1 ? p1 : p2;
  const loserPlayer = winner === 1 ? p2 : p1;
  const winnerDragon = winnerPlayer.selectedDragon;
  const remainingHp = winner === 1 ? p1Hp : p2Hp;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <div className="text-6xl md:text-8xl mb-3">🏆</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">{winnerPlayer.name} Wins!</h1>
        <p className="text-purple-300">{loserPlayer.name}'s dragon was defeated</p>
      </div>

      {winnerDragon && (
        <div
          className="rounded-2xl border-2 p-6 flex flex-col items-center gap-3 w-full max-w-xs"
          style={{ backgroundColor: winnerDragon.colorBg, borderColor: winnerDragon.colorBorder }}
        >
          <div className="text-6xl">{shapeEmoji(winnerDragon.shape)}</div>
          <div className="text-white font-extrabold text-xl">{winnerDragon.name}</div>
          <div className="text-yellow-300 text-lg">{rarityStars(winnerDragon.rarity)}</div>
          <div className="flex gap-4 text-sm">
            <span className="text-red-300">⚔️ Power: {winnerDragon.power}</span>
            <span className="text-emerald-300">❤️ HP left: {remainingHp}</span>
          </div>
          <div className="text-white/60 text-xs">{winnerDragon.fireEmoji} {winnerDragon.fireColor} fire · {winnerDragon.colorName}</div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={() => {
            initSetup(p1.name, p1.grade, p2.name, p2.grade);
            startCollection(1);
          }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-amber-900/30"
        >
          Play Again! ⚔️
        </button>
        <button
          onClick={() => { resetGame(); setCurrentGame('SELECT'); }}
          className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
