import { useBattleStore } from '../../../store/useBattleStore';
import type { BattlePhase } from '../../../types';

interface Props {
  phase: BattlePhase;
}

export function PassDeviceScreen({ phase }: Props) {
  const p1 = useBattleStore(s => s.p1);
  const p2 = useBattleStore(s => s.p2);
  const passToPlayer2 = useBattleStore(s => s.passToPlayer2);
  const passToP2Select = useBattleStore(s => s.passToP2Select);

  let toName = '';
  let message = '';
  let action: () => void;
  let subtext = '';

  if (phase === 'PASS_TO_P2') {
    toName = p2.name;
    message = `${p1.name} collected ${p1.dragons.length} dragon${p1.dragons.length !== 1 ? 's' : ''}!`;
    subtext = "Pass the device to Player 2 — don't peek!";
    action = passToPlayer2;
  } else {
    // PASS_TO_P1_SELECT
    toName = p2.name;
    message = `${p1.name} has chosen their dragon!`;
    subtext = "Pass the device to Player 2 to pick their fighter!";
    action = passToP2Select;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950 flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center">
        <div className="text-7xl mb-4">📱</div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{message}</h1>
        <p className="text-purple-300 text-lg">{subtext}</p>
      </div>

      <div className="bg-purple-900/40 border border-amber-600/40 rounded-2xl px-8 py-6 text-center">
        <div className="text-purple-400 text-sm mb-1">Passing to:</div>
        <div className="text-amber-400 text-3xl font-extrabold">{toName}</div>
      </div>

      <button
        onClick={action}
        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 px-10 rounded-2xl text-xl transition-colors shadow-lg shadow-amber-900/30"
      >
        I'm ready, {toName}! →
      </button>
    </div>
  );
}
