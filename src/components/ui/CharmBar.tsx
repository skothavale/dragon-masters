import { useGameStore } from '../../store/useGameStore';
import type { CharmType } from '../../types';

const CHARM_EMOJI: Record<CharmType, string> = { FIRE: '🔥', ICE: '❄️', LIGHTNING: '⚡' };

export function CharmBar() {
  const charms = useGameStore(s => s.charms);
  const activePuzzle = useGameStore(s => s.activePuzzle);
  const activateCharm = useGameStore(s => s.activateCharm);

  const handleCharm = (charm: CharmType) => {
    if (!activePuzzle) return;
    if (charm === 'LIGHTNING') {
      activateCharm(charm);
    } else {
      // For FIRE/ICE, activate on first number by default
      activateCharm(charm, 0);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-wide">Charms</span>
      <div className="flex gap-2">
        {charms.length === 0 && <span className="text-gray-600 text-sm">None collected</span>}
        {charms.map((charm, i) => (
          <button
            key={i}
            onClick={() => handleCharm(charm)}
            disabled={!activePuzzle}
            title={charm === 'FIRE' ? 'Double a hint number' : charm === 'ICE' ? 'Halve a hint number' : 'Regenerate hint numbers'}
            className="text-2xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg p-2 transition-colors border border-gray-700"
          >
            {CHARM_EMOJI[charm]}
          </button>
        ))}
      </div>
    </div>
  );
}
