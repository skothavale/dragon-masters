import { useGameStore } from '../../store/useGameStore';
import type { Room, Direction } from '../../types';

const DIRECTIONS: Direction[] = ['N', 'S', 'E', 'W'];

const ROOM_BG: Record<string, string> = {
  ENTRANCE:        '#166534', // green-800
  FLOOR:           '#1f2937', // gray-800
  DOOR:            '#78350f', // amber-900
  TREASURE:        '#713f12', // yellow-900
  CHARM_FIRE:      '#7f1d1d', // red-900
  CHARM_ICE:       '#0c4a6e', // sky-900
  CHARM_LIGHTNING: '#3b0764', // purple-900
  FINAL_VAULT:     '#713f12', // yellow-900
};

const ROOM_BORDER: Record<string, string> = {
  ENTRANCE:        '#22c55e',
  FLOOR:           '#4b5563',
  DOOR:            '#f59e0b',
  TREASURE:        '#fbbf24',
  CHARM_FIRE:      '#f87171',
  CHARM_ICE:       '#7dd3fc',
  CHARM_LIGHTNING: '#c084fc',
  FINAL_VAULT:     '#fde68a',
};

const ROOM_LABEL: Record<string, string> = {
  ENTRANCE:        '🏰 Start',
  FLOOR:           '🪨 Chamber',
  DOOR:            '🔒 Door',
  TREASURE:        '💎 Treasure',
  CHARM_FIRE:      '🔥 Fire Shrine',
  CHARM_ICE:       '❄️ Ice Shrine',
  CHARM_LIGHTNING: '⚡ Storm Shrine',
  FINAL_VAULT:     '👑 Final Vault',
};

const CELL_W = 96;
const CELL_H = 52;
const GAP_X = 36;
const GAP_Y = 36;

interface Props {
  highlightedRoomId?: string | null;
  onRoomClick?: (roomId: string) => void;
}

export function MiniMap({ highlightedRoomId, onRoomClick }: Props) {
  const rooms = useGameStore(s => s.rooms);
  const currentRoomId = useGameStore(s => s.currentRoomId);

  if (Object.keys(rooms).length === 0) return null;

  const roomList = Object.values(rooms);
  const current = rooms[currentRoomId];
  const adjacentIds = new Set(Object.values(current?.connections ?? {}));

  const maxX = Math.max(...roomList.map(r => r.gridX));
  const maxY = Math.max(...roomList.map(r => r.gridY));

  const totalW = (maxX + 1) * CELL_W + maxX * GAP_X;
  const totalH = (maxY + 1) * CELL_H + maxY * GAP_Y;

  const getCenter = (room: Room) => ({
    cx: room.gridX * (CELL_W + GAP_X) + CELL_W / 2,
    cy: room.gridY * (CELL_H + GAP_Y) + CELL_H / 2,
  });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Castle Map</span>
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 overflow-auto">
        <div className="relative" style={{ width: totalW, height: totalH, minWidth: totalW }}>

          {/* Connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={totalW}
            height={totalH}
          >
            {roomList.map(room =>
              DIRECTIONS.map(dir => {
                const neighborId = room.connections[dir];
                if (!neighborId) return null;
                const neighbor = rooms[neighborId];
                const key = [room.id, neighborId].sort().join('|');
                const { cx: x1, cy: y1 } = getCenter(room);
                const { cx: x2, cy: y2 } = getCenter(neighbor);
                const bothVisited = room.visited && neighbor.visited;
                return (
                  <line
                    key={key + dir}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={bothVisited ? '#6b7280' : '#374151'}
                    strokeWidth={bothVisited ? 2 : 1.5}
                    strokeDasharray={bothVisited ? undefined : '4 4'}
                  />
                );
              })
            )}
          </svg>

          {/* Room nodes */}
          {roomList.map(room => {
            const isCurrent = room.id === currentRoomId;
            const isHighlighted = room.id === highlightedRoomId;
            const isAdjacent = adjacentIds.has(room.id);
            const label = ROOM_LABEL[room.type];
            const bg = room.visited ? ROOM_BG[room.type] : '#111827';
            const border = room.visited ? ROOM_BORDER[room.type] : ROOM_BORDER[room.type] + '88';

            let outline = 'none';
            if (isCurrent) outline = '3px solid #ffffff';
            else if (isHighlighted) outline = '3px solid #60a5fa';

            return (
              <div
                key={room.id}
                onClick={() => isAdjacent && onRoomClick?.(room.id)}
                style={{
                  position: 'absolute',
                  left: room.gridX * (CELL_W + GAP_X),
                  top: room.gridY * (CELL_H + GAP_Y),
                  width: CELL_W,
                  height: CELL_H,
                  backgroundColor: bg,
                  border: `2px solid ${border}`,
                  outline,
                  outlineOffset: '2px',
                  borderRadius: 10,
                  cursor: isAdjacent ? 'pointer' : 'default',
                  opacity: room.visited || isCurrent ? 1 : 0.5,
                  transition: 'outline 0.1s, opacity 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 6px',
                  boxSizing: 'border-box',
                }}
                title={room.visited ? ROOM_LABEL[room.type] : (isAdjacent ? 'Unexplored room' : 'Unknown')}
              >
                <span style={{
                  fontSize: 11,
                  fontWeight: isCurrent || isHighlighted ? 700 : 500,
                  color: isCurrent ? '#ffffff' : isHighlighted ? '#93c5fd' : room.visited ? '#e5e7eb' : '#9ca3af',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                  userSelect: 'none',
                }}>
                  {label}
                </span>
                {isCurrent && (
                  <span style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>YOU ARE HERE</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block border border-green-500" style={{ backgroundColor: '#166534' }} />Start</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block border border-amber-500" style={{ backgroundColor: '#78350f' }} />Door</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block border border-yellow-400" style={{ backgroundColor: '#713f12' }} />Treasure</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block border border-yellow-200" style={{ backgroundColor: '#713f12' }} />Vault</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block border border-gray-500" style={{ backgroundColor: '#1f2937' }} />Chamber</span>
      </div>
    </div>
  );
}
