import Phaser from 'phaser';

export interface HatcherySceneRef {
  playHatch(dragonIndex: number, onComplete?: () => void): void;
  showEgg(): void;
  setDragon(dragonIndex: number): void;
  updateEggProgress(level: 0 | 1 | 2): void;
  previewDragon(dragonIndex: number): void;
}

interface DragonVisualConfig {
  bodyColor: number;
  bellyColor: number;
  wingColor: number;
  eyeColor: number;
  accentColor: number;
  fireColor: number;
  sizeScale: number;
  hasArmor: boolean;
  hasCrown: boolean;
  wingSize: number;
  hornStyle: 'tall' | 'curved' | 'wide' | 'triple';
  tailType: 'spike' | 'club' | 'arrow' | 'whip';
  dorsalStyle: 'spikes' | 'fins' | 'plates' | 'double';
  hasWattle: boolean;
  bodyType: 'classic' | 'wyvern' | 'brute' | 'serpentine';
  breathType: 'fire' | 'ice' | 'lightning' | 'poison' | 'void' | 'plasma';
  bodyWidthMult: number;
  bodyHeightMult: number;
  neckLength: number;
  headSize: number;
  legLength: number;
  tailLength: number;
  jawOpenness: number;
  hasTeeth: boolean;
  hasFrills: boolean;
  hasScales: boolean;
  scarCount: number;
}

const DRAGON_CONFIGS: DragonVisualConfig[] = [
  // 1: Ember — tiny green classic
  { bodyColor: 0x4a9e5c, bellyColor: 0x8fd4a0, wingColor: 0x2d6e3a, eyeColor: 0xf0c000, accentColor: 0x1a3d22, fireColor: 0xff8800, sizeScale: 0.45, hasArmor: false, hasCrown: false, wingSize: 0.7,  hornStyle: 'tall',   tailType: 'spike', dorsalStyle: 'spikes',  hasWattle: false, bodyType: 'classic',    breathType: 'fire',      bodyWidthMult: 1.0, bodyHeightMult: 1.0, neckLength: 1.0, headSize: 1.0, legLength: 1.0, tailLength: 1.0, jawOpenness: 0.7, hasTeeth: false, hasFrills: false, hasScales: false, scarCount: 0 },
  // 2: Sparky — electric yellow serpentine
  { bodyColor: 0xd4c020, bellyColor: 0xf5e87a, wingColor: 0x9e8e08, eyeColor: 0x00ffff, accentColor: 0x7a6e04, fireColor: 0xffff00, sizeScale: 0.52, hasArmor: false, hasCrown: false, wingSize: 1.1,  hornStyle: 'curved', tailType: 'whip',  dorsalStyle: 'fins',   hasWattle: false, bodyType: 'serpentine', breathType: 'lightning', bodyWidthMult: 0.7, bodyHeightMult: 0.75, neckLength: 1.4, headSize: 0.9, legLength: 0.8, tailLength: 1.6, jawOpenness: 0.9, hasTeeth: false, hasFrills: false, hasScales: false, scarCount: 0 },
  // 3: Blaze — orange classic curved horns
  { bodyColor: 0xd4781e, bellyColor: 0xf0b06a, wingColor: 0x9e4e08, eyeColor: 0xff4400, accentColor: 0x5e2a04, fireColor: 0xff6600, sizeScale: 0.58, hasArmor: false, hasCrown: false, wingSize: 0.85, hornStyle: 'curved', tailType: 'club',  dorsalStyle: 'fins',   hasWattle: false, bodyType: 'classic',    breathType: 'fire',      bodyWidthMult: 1.0, bodyHeightMult: 1.0, neckLength: 1.0, headSize: 1.0, legLength: 1.0, tailLength: 1.0, jawOpenness: 0.8, hasTeeth: false, hasFrills: false, hasScales: false, scarCount: 0 },
  // 4: Sunny — squat orange brute
  { bodyColor: 0xe08c28, bellyColor: 0xf5c47a, wingColor: 0xb05e12, eyeColor: 0xff2200, accentColor: 0x6e3208, fireColor: 0xff4400, sizeScale: 0.63, hasArmor: false, hasCrown: false, wingSize: 0.8,  hornStyle: 'wide',   tailType: 'arrow', dorsalStyle: 'plates', hasWattle: false, bodyType: 'brute',      breathType: 'fire',      bodyWidthMult: 1.4, bodyHeightMult: 1.2, neckLength: 0.8, headSize: 1.3, legLength: 0.8, tailLength: 0.8, jawOpenness: 1.2, hasTeeth: false, hasFrills: false, hasScales: false, scarCount: 0 },
  // 5: Cinder — rust red, wattle, double dorsal
  { bodyColor: 0xcc5522, bellyColor: 0xee9966, wingColor: 0x882200, eyeColor: 0xffee00, accentColor: 0x441100, fireColor: 0xff3300, sizeScale: 0.68, hasArmor: false, hasCrown: false, wingSize: 0.9,  hornStyle: 'triple', tailType: 'spike', dorsalStyle: 'double', hasWattle: true,  bodyType: 'classic',    breathType: 'fire',      bodyWidthMult: 1.0, bodyHeightMult: 1.0, neckLength: 1.1, headSize: 1.0, legLength: 1.0, tailLength: 1.1, jawOpenness: 1.0, hasTeeth: false, hasFrills: false, hasScales: false, scarCount: 1 },
  // 6: Crimson — wyvern, no front arms
  { bodyColor: 0xaa2222, bellyColor: 0xdd7766, wingColor: 0x661111, eyeColor: 0xff8800, accentColor: 0x330800, fireColor: 0xff2200, sizeScale: 0.75, hasArmor: false, hasCrown: false, wingSize: 1.1,  hornStyle: 'triple', tailType: 'whip',  dorsalStyle: 'spikes', hasWattle: false, bodyType: 'wyvern',     breathType: 'fire',      bodyWidthMult: 1.1, bodyHeightMult: 0.9, neckLength: 0.9, headSize: 1.1, legLength: 1.0, tailLength: 1.2, jawOpenness: 1.1, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 1 },
  // 7: Scarlet — serpentine poison, frills
  { bodyColor: 0xcc2244, bellyColor: 0x88cc44, wingColor: 0x881122, eyeColor: 0xffaa00, accentColor: 0x440011, fireColor: 0x88ff00, sizeScale: 0.80, hasArmor: false, hasCrown: false, wingSize: 1.0,  hornStyle: 'tall',   tailType: 'club',  dorsalStyle: 'fins',   hasWattle: false, bodyType: 'serpentine', breathType: 'poison',    bodyWidthMult: 0.7, bodyHeightMult: 0.75, neckLength: 1.3, headSize: 0.9, legLength: 0.8, tailLength: 1.5, jawOpenness: 0.9, hasTeeth: false, hasFrills: true,  hasScales: false, scarCount: 0 },
  // 8: Fury — dark red brute, armor, huge jaw
  { bodyColor: 0x881122, bellyColor: 0xbb4455, wingColor: 0x440011, eyeColor: 0xff6600, accentColor: 0x220011, fireColor: 0xff0044, sizeScale: 0.85, hasArmor: true,  hasCrown: false, wingSize: 0.9,  hornStyle: 'wide',   tailType: 'arrow', dorsalStyle: 'plates', hasWattle: false, bodyType: 'brute',      breathType: 'fire',      bodyWidthMult: 1.4, bodyHeightMult: 1.2, neckLength: 0.8, headSize: 1.3, legLength: 0.8, tailLength: 0.8, jawOpenness: 1.5, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 3 },
  // 9: Ember Rose — magenta plasma, scales, triple horns
  { bodyColor: 0xcc2288, bellyColor: 0xee88cc, wingColor: 0x880044, eyeColor: 0xff88ff, accentColor: 0x440022, fireColor: 0xff44ff, sizeScale: 0.90, hasArmor: false, hasCrown: false, wingSize: 1.1,  hornStyle: 'triple', tailType: 'spike', dorsalStyle: 'double', hasWattle: true,  bodyType: 'classic',    breathType: 'plasma',    bodyWidthMult: 1.0, bodyHeightMult: 1.0, neckLength: 1.1, headSize: 1.1, legLength: 1.0, tailLength: 1.1, jawOpenness: 0.9, hasTeeth: false, hasFrills: false, hasScales: true,  scarCount: 0 },
  // 10: Magma — deep purple wyvern, wide wings
  { bodyColor: 0x661166, bellyColor: 0x993377, wingColor: 0x220033, eyeColor: 0xff44aa, accentColor: 0x440044, fireColor: 0xff00aa, sizeScale: 0.95, hasArmor: false, hasCrown: false, wingSize: 1.3,  hornStyle: 'curved', tailType: 'whip',  dorsalStyle: 'fins',   hasWattle: false, bodyType: 'wyvern',     breathType: 'fire',      bodyWidthMult: 1.1, bodyHeightMult: 0.9, neckLength: 0.9, headSize: 1.1, legLength: 1.0, tailLength: 1.3, jawOpenness: 1.0, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 1 },
  // 11: Frost — icy blue classic, armor, fan horns
  { bodyColor: 0x3377bb, bellyColor: 0x99ccee, wingColor: 0x1a4477, eyeColor: 0x00ffff, accentColor: 0x112244, fireColor: 0x44ccff, sizeScale: 1.00, hasArmor: true,  hasCrown: false, wingSize: 1.1,  hornStyle: 'wide',   tailType: 'club',  dorsalStyle: 'plates', hasWattle: false, bodyType: 'classic',    breathType: 'ice',       bodyWidthMult: 1.1, bodyHeightMult: 1.0, neckLength: 1.0, headSize: 1.1, legLength: 1.1, tailLength: 1.1, jawOpenness: 0.9, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 1 },
  // 12: Steel — navy brute, armor, lightning
  { bodyColor: 0x223355, bellyColor: 0x445577, wingColor: 0x0d1a33, eyeColor: 0xffcc00, accentColor: 0x0d1a33, fireColor: 0xffff00, sizeScale: 1.06, hasArmor: true,  hasCrown: false, wingSize: 0.9,  hornStyle: 'wide',   tailType: 'arrow', dorsalStyle: 'plates', hasWattle: false, bodyType: 'brute',      breathType: 'lightning', bodyWidthMult: 1.4, bodyHeightMult: 1.2, neckLength: 0.8, headSize: 1.3, legLength: 0.8, tailLength: 0.8, jawOpenness: 1.3, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 2 },
  // 13: Shadow — steel-grey serpentine, void breath, scales+frills
  { bodyColor: 0x445566, bellyColor: 0x667788, wingColor: 0x1a2233, eyeColor: 0x8822ee, accentColor: 0x1a2233, fireColor: 0x8822ee, sizeScale: 1.12, hasArmor: false, hasCrown: false, wingSize: 1.0,  hornStyle: 'curved', tailType: 'whip',  dorsalStyle: 'fins',   hasWattle: false, bodyType: 'serpentine', breathType: 'void',      bodyWidthMult: 0.7, bodyHeightMult: 0.75, neckLength: 1.3, headSize: 1.0, legLength: 0.8, tailLength: 1.6, jawOpenness: 1.0, hasTeeth: false, hasFrills: true,  hasScales: true,  scarCount: 1 },
  // 14: Smoke — dark steel wyvern, ice, huge wings, armor
  { bodyColor: 0x334455, bellyColor: 0x556677, wingColor: 0x111a22, eyeColor: 0x44ccff, accentColor: 0x111a22, fireColor: 0x44ccff, sizeScale: 1.18, hasArmor: true,  hasCrown: false, wingSize: 1.4,  hornStyle: 'triple', tailType: 'spike', dorsalStyle: 'spikes', hasWattle: false, bodyType: 'wyvern',     breathType: 'ice',       bodyWidthMult: 1.1, bodyHeightMult: 0.9, neckLength: 0.9, headSize: 1.2, legLength: 1.0, tailLength: 1.4, jawOpenness: 1.1, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 2 },
  // 15: Void — near-black classic, armor, triple horns, void breath
  { bodyColor: 0x1a1a2e, bellyColor: 0x3a2a4a, wingColor: 0x0a0a18, eyeColor: 0xaa44ff, accentColor: 0x0d0d1a, fireColor: 0xaa44ff, sizeScale: 1.25, hasArmor: true,  hasCrown: false, wingSize: 1.1,  hornStyle: 'triple', tailType: 'club',  dorsalStyle: 'double', hasWattle: false, bodyType: 'classic',    breathType: 'void',      bodyWidthMult: 1.1, bodyHeightMult: 1.0, neckLength: 1.1, headSize: 1.2, legLength: 1.1, tailLength: 1.2, jawOpenness: 1.2, hasTeeth: true,  hasFrills: false, hasScales: true,  scarCount: 2 },
  // 16: Aurum — gold brute, armor+crown, massive, plasma
  { bodyColor: 0xcc9900, bellyColor: 0xffdd66, wingColor: 0x886600, eyeColor: 0xff4400, accentColor: 0x554400, fireColor: 0xff88ff, sizeScale: 1.32, hasArmor: true,  hasCrown: true,  wingSize: 1.0,  hornStyle: 'wide',   tailType: 'arrow', dorsalStyle: 'plates', hasWattle: false, bodyType: 'brute',      breathType: 'plasma',    bodyWidthMult: 1.4, bodyHeightMult: 1.2, neckLength: 0.8, headSize: 1.3, legLength: 0.8, tailLength: 0.9, jawOpenness: 1.4, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 1 },
  // 17: Lava King — wyvern, fire, crown, max wings, huge
  { bodyColor: 0xff4400, bellyColor: 0xff8844, wingColor: 0xaa1100, eyeColor: 0xffff00, accentColor: 0x881100, fireColor: 0xff3300, sizeScale: 1.40, hasArmor: false, hasCrown: true,  wingSize: 1.5,  hornStyle: 'triple', tailType: 'whip',  dorsalStyle: 'fins',   hasWattle: true,  bodyType: 'wyvern',     breathType: 'fire',      bodyWidthMult: 1.2, bodyHeightMult: 1.0, neckLength: 0.9, headSize: 1.2, legLength: 1.1, tailLength: 1.5, jawOpenness: 1.3, hasTeeth: true,  hasFrills: false, hasScales: false, scarCount: 2 },
  // 18: Obsidian — pure black serpentine, void, crown, scales
  { bodyColor: 0x111111, bellyColor: 0x2a2a2a, wingColor: 0x050505, eyeColor: 0x8800ff, accentColor: 0x050505, fireColor: 0x8800ff, sizeScale: 1.50, hasArmor: false, hasCrown: true,  wingSize: 1.1,  hornStyle: 'curved', tailType: 'spike', dorsalStyle: 'fins',   hasWattle: false, bodyType: 'serpentine', breathType: 'void',      bodyWidthMult: 0.7, bodyHeightMult: 0.75, neckLength: 1.4, headSize: 1.1, legLength: 0.8, tailLength: 1.6, jawOpenness: 1.1, hasTeeth: false, hasFrills: false, hasScales: true,  scarCount: 3 },
  // 19: Nebula — violet classic, plasma, crown, frills+teeth
  { bodyColor: 0x7722aa, bellyColor: 0xbb66dd, wingColor: 0x441177, eyeColor: 0xffaaff, accentColor: 0x330f66, fireColor: 0xff44ff, sizeScale: 1.65, hasArmor: false, hasCrown: true,  wingSize: 1.2,  hornStyle: 'triple', tailType: 'club',  dorsalStyle: 'double', hasWattle: false, bodyType: 'classic',    breathType: 'plasma',    bodyWidthMult: 1.1, bodyHeightMult: 1.0, neckLength: 1.2, headSize: 1.2, legLength: 1.1, tailLength: 1.3, jawOpenness: 1.1, hasTeeth: true,  hasFrills: true,  hasScales: false, scarCount: 1 },
  // 20: Ancient — ancient gold brute, lightning, crown, all features, biggest
  { bodyColor: 0xc8a000, bellyColor: 0xffe066, wingColor: 0x886600, eyeColor: 0xff8800, accentColor: 0x664400, fireColor: 0xffff00, sizeScale: 1.90, hasArmor: true,  hasCrown: true,  wingSize: 1.2,  hornStyle: 'triple', tailType: 'arrow', dorsalStyle: 'double', hasWattle: true,  bodyType: 'brute',      breathType: 'lightning', bodyWidthMult: 1.4, bodyHeightMult: 1.2, neckLength: 0.8, headSize: 1.3, legLength: 0.9, tailLength: 0.9, jawOpenness: 1.5, hasTeeth: true,  hasFrills: false, hasScales: true,  scarCount: 3 },
];

// Lightweight summary for UI use (no Phaser dependency)
export const DRAGON_UI_INFO = DRAGON_CONFIGS.map(cfg => ({
  color: '#' + cfg.bodyColor.toString(16).padStart(6, '0'),
  accentColor: '#' + cfg.accentColor.toString(16).padStart(6, '0'),
  hasArmor: cfg.hasArmor,
  hasCrown: cfg.hasCrown,
}));

export class HatcheryScene extends Phaser.Scene {
  private dragonContainer!: Phaser.GameObjects.Container;
  private eggContainer!: Phaser.GameObjects.Container;
  private eggGfx: Phaser.GameObjects.Graphics | null = null;
  private idleTween?: Phaser.Tweens.Tween;
  private currentBreathType: DragonVisualConfig['breathType'] = 'fire';
  private currentSizeScale: number = 1.0;
  // Incremented on every reset — stale tween/timer callbacks compare against this
  private _token = 0;

  constructor() { super({ key: 'HatcheryScene' }); }

  create() {
    this.add.rectangle(0, 0, 400, 400, 0x0a0d0f).setOrigin(0);

    // Floor
    const floor = this.add.graphics();
    floor.fillStyle(0x111411, 1);
    floor.fillRect(0, 335, 400, 65);
    floor.fillStyle(0x0d100d, 1);
    floor.fillRect(0, 330, 400, 6);

    this.eggContainer = this.add.container(200, 200);
    this.dragonContainer = this.add.container(160, 220);
    this.dragonContainer.setVisible(false);

    this.drawEgg(0);
    this.startEggBob();
  }

  private drawEgg(crackLevel: 0 | 1 | 2 | 3 = 0) {
    // Only destroy if Phaser hasn't already cleaned it up (e.g. via removeAll(true))
    if (this.eggGfx?.active) {
      this.eggGfx.destroy();
    }
    this.eggGfx = null;
    this.eggGfx = this.add.graphics();

    // Inner glow for level 2+
    if (crackLevel >= 2) {
      this.eggGfx.fillStyle(0xff8800, 0.18);
      this.eggGfx.fillEllipse(0, 0, 100, 120);
    }

    // Shadow
    this.eggGfx.fillStyle(0x000000, 0.3);
    this.eggGfx.fillEllipse(0, 72, 90, 18);

    // Egg body
    this.eggGfx.fillStyle(0xf0ece4, 1);
    this.eggGfx.fillEllipse(0, 0, 90, 110);

    // Shine highlight
    this.eggGfx.fillStyle(0xffffff, 0.7);
    this.eggGfx.fillEllipse(-18, -22, 20, 32);
    this.eggGfx.fillStyle(0xffffff, 0.3);
    this.eggGfx.fillEllipse(-10, -14, 34, 50);

    if (crackLevel === 1) {
      // 2 hairline cracks
      this.eggGfx.lineStyle(1, 0x888880, 0.7);
      this.eggGfx.lineBetween(-4, -18, 6, 2);
      this.eggGfx.lineStyle(1, 0x888880, 0.6);
      this.eggGfx.lineBetween(14, -10, 8, 12);
    } else if (crackLevel >= 2) {
      // 5 larger cracks
      this.eggGfx.lineStyle(2, 0x888880, 0.9);
      this.eggGfx.lineBetween(-5, -20, 10, 5);
      this.eggGfx.lineBetween(10, 5, -8, 25);
      this.eggGfx.lineBetween(-8, 25, 12, 40);
      this.eggGfx.lineStyle(1.5, 0x888880, 0.7);
      this.eggGfx.lineBetween(10, 5, 28, -10);
      this.eggGfx.lineBetween(-5, -20, -20, -35);
    }

    this.eggContainer.add(this.eggGfx);
  }

  updateEggProgress(level: 0 | 1 | 2) {
    // Redraw egg with crack level without resetting the bob animation
    this.eggContainer.removeAll(true);
    this.drawEgg(level);
  }

  private startEggBob() {
    this.idleTween = this.tweens.add({
      targets: this.eggContainer,
      y: 195,
      duration: 1800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  showEgg() {
    this._token++; // invalidate any in-flight tween/timer callbacks
    this.tweens.killTweensOf(this.eggContainer);
    this.tweens.killTweensOf(this.dragonContainer);
    if (this.idleTween) { this.idleTween.destroy(); this.idleTween = undefined; }
    this.eggGfx = null;
    this.dragonContainer.setVisible(false);
    this.dragonContainer.removeAll(true);
    this.eggContainer.setVisible(true);
    this.eggContainer.setAlpha(1);
    this.eggContainer.setScale(1);
    this.eggContainer.setPosition(200, 200);
    this.eggContainer.removeAll(true);
    this.drawEgg(0);
    this.startEggBob();
  }

  playHatch(dragonIndex: number, onComplete?: () => void) {
    this._token++;
    const token = this._token;
    if (this.idleTween) { this.idleTween.destroy(); this.idleTween = undefined; }
    this.tweens.killTweensOf(this.eggContainer);

    // Phase 1: jiggle egg
    this.eggGfx = null;
    this.eggContainer.removeAll(true);
    this.drawEgg(0);

    this.tweens.add({
      targets: this.eggContainer,
      x: { from: 194, to: 206 },
      duration: 60,
      ease: 'Linear',
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        if (this._token !== token) return;
        // Phase 2: show cracks
        this.eggGfx = null;
        this.eggContainer.removeAll(true);
        this.drawEgg(3);

        this.tweens.add({
          targets: this.eggContainer,
          x: { from: 192, to: 208 },
          duration: 50,
          ease: 'Linear',
          yoyo: true,
          repeat: 12,
          onComplete: () => {
            if (this._token !== token) return;
            // Phase 3: explode
            this.tweens.add({
              targets: this.eggContainer,
              scaleX: 1.5,
              scaleY: 1.5,
              alpha: 0,
              duration: 200,
              ease: 'Power2.easeOut',
              onComplete: () => {
                if (this._token !== token) return;
                this.eggContainer.setVisible(false);
                this.spawnParticles();
                // Phase 4: reveal dragon
                this.time.delayedCall(150, () => {
                  if (this._token !== token) return;
                  this.showDragonAnimated(dragonIndex, onComplete);
                });
              },
            });
          },
        });
      },
    });
  }

  private spawnParticles() {
    for (let i = 0; i < 10; i++) {
      const p = this.add.graphics();
      p.fillStyle(0xf0ece4, 1);
      p.fillRect(-4, -4, 8, 8);
      p.x = 200;
      p.y = 200;
      const angle = (Math.PI * 2 * i) / 10;
      const dist = 60 + Math.random() * 60;
      this.tweens.add({
        targets: p,
        x: p.x + Math.cos(angle) * dist,
        y: p.y + Math.sin(angle) * dist,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 400 + Math.random() * 200,
        ease: 'Power2.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  private showDragonAnimated(dragonIndex: number, onComplete?: () => void) {
    const token = this._token;
    const cfg = DRAGON_CONFIGS[dragonIndex] ?? DRAGON_CONFIGS[0];
    this.currentBreathType = cfg.breathType;
    this.currentSizeScale = cfg.sizeScale;
    this.dragonContainer.removeAll(true);
    this.buildDragon(cfg);
    this.dragonContainer.setVisible(true);
    this.dragonContainer.setAlpha(0);
    this.dragonContainer.setScale(0.5);

    this.tweens.add({
      targets: this.dragonContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (this._token !== token) {
          onComplete?.();
          return;
        }
        this.startIdleBob();
        this.playDance(onComplete);
      },
    });
  }

  setDragon(dragonIndex: number) {
    const cfg = DRAGON_CONFIGS[dragonIndex] ?? DRAGON_CONFIGS[0];
    this.currentBreathType = cfg.breathType;
    this.currentSizeScale = cfg.sizeScale;
    this.eggContainer.setVisible(false);
    this.dragonContainer.removeAll(true);
    this.buildDragon(cfg);
    this.dragonContainer.setVisible(true);
    this.dragonContainer.setAlpha(1);
    this.dragonContainer.setScale(1);
    this.startIdleBob();
  }

  previewDragon(dragonIndex: number) {
    const cfg = DRAGON_CONFIGS[dragonIndex] ?? DRAGON_CONFIGS[0];
    this.currentBreathType = cfg.breathType;
    this.currentSizeScale = cfg.sizeScale;
    this.eggContainer.setVisible(false);
    this.dragonContainer.removeAll(true);
    this.buildDragon(cfg);
    this.dragonContainer.setVisible(true);
    this.dragonContainer.setAlpha(1);
    this.dragonContainer.setScale(1);
    this.startIdleBob();
    // Play dance after a short delay
    this.time.delayedCall(400, () => this.playDance());
  }

  private startIdleBob() {
    if (this.idleTween) this.idleTween.destroy();
    this.idleTween = this.tweens.add({
      targets: this.dragonContainer,
      y: 215,
      duration: 2200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  playDance(onComplete?: () => void) {
    const token = this._token;
    if (this.idleTween) this.idleTween.pause();

    this.tweens.add({
      targets: this.dragonContainer,
      scaleX: 1.2,
      duration: 120,
      ease: 'Sine.easeOut',
      yoyo: true,
      repeat: 1,
    });

    this.tweens.add({
      targets: this.dragonContainer,
      y: this.dragonContainer.y - 30,
      duration: 200,
      ease: 'Power2.easeOut',
      yoyo: true,
      onComplete: () => {
        // Scene was reset mid-dance — still call onComplete to unblock React state
        if (this._token !== token) {
          onComplete?.();
          return;
        }
        if (this.idleTween) this.idleTween.resume();
        this.time.delayedCall(200, () => {
          if (this._token !== token) {
            onComplete?.();
            return;
          }
          this.playFireBreath();
          // Always fire onComplete after breath so React never stays frozen
          this.time.delayedCall(1200, () => onComplete?.());
        });
      },
    });
  }

  playFireBreath() {
    if (!this.dragonContainer.visible) return;
    const token = this._token;
    const s = this.currentSizeScale;
    const ox = this.dragonContainer.x + Math.round(110 * Math.max(0.6, s));
    const oy = this.dragonContainer.y + 5;
    const bt = this.currentBreathType;

    // Cone layers keyed by breath type
    type Layer = { color: number; w: number; h: number; a: number };
    const layerSets: Record<string, Layer[]> = {
      fire: [
        { color: 0xffffff, w: 55, h: 10, a: 0.95 },
        { color: 0xffee00, w: 62, h: 18, a: 0.88 },
        { color: 0xff8800, w: 68, h: 26, a: 0.80 },
        { color: 0xff4000, w: 72, h: 34, a: 0.68 },
        { color: 0xcc1000, w: 75, h: 40, a: 0.52 },
      ],
      ice: [
        { color: 0xffffff, w: 55, h: 10, a: 0.95 },
        { color: 0xaaeeff, w: 62, h: 18, a: 0.88 },
        { color: 0x44ccff, w: 68, h: 26, a: 0.80 },
        { color: 0x0088cc, w: 72, h: 34, a: 0.68 },
        { color: 0x0044aa, w: 75, h: 40, a: 0.52 },
      ],
      lightning: [
        { color: 0xffffff, w: 55, h: 8,  a: 0.98 },
        { color: 0xffffaa, w: 60, h: 14, a: 0.90 },
        { color: 0xddee00, w: 65, h: 20, a: 0.82 },
        { color: 0xaa44ff, w: 68, h: 28, a: 0.68 },
        { color: 0x6600cc, w: 70, h: 36, a: 0.50 },
      ],
      poison: [
        { color: 0xeeff44, w: 55, h: 12, a: 0.92 },
        { color: 0x88dd00, w: 62, h: 22, a: 0.84 },
        { color: 0x44aa00, w: 68, h: 30, a: 0.76 },
        { color: 0x226600, w: 72, h: 36, a: 0.62 },
        { color: 0x443300, w: 75, h: 42, a: 0.48 },
      ],
      void: [
        { color: 0xffffff, w: 55, h: 10, a: 0.90 },
        { color: 0xcc88ff, w: 60, h: 18, a: 0.82 },
        { color: 0x8822ee, w: 65, h: 26, a: 0.70 },
        { color: 0x440088, w: 70, h: 34, a: 0.56 },
        { color: 0x110022, w: 74, h: 42, a: 0.40 },
      ],
      plasma: [
        { color: 0xffffff, w: 55, h: 10, a: 0.95 },
        { color: 0xff88ff, w: 62, h: 18, a: 0.88 },
        { color: 0xff00cc, w: 68, h: 26, a: 0.80 },
        { color: 0x0088ff, w: 72, h: 34, a: 0.68 },
        { color: 0x0044cc, w: 75, h: 40, a: 0.52 },
      ],
    };

    const layers = layerSets[bt] ?? layerSets['fire'];
    const flames = layers.map(({ color, w, h, a }) => {
      const f = this.add.graphics();
      f.fillStyle(color, a);
      if (bt === 'lightning') {
        // Jagged zigzag cone
        f.fillPoints([
          { x: 0, y: -h * 0.3 },
          { x: w * 0.2, y: -h * 0.5 },
          { x: w * 0.4, y: -h * 0.2 },
          { x: w * 0.6, y: -h * 0.45 },
          { x: w * 0.8, y: -h * 0.15 },
          { x: w + 12, y: 0 },
          { x: w * 0.8, y: h * 0.15 },
          { x: w * 0.6, y: h * 0.45 },
          { x: w * 0.4, y: h * 0.2 },
          { x: w * 0.2, y: h * 0.5 },
          { x: 0, y: h * 0.3 },
        ], true);
      } else {
        f.fillPoints([
          { x: 0, y: -h * 0.28 },
          { x: w * 0.35, y: -h * 0.44 },
          { x: w * 0.75, y: -h * 0.3 },
          { x: w + 10, y: -h * 0.08 },
          { x: w + 14, y: 0 },
          { x: w + 10, y: h * 0.08 },
          { x: w * 0.75, y: h * 0.3 },
          { x: w * 0.35, y: h * 0.44 },
          { x: 0, y: h * 0.28 },
        ], true);
      }
      f.x = ox;
      f.y = oy;
      f.scaleX = 0;
      f.alpha = 0;
      return f;
    });

    // Particle colors per type
    const particleColors: Record<string, number[]> = {
      fire:      [0xffffff, 0xffee00, 0xff8800],
      ice:       [0xffffff, 0xaaeeff, 0x44ccff],
      lightning: [0xffffff, 0xffffaa, 0xaa44ff],
      poison:    [0xeeff44, 0x88dd00, 0x44aa00],
      void:      [0xffffff, 0xcc88ff, 0x8822ee],
      plasma:    [0xffffff, 0xff88ff, 0x0088ff],
    };
    const pColors = particleColors[bt] ?? particleColors['fire'];

    for (let i = 0; i < 12; i++) {
      const spark = this.add.graphics();
      const sc = pColors[Math.floor(Math.random() * pColors.length)];
      spark.fillStyle(sc, 1);

      if (bt === 'ice') {
        // Snowflake-like hexagon
        const r = 3 + Math.random() * 3;
        for (let j = 0; j < 6; j++) {
          const a = (Math.PI / 3) * j;
          spark.fillRect(Math.cos(a) * r - 1, Math.sin(a) * r - 1, 2, 2);
        }
      } else if (bt === 'poison') {
        // Dripping blob
        spark.fillCircle(0, 0, 2 + Math.random() * 3);
      } else {
        spark.fillCircle(0, 0, 1.5 + Math.random() * 3);
      }

      spark.x = ox + 10 + Math.random() * 55;
      spark.y = oy + (Math.random() - 0.5) * 14;

      const gravityY = bt === 'poison' ? 30 + Math.random() * 40 : (Math.random() - 0.5) * 50;
      const spiralX = bt === 'void' ? -(20 + Math.random() * 30) : (30 + Math.random() * 55);

      this.tweens.add({
        targets: spark,
        x: spark.x + spiralX,
        y: spark.y + gravityY,
        alpha: 0,
        scaleX: 0.2, scaleY: 0.2,
        duration: 400 + Math.random() * 350,
        ease: bt === 'void' ? 'Power2.easeIn' : 'Power1',
        onComplete: () => spark.destroy(),
      });
    }

    this.tweens.add({
      targets: flames,
      scaleX: 1,
      alpha: 1,
      duration: bt === 'lightning' ? 80 : 160,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(bt === 'lightning' ? 180 : 350, () => {
          this.tweens.add({
            targets: flames,
            scaleX: 0.2,
            alpha: 0,
            duration: 200,
            ease: 'Power2.easeIn',
            onComplete: () => {
              flames.forEach(f => { if (f.active) f.destroy(); });
              // Lightning flashes twice — only if scene hasn't reset
              if (bt === 'lightning') {
                this.time.delayedCall(120, () => {
                  if (this._token === token) this.playFireBreath();
                });
              }
            },
          });
        });
      },
    });

    this.tweens.add({
      targets: this.dragonContainer,
      x: this.dragonContainer.x - 8,
      duration: 65,
      yoyo: true,
      repeat: 1,
    });
  }

  private buildDragon(cfg: DragonVisualConfig) {
    const d = this.dragonContainer;
    const s = cfg.sizeScale;
    const ws = cfg.wingSize;
    const bwm = cfg.bodyWidthMult;
    const bhm = cfg.bodyHeightMult;
    const nl = cfg.neckLength;
    const hs = cfg.headSize;
    const ll = cfg.legLength;
    const tl = cfg.tailLength;
    const jo = cfg.jawOpenness;

    // Helper: slightly lighter color for highlight
    const lighten = (c: number, f: number) => {
      const r = Math.min(255, ((c >> 16) & 0xff) + Math.round(f * 200));
      const g = Math.min(255, ((c >> 8)  & 0xff) + Math.round(f * 200));
      const b = Math.min(255, ( c        & 0xff) + Math.round(f * 200));
      return (r << 16) | (g << 8) | b;
    };

    // --- BACK WING ---
    const backWing = this.add.graphics();
    backWing.fillStyle(cfg.wingColor, 1);
    const bwx = -8 * ws, bwy = -14 * s;
    const bwPoints = [
      { x: bwx, y: bwy },
      { x: -30 * ws, y: -90 * s * ws },
      { x: -50 * ws, y: -98 * s * ws },
      { x: -66 * ws, y: -84 * s * ws },
      { x: -82 * ws, y: -46 * s * ws },
      { x: -72 * ws, y: -6 * s },
      { x: -50 * ws, y: 5 * s },
    ];
    backWing.fillPoints(bwPoints, true);
    // 5 bone lines
    backWing.lineStyle(1.5, cfg.accentColor, 0.65);
    backWing.lineBetween(bwx, bwy, -30 * ws, -90 * s * ws);
    backWing.lineBetween(bwx, bwy, -46 * ws, -96 * s * ws);
    backWing.lineBetween(bwx, bwy, -60 * ws, -88 * s * ws);
    backWing.lineBetween(bwx, bwy, -75 * ws, -60 * s * ws);
    backWing.lineBetween(bwx, bwy, -78 * ws, -30 * s * ws);
    d.add(backWing);

    // --- TAIL ---
    const tail = this.add.graphics();
    tail.fillStyle(cfg.bodyColor, 0.75);
    const txBase = -48 * s * tl;
    tail.fillPoints([
      { x: -44 * s, y: 4 * s },
      { x: txBase, y: -4 * s },
      { x: txBase - 20 * s, y: 14 * s },
      { x: txBase - 18 * s, y: 26 * s },
      { x: txBase - 4 * s,  y: 32 * s },
      { x: -40 * s, y: 14 * s },
    ], true);

    if (cfg.tailType === 'spike') {
      tail.fillStyle(cfg.accentColor, 1);
      tail.fillTriangle(
        (txBase - 18) * s, 16 * s,
        (txBase - 30) * s, 24 * s,
        (txBase - 16) * s, 32 * s,
      );
    } else if (cfg.tailType === 'club') {
      tail.fillStyle(cfg.accentColor, 0.9);
      tail.fillCircle((txBase - 24) * s, 22 * s, 11 * s);
      tail.fillStyle(cfg.bellyColor, 0.6);
      tail.fillCircle((txBase - 24) * s, 22 * s, 7 * s);
    } else if (cfg.tailType === 'arrow') {
      tail.fillStyle(cfg.accentColor, 1);
      tail.fillPoints([
        { x: (txBase - 16) * s, y: 16 * s },
        { x: (txBase - 34) * s, y: 22 * s },
        { x: (txBase - 16) * s, y: 30 * s },
        { x: (txBase - 2) * s,  y: 22 * s },
      ], true);
    } else if (cfg.tailType === 'whip') {
      tail.fillStyle(cfg.bodyColor, 0.5);
      tail.fillPoints([
        { x: (txBase - 16) * s, y: 18 * s },
        { x: (txBase - 32) * s, y: 14 * s },
        { x: (txBase - 50) * s, y: 17 * s },
        { x: (txBase - 54) * s, y: 22 * s },
        { x: (txBase - 50) * s, y: 28 * s },
        { x: (txBase - 30) * s, y: 26 * s },
      ], true);
      tail.fillStyle(cfg.accentColor, 0.9);
      tail.fillCircle((txBase - 54) * s, 22 * s, 4 * s);
    }
    d.add(tail);

    // --- BODY ---
    const bodyW = 112 * s * bwm;
    const bodyH = 56 * s * bhm;
    const body = this.add.graphics();
    body.fillStyle(cfg.bodyColor, 1);
    body.fillEllipse(0, 8 * s, bodyW, bodyH);
    // Shadow pass — lower half darker
    body.fillStyle(cfg.bodyColor & 0xaaaaaa, 0.35);
    body.fillEllipse(0, 16 * s, bodyW, bodyH * 0.55);
    // Highlight pass — upper-left lighter
    body.fillStyle(lighten(cfg.bodyColor, 0.18), 0.22);
    body.fillEllipse(-10 * s, 0 * s, bodyW * 0.55, bodyH * 0.45);
    d.add(body);

    // Scale dots overlay
    if (cfg.hasScales) {
      const scales = this.add.graphics();
      const scaleColor = lighten(cfg.bodyColor, 0.12);
      scales.fillStyle(scaleColor, 0.55);
      for (let sx = -42; sx <= 42; sx += 10) {
        for (let sy = -16; sy <= 22; sy += 9) {
          const ox2 = (sy % 18 === 0) ? 5 : 0;
          scales.fillCircle((sx + ox2) * s, (sy + 8) * s, 2.5 * s);
        }
      }
      d.add(scales);
    }

    // --- BELLY ---
    const belly = this.add.graphics();
    belly.fillStyle(cfg.bellyColor, 1);
    belly.fillEllipse(4 * s, 20 * s, bodyW * 0.76, bodyH * 0.54);
    d.add(belly);

    // --- ARMOR PLATES ---
    if (cfg.hasArmor) {
      const armor = this.add.graphics();
      armor.fillStyle(cfg.accentColor, 0.72);
      armor.fillPoints([{ x: -26 * s, y: -6 * s }, { x: -18 * s, y: -18 * s }, { x: -6 * s, y: -6 * s }, { x: -12 * s, y: 8 * s }], true);
      armor.fillPoints([{ x: -4 * s, y: -8 * s }, { x: 6 * s, y: -22 * s }, { x: 18 * s, y: -8 * s }, { x: 12 * s, y: 8 * s }], true);
      armor.fillPoints([{ x: 20 * s, y: -6 * s }, { x: 28 * s, y: -18 * s }, { x: 38 * s, y: -5 * s }, { x: 32 * s, y: 8 * s }], true);
      d.add(armor);
    }

    // --- LEGS (body type adjusts length) ---
    const legH = 22 * s * ll;
    const legW = 11 * s;
    const legs = this.add.graphics();

    // Wyvern: no front legs (wings ARE arms), only rear legs
    const hasRearLegs = true;
    const hasFrontLegs = cfg.bodyType !== 'wyvern';

    if (hasRearLegs) {
      legs.fillStyle(cfg.bodyColor, 1);
      legs.fillRect(18 * s, 28 * s, legW, legH);
      // Curved talon claws (4-point polygon per claw)
      legs.fillStyle(cfg.accentColor, 0.9);
      for (const cx of [16, 23, 30]) {
        legs.fillPoints([
          { x: cx * s, y: (28 + legH / s) * s },
          { x: (cx - 2) * s, y: (28 + legH / s + 9) * s },
          { x: cx * s, y: (28 + legH / s + 12) * s },
          { x: (cx + 3) * s, y: (28 + legH / s + 6) * s },
        ], true);
        // Claw highlight
        legs.lineStyle(0.8, lighten(cfg.accentColor, 0.3), 0.7);
        legs.lineBetween(cx * s, (28 + legH / s) * s, (cx + 1) * s, (28 + legH / s + 8) * s);
      }
    }

    if (hasFrontLegs) {
      legs.fillStyle(cfg.bodyColor, 0.75);
      legs.fillRect(-20 * s, 30 * s, legW * 0.9, legH * 0.85);
      legs.fillStyle(cfg.accentColor, 0.7);
      for (const cx of [-22, -15]) {
        legs.fillPoints([
          { x: cx * s, y: (30 + legH * 0.85 / s) * s },
          { x: (cx - 2) * s, y: (30 + legH * 0.85 / s + 8) * s },
          { x: cx * s, y: (30 + legH * 0.85 / s + 11) * s },
          { x: (cx + 3) * s, y: (30 + legH * 0.85 / s + 5) * s },
        ], true);
      }
    }
    d.add(legs);

    // --- DORSAL ---
    const dorsal = this.add.graphics();
    dorsal.fillStyle(cfg.accentColor, 1);

    if (cfg.dorsalStyle === 'spikes') {
      for (const [sx, sy, sh] of [
        [-32, -22, 14], [-18, -26, 18], [-4, -28, 20],
        [10, -27, 18], [24, -24, 16], [38, -20, 12],
      ]) {
        dorsal.fillTriangle((sx - 4) * s, sy * s, sx * s, (sy - sh) * s, (sx + 4) * s, sy * s);
      }
    } else if (cfg.dorsalStyle === 'fins') {
      dorsal.fillPoints([
        { x: -32 * s, y: -20 * s }, { x: -20 * s, y: -50 * s },
        { x: -4 * s,  y: -64 * s }, { x: 12 * s,  y: -56 * s },
        { x: 28 * s,  y: -44 * s }, { x: 38 * s,  y: -20 * s },
        { x: 26 * s,  y: -22 * s }, { x: 12 * s,  y: -36 * s },
        { x: -2 * s,  y: -44 * s }, { x: -18 * s, y: -36 * s }, { x: -28 * s, y: -22 * s },
      ], true);
      dorsal.lineStyle(1, cfg.wingColor, 0.55);
      dorsal.lineBetween(-4 * s, -26 * s, -4 * s, -64 * s);
      dorsal.lineBetween(-4 * s, -26 * s, 12 * s, -56 * s);
      dorsal.lineBetween(-4 * s, -26 * s, -18 * s, -50 * s);
      dorsal.lineBetween(-4 * s, -26 * s, 26 * s, -44 * s);
    } else if (cfg.dorsalStyle === 'plates') {
      for (const [sx, sw, sy, sh] of [
        [-28, 12, -22, 20], [-8, 14, -26, 24], [12, 14, -25, 22], [30, 12, -22, 18],
      ]) {
        dorsal.fillPoints([
          { x: sx * s,            y: sy * s },
          { x: (sx + sw) * s,     y: (sy - sh) * s },
          { x: (sx + sw * 2) * s, y: sy * s },
          { x: (sx + sw) * s,     y: (sy + 5) * s },
        ], true);
      }
    } else if (cfg.dorsalStyle === 'double') {
      for (const [sx, sy, sh] of [
        [-30, -24, 13], [-10, -26, 15], [10, -25, 14], [28, -23, 11],
      ]) {
        dorsal.fillTriangle((sx - 3) * s, sy * s, sx * s, (sy - sh) * s, (sx + 3) * s, sy * s);
      }
      dorsal.fillStyle(cfg.bellyColor, 0.75);
      for (const [sx, sy, sh] of [
        [-20, -20, 10], [0, -22, 12], [18, -20, 10], [36, -18, 8],
      ]) {
        dorsal.fillTriangle((sx - 3) * s, sy * s, sx * s, (sy - sh) * s, (sx + 3) * s, sy * s);
      }
    }
    d.add(dorsal);

    // --- NECK ---
    const neckReach = nl * hs;
    const neck = this.add.graphics();
    neck.fillStyle(cfg.bodyColor, 1);
    neck.fillPoints([
      { x: 36 * s, y: -4 * s },
      { x: (50 * neckReach) * s, y: (-20 * nl) * s },
      { x: (68 * neckReach) * s, y: (-22 * nl) * s },
      { x: (74 * neckReach) * s, y: (-8 * nl) * s },
      { x: (64 * neckReach) * s, y: (6 * nl) * s },
      { x: 44 * s, y: 8 * s },
    ], true);
    // Neck shadow
    neck.fillStyle(cfg.bodyColor & 0x999999, 0.25);
    neck.fillPoints([
      { x: 36 * s, y: 2 * s },
      { x: (50 * neckReach) * s, y: (-12 * nl) * s },
      { x: (68 * neckReach) * s, y: (-14 * nl) * s },
      { x: (74 * neckReach) * s, y: (-4 * nl) * s },
      { x: 44 * s, y: 8 * s },
    ], true);
    d.add(neck);

    // --- NECK FRILLS ---
    if (cfg.hasFrills) {
      const frills = this.add.graphics();
      frills.fillStyle(cfg.bellyColor, 0.72);
      // Left frill fan
      frills.fillPoints([
        { x: (54 * neckReach) * s, y: (-18 * nl) * s },
        { x: (44 * neckReach) * s, y: (-32 * nl) * s },
        { x: (52 * neckReach) * s, y: (-42 * nl) * s },
        { x: (62 * neckReach) * s, y: (-36 * nl) * s },
        { x: (64 * neckReach) * s, y: (-24 * nl) * s },
      ], true);
      // Right frill fan
      frills.fillPoints([
        { x: (68 * neckReach) * s, y: (-20 * nl) * s },
        { x: (74 * neckReach) * s, y: (-34 * nl) * s },
        { x: (82 * neckReach) * s, y: (-40 * nl) * s },
        { x: (84 * neckReach) * s, y: (-26 * nl) * s },
        { x: (76 * neckReach) * s, y: (-18 * nl) * s },
      ], true);
      frills.lineStyle(1, cfg.accentColor, 0.5);
      frills.lineBetween((54 * neckReach) * s, (-18 * nl) * s, (52 * neckReach) * s, (-42 * nl) * s);
      frills.lineBetween((54 * neckReach) * s, (-18 * nl) * s, (62 * neckReach) * s, (-36 * nl) * s);
      frills.lineBetween((68 * neckReach) * s, (-20 * nl) * s, (82 * neckReach) * s, (-40 * nl) * s);
      d.add(frills);
    }

    // --- HEAD (fiercer) ---
    // Neck-reach offset for head position
    const hx = (neckReach - 1) * 28 * s;
    const head = this.add.graphics();

    // Skull — angular with brow ridge
    head.fillStyle(cfg.bodyColor, 1);
    head.fillPoints([
      { x: 50 * s + hx, y: -24 * hs * s },
      { x: 74 * s + hx, y: -32 * hs * s },
      { x: 98 * s + hx, y: -22 * hs * s },
      { x: 106 * s + hx, y: -8 * hs * s },
      { x: 98 * s + hx, y: 2 * hs * s },
      { x: 66 * s + hx, y: 5 * hs * s },
      { x: 50 * s + hx, y: -2 * s },
    ], true);

    // Brow ridge — dark angular overhang
    head.fillStyle(cfg.bodyColor & 0x888888, 0.9);
    head.fillPoints([
      { x: 54 * s + hx, y: -24 * hs * s },
      { x: 78 * s + hx, y: -32 * hs * s },
      { x: 100 * s + hx, y: -26 * hs * s },
      { x: 96 * s + hx, y: -18 * hs * s },
      { x: 70 * s + hx, y: -26 * hs * s },
      { x: 54 * s + hx, y: -20 * hs * s },
    ], true);

    // Upper jaw
    head.fillStyle(cfg.bodyColor, 1);
    head.fillPoints([
      { x: 96 * s + hx, y: -10 * hs * s },
      { x: 118 * s + hx, y: -7 * s },
      { x: 124 * s + hx, y: 0 },
      { x: 118 * s + hx, y: 4 * s },
      { x: 96 * s + hx, y: 4 * s },
    ], true);

    // Lower jaw (separate, jawOpenness controls drop)
    head.fillStyle(cfg.bodyColor, 0.85);
    head.fillPoints([
      { x: 80 * s + hx, y: 5 * s },
      { x: 118 * s + hx, y: 5 * s },
      { x: 124 * s + hx, y: (8 * jo) * s },
      { x: 118 * s + hx, y: (14 * jo) * s },
      { x: 88 * s + hx, y: (16 * jo) * s },
      { x: 74 * s + hx, y: (10 * jo) * s },
    ], true);

    // Mouth interior
    head.fillStyle(0x6a0e0e, 1);
    head.fillPoints([
      { x: 84 * s + hx, y: 5 * s },
      { x: 116 * s + hx, y: 5 * s },
      { x: 120 * s + hx, y: (6 * jo) * s },
      { x: 116 * s + hx, y: (10 * jo) * s },
      { x: 86 * s + hx, y: (11 * jo) * s },
      { x: 82 * s + hx, y: (7 * jo) * s },
    ], true);

    // Teeth
    if (cfg.hasTeeth) {
      head.fillStyle(0xeeeecc, 1);
      // Upper row — pointing down
      for (const tx of [88, 96, 104, 112]) {
        head.fillTriangle(
          (tx - 2) * s + hx, 5 * s,
          tx * s + hx, (5 + 5 * jo) * s,
          (tx + 2) * s + hx, 5 * s,
        );
      }
      // Lower row — pointing up
      for (const tx of [90, 98, 106]) {
        head.fillTriangle(
          (tx - 2) * s + hx, (11 * jo) * s,
          tx * s + hx, (4) * s,
          (tx + 2) * s + hx, (11 * jo) * s,
        );
      }
      // Fangs — two big lower canines
      head.fillStyle(0xfff8e0, 1);
      head.fillPoints([
        { x: 86 * s + hx, y: (11 * jo) * s },
        { x: 84 * s + hx, y: (2) * s },
        { x: 90 * s + hx, y: (11 * jo) * s },
      ], true);
      head.fillPoints([
        { x: 116 * s + hx, y: (10 * jo) * s },
        { x: 114 * s + hx, y: (2) * s },
        { x: 120 * s + hx, y: (10 * jo) * s },
      ], true);
    }

    // Tongue (forked)
    head.fillStyle(0xe02020, 1);
    head.fillPoints([
      { x: 102 * s + hx, y: (7 * jo) * s },
      { x: 120 * s + hx, y: (8 * jo) * s },
      { x: 128 * s + hx, y: (9 * jo) * s },
      { x: 124 * s + hx, y: (13 * jo) * s },
      { x: 118 * s + hx, y: (10 * jo) * s },
      { x: 114 * s + hx, y: (13 * jo) * s },
      { x: 109 * s + hx, y: (10 * jo) * s },
      { x: 100 * s + hx, y: (9 * jo) * s },
    ], true);

    // Horns
    head.fillStyle(cfg.accentColor, 1);
    if (cfg.hornStyle === 'tall') {
      head.fillTriangle(60 * s + hx, -26 * hs * s, 55 * s + hx, -56 * hs * s, 74 * s + hx, -24 * hs * s);
      head.fillTriangle(80 * s + hx, -28 * hs * s, 75 * s + hx, -58 * hs * s, 94 * s + hx, -26 * hs * s);
    } else if (cfg.hornStyle === 'curved') {
      head.fillPoints([
        { x: 60 * s + hx, y: -26 * hs * s }, { x: 52 * s + hx, y: -42 * hs * s },
        { x: 44 * s + hx, y: -54 * hs * s }, { x: 52 * s + hx, y: -56 * hs * s },
        { x: 64 * s + hx, y: -44 * hs * s }, { x: 74 * s + hx, y: -28 * hs * s },
      ], true);
      head.fillPoints([
        { x: 80 * s + hx, y: -28 * hs * s }, { x: 70 * s + hx, y: -46 * hs * s },
        { x: 64 * s + hx, y: -58 * hs * s }, { x: 72 * s + hx, y: -60 * hs * s },
        { x: 84 * s + hx, y: -46 * hs * s }, { x: 94 * s + hx, y: -28 * hs * s },
      ], true);
    } else if (cfg.hornStyle === 'wide') {
      head.fillPoints([
        { x: 60 * s + hx, y: -28 * hs * s }, { x: 44 * s + hx, y: -40 * hs * s },
        { x: 38 * s + hx, y: -48 * hs * s }, { x: 46 * s + hx, y: -46 * hs * s },
        { x: 62 * s + hx, y: -36 * hs * s }, { x: 72 * s + hx, y: -28 * hs * s },
      ], true);
      head.fillPoints([
        { x: 82 * s + hx, y: -28 * hs * s }, { x: 96 * s + hx, y: -40 * hs * s },
        { x: 106 * s + hx, y: -48 * hs * s }, { x: 102 * s + hx, y: -46 * hs * s },
        { x: 90 * s + hx, y: -36 * hs * s }, { x: 84 * s + hx, y: -28 * hs * s },
      ], true);
    } else if (cfg.hornStyle === 'triple') {
      head.fillTriangle(60 * s + hx, -26 * hs * s, 55 * s + hx, -52 * hs * s, 72 * s + hx, -24 * hs * s);
      head.fillTriangle(76 * s + hx, -28 * hs * s, 71 * s + hx, -60 * hs * s, 90 * s + hx, -26 * hs * s);
      head.fillTriangle(92 * s + hx, -24 * hs * s, 90 * s + hx, -44 * hs * s, 104 * s + hx, -22 * hs * s);
    }

    // Crown
    if (cfg.hasCrown) {
      head.fillStyle(0xffcc00, 1);
      head.fillRect((56 + hx / s) * s, -36 * hs * s, 34 * s, 9 * s);
      for (const cx of [56, 64, 72, 80]) {
        head.fillTriangle((cx + hx / s) * s, -36 * hs * s, (cx + 4 + hx / s) * s, -52 * hs * s, (cx + 8 + hx / s) * s, -36 * hs * s);
      }
      // Crown gems
      head.fillStyle(0xff4444, 1);
      head.fillCircle((64 + hx / s) * s, -40 * hs * s, 2.5 * s);
      head.fillStyle(0x44ff88, 1);
      head.fillCircle((76 + hx / s) * s, -40 * hs * s, 2.5 * s);
    }

    // Wattle
    if (cfg.hasWattle) {
      head.fillStyle(cfg.bellyColor, 0.80);
      head.fillPoints([
        { x: 76 * s + hx, y: 8 * s }, { x: 82 * s + hx, y: 18 * s },
        { x: 90 * s + hx, y: 24 * s }, { x: 100 * s + hx, y: 26 * s },
        { x: 108 * s + hx, y: 20 * s }, { x: 112 * s + hx, y: 12 * s },
        { x: 108 * s + hx, y: 7 * s }, { x: 90 * s + hx, y: 10 * s },
      ], true);
    }

    // Nostril slits (elongated)
    head.fillStyle(0x080808, 0.9);
    head.fillEllipse(113 * s + hx, -5 * s, 5 * s, 9 * s);
    head.fillEllipse(119 * s + hx, -4 * s, 4 * s, 7 * s);

    d.add(head);

    // --- FRONT WING (wyvern: larger and lower as arm replacement) ---
    const frontWing = this.add.graphics();
    const fwAlpha = cfg.bodyType === 'wyvern' ? 0.92 : 0.84;
    const fwScale = cfg.bodyType === 'wyvern' ? 1.2 : 1.0;
    frontWing.fillStyle(cfg.wingColor, fwAlpha);
    const fwPoints = [
      { x: 8 * ws * fwScale, y: -12 * s },
      { x: -12 * ws * fwScale, y: -88 * s * ws },
      { x: -32 * ws * fwScale, y: -100 * s * ws },
      { x: -50 * ws * fwScale, y: -76 * s * ws },
      { x: -54 * ws * fwScale, y: -40 * s * ws },
      { x: -36 * ws * fwScale, y: -6 * s },
    ];
    frontWing.fillPoints(fwPoints, true);
    // 5 finger bones
    frontWing.lineStyle(1.5, cfg.accentColor, 0.5);
    frontWing.lineBetween(8 * ws * fwScale, -12 * s, -12 * ws * fwScale, -88 * s * ws);
    frontWing.lineBetween(8 * ws * fwScale, -12 * s, -24 * ws * fwScale, -98 * s * ws);
    frontWing.lineBetween(8 * ws * fwScale, -12 * s, -40 * ws * fwScale, -80 * s * ws);
    frontWing.lineBetween(8 * ws * fwScale, -12 * s, -50 * ws * fwScale, -56 * s * ws);
    frontWing.lineBetween(8 * ws * fwScale, -12 * s, -52 * ws * fwScale, -28 * s * ws);
    d.add(frontWing);

    // --- EYE (dramatic) ---
    const eyeX = (76 + hx / s) * s;
    const eyeY = -18 * hs * s;
    const eyeR = 9 * s * hs;

    const eyeGlow = this.add.graphics();
    eyeGlow.fillStyle(cfg.eyeColor, 0.35);
    eyeGlow.fillCircle(eyeX, eyeY, eyeR * 2.2);
    d.add(eyeGlow);

    const eye = this.add.graphics();
    // Dark ring around eye socket
    eye.fillStyle(0x111111, 0.8);
    eye.fillCircle(eyeX, eyeY, eyeR * 1.3);
    // Iris
    eye.fillStyle(cfg.eyeColor, 1);
    eye.fillCircle(eyeX, eyeY, eyeR);
    // Vertical slit pupil
    eye.fillStyle(0x040404, 1);
    eye.fillEllipse(eyeX, eyeY, eyeR * 0.35, eyeR * 1.7);
    // Specular highlight
    eye.fillStyle(0xffffff, 0.9);
    eye.fillCircle(eyeX - eyeR * 0.35, eyeY - eyeR * 0.4, eyeR * 0.28);
    d.add(eye);

    // --- BATTLE SCARS ---
    if (cfg.scarCount > 0) {
      const scars = this.add.graphics();
      scars.lineStyle(1.5, cfg.bodyColor & 0x666666, 0.45);
      const scarPositions = [
        [[-8, -2], [4, 14]],
        [[16, -6], [28, 8]],
        [[-24, 4], [-14, 18]],
      ];
      for (let i = 0; i < Math.min(cfg.scarCount, 3); i++) {
        const [[x1, y1], [x2, y2]] = scarPositions[i];
        scars.lineBetween(x1 * s, y1 * s, x2 * s, y2 * s);
        scars.lineBetween((x1 + 3) * s, (y1 - 1) * s, (x2 + 3) * s, (y2 - 1) * s);
      }
      d.add(scars);
    }
  }
}
