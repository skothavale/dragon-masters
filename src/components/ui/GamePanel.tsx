import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { HeartsDisplay } from './HeartsDisplay';
import { CharmBar } from './CharmBar';
import { NavInstructions } from './NavButtons';
import { MiniMap } from './MiniMap';
import type { Direction } from '../../types';

const GRADE_LABEL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };
const DIFF_COLORS: Record<string, string> = {
  easy: 'bg-green-800 text-green-200',
  medium: 'bg-yellow-800 text-yellow-200',
  hard: 'bg-red-800 text-red-200',
};

const KEY_DIR: Record<string, Direction> = {
  ArrowUp: 'N', ArrowDown: 'S', ArrowLeft: 'W', ArrowRight: 'E',
};

export function GamePanel() {
  const playerName = useGameStore(s => s.playerName);
  const grade = useGameStore(s => s.grade);
  const difficulty = useGameStore(s => s.difficulty);
  const hearts = useGameStore(s => s.hearts);
  const score = useGameStore(s => s.score);
  const rooms = useGameStore(s => s.rooms);
  const currentRoomId = useGameStore(s => s.currentRoomId);
  const activePuzzle = useGameStore(s => s.activePuzzle);
  const move = useGameStore(s => s.move);

  const [hoveredDir, setHoveredDir] = useState<Direction | null>(null);

  const current = rooms[currentRoomId];

  // Clear hovered direction when room changes
  useEffect(() => {
    setHoveredDir(null);
  }, [currentRoomId]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't intercept when typing in an input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (activePuzzle) return;

    const dir = KEY_DIR[e.key];
    if (dir) {
      e.preventDefault();
      if (current?.connections[dir]) {
        setHoveredDir(dir);
      }
      return;
    }

    if (e.key === 'Enter' && hoveredDir && current?.connections[hoveredDir]) {
      e.preventDefault();
      move(hoveredDir);
    }
  }, [activePuzzle, current, hoveredDir, move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const highlightedRoomId = hoveredDir ? (current?.connections[hoveredDir] ?? null) : null;

  const handleRoomClick = (roomId: string) => {
    if (activePuzzle) return;
    // Find which direction leads to this room
    const dir = Object.entries(current?.connections ?? {}).find(([, id]) => id === roomId)?.[0] as Direction | undefined;
    if (dir) move(dir);
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-5 bg-gray-950 overflow-y-auto">
      {/* Player info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg">{playerName}</div>
          <div className="text-gray-400 text-sm">{GRADE_LABEL[grade]} Grade</div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${DIFF_COLORS[difficulty]}`}>
          {difficulty}
        </span>
      </div>

      <HeartsDisplay hearts={hearts} />

      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">Score</div>
        <div className="text-3xl font-bold text-yellow-400">{score}</div>
      </div>

      <CharmBar />
      <NavInstructions hoveredDir={hoveredDir} />
      <MiniMap highlightedRoomId={highlightedRoomId} onRoomClick={handleRoomClick} />
    </div>
  );
}
