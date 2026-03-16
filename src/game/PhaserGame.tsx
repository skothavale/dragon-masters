import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Phaser from 'phaser';
import { DragonScene } from './scenes/DragonScene';
import type { RoomType } from '../types';

export interface PhaserGameRef {
  playFireBreath(): void;
  setRoomBackground(roomType: RoomType): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const PhaserGame = forwardRef<PhaserGameRef, {}>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<DragonScene | null>(null);

  useImperativeHandle(ref, () => ({
    playFireBreath: () => sceneRef.current?.playFireBreath(),
    setRoomBackground: (t) => sceneRef.current?.setRoomBackground(t),
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 320,
      height: 320,
      backgroundColor: '#1a1a2e',
      scene: [DragonScene],
      scale: {
        mode: Phaser.Scale.FIT,
      },
    });
    game.events.on('ready', () => {
      sceneRef.current = game.scene.getScene('DragonScene') as DragonScene;
    });
    gameRef.current = game;
    return () => {
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-80 h-80" />;
});

PhaserGame.displayName = 'PhaserGame';
export default PhaserGame;
