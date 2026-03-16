import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Phaser from 'phaser';
import { HatcheryScene } from './scenes/HatcheryScene';
import type { HatcherySceneRef } from './scenes/HatcheryScene';

export type { HatcherySceneRef };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const HatcheryGame = forwardRef<HatcherySceneRef, {}>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HatcheryScene | null>(null);

  useImperativeHandle(ref, () => ({
    playHatch: (idx, onComplete) => sceneRef.current?.playHatch(idx, onComplete),
    showEgg: () => sceneRef.current?.showEgg(),
    setDragon: (idx) => sceneRef.current?.setDragon(idx),
    updateEggProgress: (level: 0 | 1 | 2) => sceneRef.current?.updateEggProgress(level),
    previewDragon: (idx) => sceneRef.current?.previewDragon(idx),
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 400,
      height: 400,
      backgroundColor: '#0a0d0f',
      scene: [HatcheryScene],
      scale: { mode: Phaser.Scale.FIT },
    });
    game.events.on('ready', () => {
      sceneRef.current = game.scene.getScene('HatcheryScene') as HatcheryScene;
    });
    gameRef.current = game;
    return () => {
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-[400px] h-[400px]" />;
});

HatcheryGame.displayName = 'HatcheryGame';
export default HatcheryGame;
