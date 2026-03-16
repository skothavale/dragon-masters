import type { Direction } from '../../types';

// Direction key info shown to the player
const KEY_HINTS: { key: string; dir: Direction; label: string }[] = [
  { key: '↑', dir: 'N', label: 'North' },
  { key: '←', dir: 'W', label: 'West'  },
  { key: '↓', dir: 'S', label: 'South' },
  { key: '→', dir: 'E', label: 'East'  },
];

interface Props {
  hoveredDir: Direction | null;
}

export function NavInstructions({ hoveredDir }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Navigation</span>
      <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {KEY_HINTS.map(({ key, dir, label }) => (
            <span
              key={dir}
              className={`flex items-center gap-1 text-sm transition-colors ${
                hoveredDir === dir ? 'text-blue-300 font-bold' : 'text-gray-400'
              }`}
            >
              <kbd className={`inline-flex items-center justify-center w-7 h-7 rounded border text-xs font-mono font-bold transition-colors ${
                hoveredDir === dir
                  ? 'bg-blue-700 border-blue-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300'
              }`}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Press <kbd className="bg-gray-800 border border-gray-600 rounded px-1 text-gray-300 font-mono text-xs">Enter</kbd> to move into the highlighted room, or click a room on the map.
        </p>
      </div>
    </div>
  );
}
