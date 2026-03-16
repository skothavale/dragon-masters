import { useRef, useState, useEffect, useCallback } from 'react';
import HatcheryGame from '../../game/HatcheryGame';
import type { HatcherySceneRef } from '../../game/HatcheryGame';
import { useHatcheryStore } from '../../store/useHatcheryStore';
import { DRAGON_UI_INFO } from '../../game/scenes/HatcheryScene';

const TIMER_SECONDS = 20;

const DRAGON_NAMES = [
  'Ember', 'Sparky', 'Blaze', 'Sunny', 'Cinder',
  'Crimson', 'Scarlet', 'Fury', 'Ember Rose', 'Magma',
  'Frost', 'Steel', 'Shadow', 'Smoke', 'Void',
  'Aurum', 'Lava King', 'Obsidian', 'Nebula', 'Ancient',
];

const DIFFICULTY_COLORS = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400',
};

type FeedbackState = { text: string; color: string } | null;

export function HatcheryGameScreen() {
  const store = useHatcheryStore();
  const sceneRef = useRef<HatcherySceneRef>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [shakeInput, setShakeInput] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // null = showing egg/dragon normally; number = previewing that dragon index
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Show egg when problem loads
  useEffect(() => {
    if (store.screen === 'GAME' && previewIdx === null) {
      sceneRef.current?.showEgg();
    }
  }, [store.screen, previewIdx]);

  // Focus input when not animating and not previewing
  useEffect(() => {
    if (!isAnimating && previewIdx === null) {
      inputRef.current?.focus();
    }
  }, [isAnimating, store.currentProblem, previewIdx]);

  const handleTimeout = useCallback(() => {
    clearTimer();
    setIsAnimating(true);
    const answer = store.currentProblem?.answer ?? '?';
    setFeedback({ text: `Time's up! Answer was ${answer}`, color: 'text-red-400' });
    store.submitAnswer(-999999);
    sceneRef.current?.updateEggProgress(0);
    setTimeout(() => {
      setFeedback(null);
      sceneRef.current?.showEgg();
      setIsAnimating(false);
    }, 2000);
  }, [clearTimer, store]);

  // Countdown timer
  useEffect(() => {
    if (isAnimating || previewIdx !== null) return;
    clearTimer();
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [store.currentProblem, isAnimating, previewIdx, clearTimer, handleTimeout]);

  const handleSubmit = useCallback(() => {
    if (isAnimating || !store.currentProblem || previewIdx !== null) return;
    const parsed = parseInt(answerInput, 10);
    if (isNaN(parsed)) return;

    clearTimer();
    setIsAnimating(true);
    setAnswerInput('');
    setHintText(null);

    const result = store.submitAnswer(parsed);
    const newProgress = store.hatchProgress as 0 | 1 | 2;

    if (result.correct) {
      let msg = `Correct! +${result.pointsEarned} pts`;
      if (result.pointsEarned >= 45) msg += ' ⚡ Speed + Streak!';
      else if (result.pointsEarned >= 35) msg += ' ⚡ Speed bonus!';
      else if (result.pointsEarned > 20) msg += ' Streak bonus!';
      if (result.newDragon) msg += ' 🐉 New dragon!';
      setFeedback({ text: msg, color: 'text-green-400' });

      if (result.newDragon) {
        const dragonIdx = store.dragonsUnlocked - 1;
        if (dragonIdx >= 0) {
          // Play full hatch animation, then auto-return to egg
          sceneRef.current?.playHatch(dragonIdx, () => {
            // onComplete fires after dance + breath — show egg for next dragon
            setFeedback(null);
            sceneRef.current?.showEgg();
            sceneRef.current?.updateEggProgress(0);
            setIsAnimating(false);
          });
        }
      } else {
        sceneRef.current?.updateEggProgress(newProgress);
        setTimeout(() => {
          setFeedback(null);
          setIsAnimating(false);
        }, 1200);
      }
    } else {
      setFeedback({ text: `Wrong! Answer was ${store.currentProblem!.answer}`, color: 'text-red-400' });
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      sceneRef.current?.updateEggProgress(0);
      setTimeout(() => {
        setFeedback(null);
        sceneRef.current?.showEgg();
        setIsAnimating(false);
      }, 2000);
    }
  }, [isAnimating, store, answerInput, clearTimer, previewIdx]);

  const handleDragonClick = useCallback((idx: number) => {
    if (isAnimating) return;
    // Only allow previewing unlocked dragons
    if (idx >= store.dragonsUnlocked) return;
    clearTimer();
    setPreviewIdx(idx);
    sceneRef.current?.previewDragon(idx);
  }, [isAnimating, store.dragonsUnlocked, clearTimer]);

  const handleClosePreview = useCallback(() => {
    setPreviewIdx(null);
    // Return to egg
    sceneRef.current?.showEgg();
    sceneRef.current?.updateEggProgress(store.hatchProgress as 0 | 1 | 2);
  }, [store.hatchProgress]);

  const handleHint = () => {
    const hint = store.useHint();
    if (hint) setHintText(hint);
  };

  const streakFire = store.currentStreak >= 3 ? '🔥' : '';
  const streakDisplay = store.currentStreak >= 3 ? `${streakFire}×${store.currentStreak}` : `×${store.currentStreak}`;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="flex gap-6 w-full max-w-4xl">
        {/* LEFT: Phaser canvas */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <HatcheryGame ref={sceneRef} />
          <div className="flex items-center gap-2 h-6">
            {previewIdx !== null ? (
              <>
                <span className="text-yellow-300 text-sm font-bold">{DRAGON_NAMES[previewIdx]}</span>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-500 hover:text-white text-xs border border-gray-700 rounded px-2 py-0.5 transition-colors"
                >
                  ← Back
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-sm font-medium">
                {store.dragonsUnlocked > 0
                  ? DRAGON_NAMES[store.dragonsUnlocked - 1]
                  : 'Waiting to hatch...'}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Info + puzzle panel */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {/* Player info */}
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-lg">{store.playerName}</span>
            <span className="bg-blue-800 text-blue-200 text-xs font-bold px-2 py-1 rounded-full">Grade {store.grade}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-800 capitalize ${DIFFICULTY_COLORS[store.difficulty]}`}>
              {store.difficulty}
            </span>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex gap-6">
            <div>
              <div className="text-gray-400 text-xs">Score</div>
              <div className="text-yellow-400 font-bold text-xl">{store.score}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Streak</div>
              <div className="text-orange-400 font-bold text-xl">{streakDisplay}</div>
            </div>
          </div>

          {/* Dragons progress */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm font-medium">Dragons</span>
              <span className="text-green-400 font-bold">{store.dragonsUnlocked}/20</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(store.dragonsUnlocked / 20) * 100}%` }}
              />
            </div>

            {/* Hatch progress dots */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-xs">Hatch:</span>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                    i < store.hatchProgress
                      ? 'bg-orange-500 border-orange-400'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                />
              ))}
              <span className="text-gray-500 text-xs">{store.hatchProgress}/3</span>
            </div>

            {/* Dragon collection grid — 5 columns for 20 dragons */}
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 20 }, (_, i) => {
                const unlocked = i < store.dragonsUnlocked;
                const info = DRAGON_UI_INFO[i];
                const isPreviewing = previewIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleDragonClick(i)}
                    disabled={!unlocked || isAnimating}
                    title={unlocked ? `${DRAGON_NAMES[i]} — click to preview` : `Dragon ${i + 1} (locked)`}
                    className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all relative overflow-hidden ${
                      unlocked
                        ? `border-2 cursor-pointer hover:scale-110 active:scale-95 ${isPreviewing ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`
                        : 'bg-gray-800 border border-gray-700 opacity-40 cursor-not-allowed'
                    }`}
                    style={unlocked ? {
                      backgroundColor: info.color,
                      borderColor: info.accentColor,
                    } : undefined}
                  >
                    {unlocked ? (
                      <span className="text-lg">{info.hasCrown ? '👑' : info.hasArmor ? '⚔️' : '🐉'}</span>
                    ) : (
                      <span>🥚</span>
                    )}
                    {unlocked && (
                      <span className="text-white text-opacity-80 font-bold" style={{ fontSize: '9px' }}>
                        {DRAGON_NAMES[i].split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {previewIdx !== null && (
              <p className="text-gray-500 text-xs mt-2 text-center">
                Previewing {DRAGON_NAMES[previewIdx]} — <button onClick={handleClosePreview} className="text-green-400 hover:text-green-300 underline">back to game</button>
              </p>
            )}
          </div>

          {/* Problem display — hidden while previewing */}
          {previewIdx === null && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className={`text-right text-sm font-bold mb-2 ${
                timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-gray-400'
              }`}>
                ⏱ {timeLeft}s
              </div>
              <div className="text-center mb-4">
                <div className="text-gray-400 text-xs mb-1">Solve:</div>
                <div className="text-white text-3xl font-bold font-mono">
                  {store.currentProblem?.expression ?? '...'} = ?
                </div>
              </div>

              <div className={`flex gap-2 mb-3 ${shakeInput ? 'animate-bounce' : ''}`}>
                <input
                  ref={inputRef}
                  type="number"
                  value={answerInput}
                  onChange={e => setAnswerInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  disabled={isAnimating}
                  placeholder="Your answer"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-lg font-mono focus:outline-none focus:border-green-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isAnimating || !answerInput}
                  className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded-lg transition-colors"
                >
                  Go!
                </button>
              </div>

              {!store.hintUsed && !hintText && (
                <button
                  onClick={handleHint}
                  disabled={isAnimating}
                  className="text-gray-500 hover:text-yellow-400 text-xs transition-colors disabled:opacity-40"
                >
                  Hint (-8 pts)
                </button>
              )}

              {hintText && (
                <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-2 text-yellow-300 text-sm">
                  {hintText}
                </div>
              )}

              {feedback && (
                <div className={`mt-3 text-sm font-semibold ${feedback.color}`}>
                  {feedback.text}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
