import { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import PhaserGame, { type PhaserGameRef } from '../../game/PhaserGame';
import { GamePanel } from '../ui/GamePanel';
import { PuzzleModal } from '../ui/PuzzleModal';

const ROOM_TYPE_EMOJI: Record<string, string> = {
  ENTRANCE: '🏰',
  FLOOR: '🪨',
  DOOR: '🚪',
  TREASURE: '💎',
  CHARM_FIRE: '🔥',
  CHARM_ICE: '❄️',
  CHARM_LIGHTNING: '⚡',
  FINAL_VAULT: '👑',
};

const ROOM_TYPE_NAME: Record<string, string> = {
  ENTRANCE: 'Castle Entrance',
  FLOOR: 'Stone Chamber',
  DOOR: 'Locked Door',
  TREASURE: 'Treasure Room',
  CHARM_FIRE: 'Fire Shrine',
  CHARM_ICE: 'Ice Shrine',
  CHARM_LIGHTNING: 'Storm Shrine',
  FINAL_VAULT: 'Final Vault',
};

const ROOM_TYPE_DESC: Record<string, string> = {
  ENTRANCE: 'You stand at the entrance of the ancient castle.',
  FLOOR: 'A dimly lit stone chamber. Passages lead in different directions.',
  DOOR: 'A magical door blocks your path. Solve the puzzle to proceed!',
  TREASURE: 'Glittering treasure fills this room. You feel your strength renewed!',
  CHARM_FIRE: 'Flames dance in this shrine. A fire charm awaits you!',
  CHARM_ICE: 'Frost coats the walls. An ice charm is yours!',
  CHARM_LIGHTNING: 'Lightning crackles here. A lightning charm empowers you!',
  FINAL_VAULT: 'The Final Vault! Victory is yours!',
};

export function GameScreen() {
  const dragonRef = useRef<PhaserGameRef | null>(null);
  const rooms = useGameStore(s => s.rooms);
  const currentRoomId = useGameStore(s => s.currentRoomId);
  const currentRoom = rooms[currentRoomId];

  useEffect(() => {
    if (currentRoom && dragonRef.current) {
      dragonRef.current.setRoomBackground(currentRoom.type);
    }
  }, [currentRoomId, currentRoom]);

  return (
    <div className="flex flex-row h-screen bg-gray-950">
      {/* Left panel: dragon display */}
      <div className="w-80 flex flex-col items-center justify-center bg-gray-900 border-r border-gray-800 gap-4 p-4">
        <h2 className="text-white font-bold text-lg">
          {ROOM_TYPE_EMOJI[currentRoom?.type ?? 'FLOOR']} {ROOM_TYPE_NAME[currentRoom?.type ?? 'FLOOR']}
        </h2>
        <PhaserGame ref={dragonRef} />
        <p className="text-gray-400 text-sm text-center px-2">
          {ROOM_TYPE_DESC[currentRoom?.type ?? 'FLOOR']}
        </p>
      </div>

      {/* Right panel */}
      <GamePanel />

      {/* Puzzle overlay */}
      <PuzzleModal dragonRef={dragonRef} />
    </div>
  );
}
