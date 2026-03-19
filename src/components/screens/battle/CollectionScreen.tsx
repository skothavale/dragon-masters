import { useState, useEffect, useCallback } from 'react';
import { useBattleStore } from '../../../store/useBattleStore';
import { Numpad } from '../../ui/Numpad';
import { shapeEmoji, rarityStars } from '../../../lib/dragonGenerator';
import type { BattleDragon } from '../../../types';

export function CollectionScreen() {
  const phase = useBattleStore(s => s.phase);
  const p1 = useBattleStore(s => s.p1);
  const p2 = useBattleStore(s => s.p2);
  const collectionTimeLeft = useBattleStore(s => s.collectionTimeLeft);
  const currentProblem = useBattleStore(s => s.currentProblem);
  const tickTimer = useBattleStore(s => s.tickTimer);
  const submitCollectionAnswer = useBattleStore(s => s.submitCollectionAnswer);

  const isP1 = phase === 'COLLECTION_P1';
  const player = isP1 ? p1 : p2;

  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; dragon: BattleDragon | null } | null>(null);
  const [shake, setShake] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  const handleSubmit = useCallback(() => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || animating) return;
    setInputValue('');
    setAnimating(true);
    const result = submitCollectionAnswer(parsed);
    setFeedback({ correct: result.correct, dragon: result.dragonEarned });
    if (!result.correct) setShake(true);
    setTimeout(() => {
      setFeedback(null);
      setShake(false);
      setAnimating(false);
    }, result.dragonEarned ? 1800 : 800);
  }, [inputValue, animating, submitCollectionAnswer]);

  const mins = Math.floor(collectionTimeLeft / 60);
  const secs = collectionTimeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
  const timeWarning = collectionTimeLeft <= 30;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-gray-950 flex flex-col p-4 gap-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-purple-900/40 border border-purple-700/50 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isP1 ? '🔵' : '🔴'}</span>
          <span className="text-purple-100 font-bold">{player.name}</span>
          <span className="bg-purple-800 text-purple-200 text-xs font-bold px-2 py-0.5 rounded-full">Gr.{player.grade}</span>
        </div>
        <div className={`text-xl font-mono font-extrabold ${timeWarning ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
          ⏱ {timeStr}
        </div>
      </div>

      {/* Dragon count */}
      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-purple-300 text-sm">Dragons collected:</span>
        <span className="text-amber-400 font-extrabold text-xl">{player.dragons.length} 🐉</span>
      </div>

      {/* Problem */}
      <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-5 text-center flex-1 flex flex-col items-center justify-center">
        <div className="text-purple-400 text-sm mb-2">Solve to earn a dragon:</div>
        <div className="text-white text-4xl font-extrabold font-mono mb-2">
          {currentProblem?.expression ?? '...'} = ?
        </div>
        {feedback && (
          <div className={`mt-3 text-lg font-bold ${feedback.correct ? 'text-emerald-400' : 'text-red-400'}`}>
            {feedback.dragon ? `🐉 New dragon: ${feedback.dragon.name}!` : feedback.correct ? '✓ Correct!' : '✗ Wrong!'}
          </div>
        )}
      </div>

      {/* Numpad */}
      <Numpad
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={animating}
        submitLabel="✓ Answer"
        shake={shake}
      />

      {/* Dragon previews */}
      {player.dragons.length > 0 && (
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-3">
          <div className="text-purple-400 text-xs mb-2">Your dragons:</div>
          <div className="flex flex-wrap gap-2">
            {player.dragons.slice(-8).map(d => (
              <div
                key={d.id}
                className="flex flex-col items-center justify-center rounded-xl border-2 p-2 w-14 h-14 text-center"
                style={{ backgroundColor: d.colorBg, borderColor: d.colorBorder }}
              >
                <span className="text-xl">{shapeEmoji(d.shape)}</span>
                <span className="text-white text-xs font-bold" style={{ fontSize: 8 }}>{rarityStars(d.rarity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
