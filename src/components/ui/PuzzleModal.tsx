import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { checkAnswer } from '../../lib/puzzleSolver';
import type { PhaserGameRef } from '../../game/PhaserGame';

interface Props {
  dragonRef: React.RefObject<PhaserGameRef | null>;
}

function InfoTooltip({ requireAll }: { requireAll: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(o => !o)}
        className="w-5 h-5 rounded-full bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold flex items-center justify-center leading-none transition-colors"
        aria-label="How to write a formula"
      >
        ?
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-7 w-72 bg-gray-800 border border-gray-600 rounded-xl p-4 shadow-2xl z-10 text-left">
          <div className="text-white font-semibold mb-2 text-sm">How to write a formula</div>
          <ul className="text-gray-300 text-xs space-y-2">
            {requireAll ? (
              <li><span className="text-yellow-400 font-bold">Use ALL numbers</span> — every hint number must appear in your formula exactly once.</li>
            ) : (
              <li><span className="text-yellow-400 font-bold">Pick a subset</span> — choose which numbers to use. You don't have to use all of them, but each one can only be used once.</li>
            )}
            <li><span className="text-yellow-400 font-bold">Place operators between numbers</span> — use <code className="bg-gray-700 px-1 rounded">+</code> <code className="bg-gray-700 px-1 rounded">-</code> <code className="bg-gray-700 px-1 rounded">×</code> <code className="bg-gray-700 px-1 rounded">÷</code> between numbers.</li>
            <li><span className="text-yellow-400 font-bold">Order of operations</span> — <code className="bg-gray-700 px-1 rounded">×</code> and <code className="bg-gray-700 px-1 rounded">÷</code> happen before <code className="bg-gray-700 px-1 rounded">+</code> and <code className="bg-gray-700 px-1 rounded">-</code>.</li>
            {requireAll && (
              <li><span className="text-yellow-400 font-bold">Parentheses</span> — use <code className="bg-gray-700 px-1 rounded">(</code> <code className="bg-gray-700 px-1 rounded">)</code> to control the order, e.g. <code className="bg-gray-700 px-1 rounded">(3 + 5) × 6</code></li>
            )}
          </ul>
          <div className="mt-3 pt-2 border-t border-gray-700 text-gray-400 text-xs">
            {requireAll
              ? 'Hard mode: you must use every number shown.'
              : 'Easy/Medium: extra numbers are shown as distractors — figure out which ones you need!'}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3 h-3 bg-gray-800 border-r border-b border-gray-600 rotate-45" />
        </div>
      )}
    </div>
  );
}

export function PuzzleModal({ dragonRef }: Props) {
  const activePuzzle = useGameStore(s => s.activePuzzle);
  const activeDoorId = useGameStore(s => s.activeDoorId);
  const rooms = useGameStore(s => s.rooms);
  const charms = useGameStore(s => s.charms);
  const submitAnswer = useGameStore(s => s.submitAnswer);
  const closePuzzle = useGameStore(s => s.closePuzzle);
  const loseHeart = useGameStore(s => s.loseHeart);
  const activateCharm = useGameStore(s => s.activateCharm);
  const useHint = useGameStore(s => s.useHint);

  const [expression, setExpression] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTreasure = activeDoorId ? rooms[activeDoorId]?.type === 'TREASURE' : false;
  const requireAll = activePuzzle?.requireAll ?? false;

  useEffect(() => {
    if (activePuzzle) { setExpression(''); setFeedback(null); setHintUsed(false); }
  }, [activePuzzle]);

  if (!activePuzzle) return null;

  const liveValidation = expression.trim()
    ? checkAnswer(expression, activePuzzle.target, activePuzzle.numbers, activePuzzle.requireAll)
    : null;
  const showError = liveValidation?.error ?? null;

  const handleSubmit = () => {
    const correct = submitAnswer(expression);
    if (correct) {
      dragonRef.current?.playFireBreath();
      setFeedback(null);
    } else {
      const result = checkAnswer(expression, activePuzzle.target, activePuzzle.numbers, activePuzzle.requireAll);
      setFeedback(result.error ? `⚠ ${result.error}` : 'Wrong answer! -1 ❤️');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      if (!result.error) setExpression('');
    }
  };

  const handleGiveUp = () => {
    loseHeart();
    closePuzzle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleGiveUp();
  };

  const handleHint = () => {
    const hint = useHint();
    if (hint) {
      setExpression(hint);
      setHintUsed(true);
      setFeedback(null);
      inputRef.current?.focus();
    }
  };

  const insertAtCursor = (text: string) => {
    const input = inputRef.current;
    if (!input) { setExpression(prev => prev + text); return; }
    const start = input.selectionStart ?? expression.length;
    const end = input.selectionEnd ?? expression.length;
    const next = expression.slice(0, start) + text + expression.slice(end);
    setExpression(next);
    setFeedback(null);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const handleInputChange = (val: string) => {
    // Strip parentheses on easy/medium
    if (!requireAll) val = val.replace(/[()]/g, '');
    setExpression(val);
    setFeedback(null);
  };

  const OPS = activePuzzle.operations.map(op => ({
    label: op === '*' ? '×' : op === '/' ? '÷' : op,
    insert: op === '*' ? ' * ' : op === '/' ? ' / ' : ` ${op} `,
  }));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-transform ${shaking ? 'animate-bounce' : ''}`}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-3xl mb-1">{isTreasure ? '💎' : '🚪'}</div>
          <h2 className="text-xl font-bold text-white">
            {isTreasure ? 'Treasure is Locked!' : 'Door is Locked!'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isTreasure
              ? 'Solve the puzzle to claim your treasure (+20 score, +1 ❤️)'
              : 'Build a formula that equals the target number'}
          </p>
        </div>

        {/* Target */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 text-center">
          <div className="text-gray-400 text-sm mb-1">Target</div>
          <div className="text-5xl font-bold text-yellow-400">{activePuzzle.target}</div>
        </div>

        {/* Numbers */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">
              {requireAll
                ? 'Use all of these numbers, each exactly once:'
                : 'Pick any of these numbers to use (each once):'}
            </span>
            <InfoTooltip requireAll={requireAll} />
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            {activePuzzle.numbers.map((n, i) => (
              <button
                key={i}
                onClick={() => insertAtCursor(String(n))}
                className="bg-blue-900 hover:bg-blue-800 text-blue-200 text-xl font-bold px-4 py-2 rounded-lg border border-blue-700 transition-colors"
                title="Click to insert"
              >
                {n}
              </button>
            ))}
          </div>

          {/* Operator buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-500 text-xs">Operators:</span>
            {OPS.map(({ label, insert }) => (
              <button
                key={label}
                onClick={() => insertAtCursor(insert)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg w-10 h-10 rounded-lg border border-gray-600 transition-colors"
              >
                {label}
              </button>
            ))}
            {/* Parentheses only on hard */}
            {requireAll && (
              <>
                <button onClick={() => insertAtCursor('(')} className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-lg w-10 h-10 rounded-lg border border-gray-600 transition-colors">(</button>
                <button onClick={() => insertAtCursor(')')} className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-lg w-10 h-10 rounded-lg border border-gray-600 transition-colors">)</button>
              </>
            )}
            <button
              onClick={() => { setExpression(''); setFeedback(null); inputRef.current?.focus(); }}
              className="bg-gray-800 hover:bg-gray-700 text-red-400 text-xs font-semibold px-2 h-10 rounded-lg border border-gray-700 transition-colors ml-auto"
            >Clear</button>
          </div>
        </div>

        {/* Charms */}
        {charms.length > 0 && (
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-2">Use a charm:</div>
            <div className="flex gap-2">
              {charms.map((charm, i) => (
                <button
                  key={i}
                  onClick={() => charm === 'LIGHTNING' ? activateCharm(charm) : activateCharm(charm, 0)}
                  className="text-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 transition-colors"
                  title={charm === 'FIRE' ? '🔥 Double first hint number' : charm === 'ICE' ? '❄️ Halve first hint number' : '⚡ Regenerate all hint numbers'}
                >
                  {charm === 'FIRE' ? '🔥' : charm === 'ICE' ? '❄️' : '⚡'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expression input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-gray-400 text-sm">Your formula:</label>
            {!hintUsed ? (
              <button
                onClick={handleHint}
                className="text-xs text-amber-400 hover:text-amber-300 border border-amber-800 hover:border-amber-600 rounded px-2 py-0.5 transition-colors"
                title="Show a working answer — costs 5 points"
              >
                Hint (-5 pts)
              </button>
            ) : (
              <span className="text-xs text-gray-600">Hint used (-5 pts)</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={expression}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=""
            autoFocus
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {showError && (
            <div className="mt-1 text-sm text-orange-400 font-mono">⚠ {showError}</div>
          )}
          {feedback && <div className="mt-1 text-sm text-red-400">{feedback}</div>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!expression.trim()}
            className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            Submit
          </button>
          <button
            onClick={handleGiveUp}
            className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Give Up -1 ❤️
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-2">Enter to submit · Esc to give up · Click numbers/operators to insert</p>
      </div>
    </div>
  );
}
