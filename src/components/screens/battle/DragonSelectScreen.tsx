import { useState } from 'react';
import { useBattleStore } from '../../../store/useBattleStore';
import { shapeEmoji, rarityStars } from '../../../lib/dragonGenerator';
import type { BattleDragon } from '../../../types';

function DragonCard({ dragon, selected, onClick }: { dragon: BattleDragon; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-1 transition-all active:scale-95 ${selected ? 'ring-4 ring-amber-400 scale-105' : 'hover:scale-102'}`}
      style={{ backgroundColor: dragon.colorBg, borderColor: selected ? '#f59e0b' : dragon.colorBorder }}
    >
      <div className="text-3xl">{shapeEmoji(dragon.shape)}</div>
      <div className="text-white font-bold text-xs text-center leading-tight">{dragon.name}</div>
      <div className="text-yellow-300 text-xs">{rarityStars(dragon.rarity)}</div>
      <div className="flex gap-2 text-xs mt-1">
        <span className="text-red-300">⚔️{dragon.power}</span>
        <span className="text-emerald-300">❤️{dragon.health}</span>
      </div>
      <div className="text-xs">{dragon.fireEmoji}</div>
    </button>
  );
}

export function DragonSelectScreen() {
  const phase = useBattleStore(s => s.phase);
  const p1 = useBattleStore(s => s.p1);
  const p2 = useBattleStore(s => s.p2);
  const selectDragon = useBattleStore(s => s.selectDragon);

  const isP1 = phase === 'DRAGON_SELECT_P1';
  const player = isP1 ? p1 : p2;
  const playerNum: 1 | 2 = isP1 ? 1 : 2;

  // Find recommended dragon (highest power + health)
  const recommended = [...player.dragons].sort((a, b) => (b.power + b.health) - (a.power + a.health))[0];
  const [selectedId, setSelectedId] = useState<string>(recommended?.id ?? '');

  const handleConfirm = () => {
    if (!selectedId) return;
    selectDragon(playerNum, selectedId);
  };

  const selected = player.dragons.find((d: BattleDragon) => d.id === selectedId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950 flex flex-col items-center p-4 gap-4">
      {/* Header */}
      <div className="text-center mt-4">
        <div className="text-4xl mb-2">{isP1 ? '🔵' : '🔴'}</div>
        <h1 className="text-2xl font-extrabold text-white">{player.name}, choose your dragon!</h1>
        <p className="text-purple-400 text-sm mt-1">You have {player.dragons.length} dragon{player.dragons.length !== 1 ? 's' : ''} · ⭐ = Recommended</p>
      </div>

      {/* Dragon grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full max-w-xl">
        {player.dragons.map((d: BattleDragon) => (
          <div key={d.id} className="relative">
            {d.id === recommended?.id && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 text-xs bg-amber-600 text-white px-1.5 py-0.5 rounded-full font-bold">Best</div>
            )}
            <DragonCard dragon={d} selected={selectedId === d.id} onClick={() => setSelectedId(d.id)} />
          </div>
        ))}
      </div>

      {/* Selected dragon stats */}
      {selected && (
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl px-6 py-4 w-full max-w-sm text-center">
          <div className="text-purple-400 text-xs mb-1">Selected</div>
          <div className="text-white font-bold text-lg">{selected.name}</div>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <span className="text-red-300">⚔️ Power: <strong>{selected.power}</strong></span>
            <span className="text-emerald-300">❤️ Health: <strong>{selected.health}</strong> (HP: {selected.health * 10})</span>
          </div>
          <div className="text-purple-400 text-xs mt-1">{selected.colorName} · {selected.fireEmoji} {selected.fireColor} fire</div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedId}
        className="w-full max-w-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-amber-900/30"
      >
        Choose {selected?.name ?? 'Dragon'}! ⚔️
      </button>
    </div>
  );
}
