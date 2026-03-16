import Phaser from 'phaser';
import type { RoomType } from '../../types';

// Dragon color palette
const D = {
  body:     0x1e5226,
  shade:    0x133318,
  belly:    0x607840,
  bellyHi:  0x85a854,
  wing:     0x0d2010,
  wingLine: 0x1a3a1e,
  spike:    0x0a1a0d,
  mouth:    0x7a1515,
  tongue:   0xe02020,
  eyeIris:  0xf0c000,
  eyePupil: 0x080000,
  eyeGlow:  0xff7700,
  claw:     0xcfbe70,
};

export class DragonScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Rectangle;
  private dragonContainer!: Phaser.GameObjects.Container;
  private backWing!: Phaser.GameObjects.Graphics;
  private frontWing!: Phaser.GameObjects.Graphics;
  private eyeGlowGfx!: Phaser.GameObjects.Graphics;
  private idleTween!: Phaser.Tweens.Tween;

  constructor() { super({ key: 'DragonScene' }); }

  create() {
    this.bg = this.add.rectangle(0, 0, 320, 320, 0x0a0f0b).setOrigin(0);

    // Atmospheric stone floor
    const floor = this.add.graphics();
    floor.fillStyle(0x111411, 1);
    floor.fillRect(0, 268, 320, 52);
    floor.fillStyle(0x0d100d, 1);
    floor.fillRect(0, 264, 320, 6);

    // Dragon container (bobs during idle)
    this.dragonContainer = this.add.container(130, 183);
    this.buildDragon();
    this.setupAnimations();
  }

  private buildDragon() {
    const d = this.dragonContainer;

    // ── BACK WING ──────────────────────────────────────────────
    this.backWing = this.add.graphics();
    this.backWing.fillStyle(D.wing, 1);
    this.backWing.fillPoints([
      { x: -8, y: -14 }, { x: -30, y: -88 }, { x: -62, y: -80 },
      { x: -80, y: -44 }, { x: -70, y: -6 }, { x: -48, y: 4 },
    ], true);
    // Wing finger bones
    this.backWing.lineStyle(1.5, D.wingLine, 0.65);
    this.backWing.lineBetween(-8, -14, -30, -88);
    this.backWing.lineBetween(-8, -14, -54, -82);
    this.backWing.lineBetween(-8, -14, -74, -54);
    d.add(this.backWing);

    // ── TAIL ───────────────────────────────────────────────────
    const tail = this.add.graphics();
    tail.fillStyle(D.shade, 1);
    tail.fillPoints([
      { x: -48, y: 4 }, { x: -66, y: -4 }, { x: -92, y: 18 },
      { x: -90, y: 30 }, { x: -76, y: 34 }, { x: -60, y: 22 }, { x: -44, y: 12 },
    ], true);
    // Tail spike
    tail.fillStyle(D.spike, 1);
    tail.fillTriangle(-87, 18, -100, 26, -87, 32);
    d.add(tail);

    // ── BODY ───────────────────────────────────────────────────
    const body = this.add.graphics();
    body.fillStyle(D.body, 1);
    body.fillEllipse(0, 8, 108, 54);
    // Top shading
    body.fillStyle(D.shade, 0.38);
    body.fillEllipse(-4, 0, 96, 28);
    d.add(body);

    // ── BELLY ──────────────────────────────────────────────────
    const belly = this.add.graphics();
    belly.fillStyle(D.belly, 1);
    belly.fillEllipse(4, 20, 84, 30);
    belly.fillStyle(D.bellyHi, 0.42);
    belly.fillEllipse(4, 18, 62, 17);
    d.add(belly);

    // ── LEGS & CLAWS ───────────────────────────────────────────
    const legs = this.add.graphics();
    // Front leg
    legs.fillStyle(D.body, 1);
    legs.fillRect(18, 30, 11, 20);
    legs.fillStyle(D.claw, 1);
    legs.fillTriangle(16, 49, 20, 44, 20, 54);
    legs.fillTriangle(23, 49, 27, 44, 27, 54);
    legs.fillTriangle(30, 48, 34, 43, 34, 53);
    // Back leg (slightly behind)
    legs.fillStyle(D.shade, 1);
    legs.fillRect(-18, 32, 10, 18);
    legs.fillStyle(D.claw, 0.7);
    legs.fillTriangle(-20, 49, -16, 44, -16, 54);
    legs.fillTriangle(-13, 49, -9, 44, -9, 54);
    d.add(legs);

    // ── DORSAL SPIKES ──────────────────────────────────────────
    const spikes = this.add.graphics();
    spikes.fillStyle(D.spike, 1);
    for (const [sx, sy, sh] of [
      [-32, -22, 14], [-18, -26, 18], [-4, -28, 20],
      [10, -27, 18], [24, -24, 16], [38, -20, 12],
    ]) {
      spikes.fillTriangle(sx - 4, sy, sx, sy - sh, sx + 4, sy);
    }
    d.add(spikes);

    // ── NECK ───────────────────────────────────────────────────
    const neck = this.add.graphics();
    neck.fillStyle(D.body, 1);
    neck.fillPoints([
      { x: 38, y: -5 }, { x: 54, y: -18 }, { x: 70, y: -20 },
      { x: 74, y: -8 }, { x: 64, y: 6 }, { x: 46, y: 8 },
    ], true);
    d.add(neck);

    // ── HEAD ───────────────────────────────────────────────────
    const head = this.add.graphics();
    // Skull
    head.fillStyle(D.body, 1);
    head.fillPoints([
      { x: 50, y: -22 }, { x: 74, y: -28 }, { x: 96, y: -20 },
      { x: 104, y: -8 }, { x: 97, y: 4 }, { x: 66, y: 6 }, { x: 50, y: 0 },
    ], true);
    // Upper snout
    head.fillStyle(D.body, 1);
    head.fillPoints([
      { x: 94, y: -8 }, { x: 115, y: -6 }, { x: 122, y: 0 },
      { x: 116, y: 5 }, { x: 94, y: 5 },
    ], true);
    // Lower jaw
    head.fillStyle(D.shade, 1);
    head.fillPoints([
      { x: 78, y: 6 }, { x: 116, y: 6 }, { x: 122, y: 9 },
      { x: 116, y: 17 }, { x: 88, y: 17 }, { x: 72, y: 11 },
    ], true);
    // Mouth interior
    head.fillStyle(D.mouth, 1);
    head.fillPoints([
      { x: 83, y: 5 }, { x: 115, y: 5 }, { x: 117, y: 7 },
      { x: 115, y: 11 }, { x: 83, y: 11 }, { x: 81, y: 8 },
    ], true);
    // Forked tongue
    head.fillStyle(D.tongue, 1);
    head.fillPoints([
      { x: 100, y: 7 }, { x: 118, y: 9 }, { x: 126, y: 10 },
      { x: 122, y: 14 }, { x: 117, y: 11 }, { x: 113, y: 14 },
      { x: 108, y: 11 }, { x: 98, y: 10 },
    ], true);
    // Horns
    head.fillStyle(D.spike, 1);
    head.fillTriangle(60, -26, 56, -52, 74, -24);
    head.fillTriangle(80, -28, 76, -54, 93, -25);
    // Brow ridge (fierce overhang)
    head.fillStyle(D.shade, 1);
    head.fillEllipse(84, -17, 28, 8);
    // Nostril
    head.fillStyle(0x080808, 0.85);
    head.fillCircle(112, -4, 4);
    head.fillStyle(0x000000, 1);
    head.fillCircle(113, -3, 2);
    d.add(head);

    // ── FRONT WING (overlaps head/neck) ────────────────────────
    this.frontWing = this.add.graphics();
    this.frontWing.fillStyle(D.wing, 0.84);
    this.frontWing.fillPoints([
      { x: 10, y: -14 }, { x: -10, y: -84 }, { x: -40, y: -72 },
      { x: -46, y: -36 }, { x: -28, y: -4 },
    ], true);
    this.frontWing.lineStyle(1.5, D.wingLine, 0.5);
    this.frontWing.lineBetween(10, -14, -10, -84);
    this.frontWing.lineBetween(10, -14, -33, -72);
    this.frontWing.lineBetween(10, -14, -43, -44);
    d.add(this.frontWing);

    // ── EYE GLOW ───────────────────────────────────────────────
    this.eyeGlowGfx = this.add.graphics();
    this.eyeGlowGfx.fillStyle(D.eyeGlow, 0.55);
    this.eyeGlowGfx.fillCircle(76, -16, 14);
    d.add(this.eyeGlowGfx);

    // ── EYE ────────────────────────────────────────────────────
    const eye = this.add.graphics();
    eye.fillStyle(D.eyeIris, 1);
    eye.fillCircle(76, -16, 7);
    eye.fillStyle(D.eyePupil, 1);
    eye.fillEllipse(76, -16, 4, 11);  // vertical slit pupil
    eye.fillStyle(0xffffff, 0.9);
    eye.fillCircle(73, -19, 2.5);     // eye shine
    d.add(eye);
  }

  private setupAnimations() {
    // Gentle idle bob
    this.idleTween = this.tweens.add({
      targets: this.dragonContainer,
      y: 176,
      duration: 2400,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Back wing slow flap
    this.tweens.add({
      targets: this.backWing,
      scaleY: 0.78,
      duration: 2100,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Front wing offset flap
    this.tweens.add({
      targets: this.frontWing,
      scaleY: 0.75,
      duration: 2100,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 400,
    });

    // Eye glow pulse — menacing
    this.tweens.add({
      targets: this.eyeGlowGfx,
      alpha: 0.15,
      duration: 1600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  playFireBreath() {
    this.idleTween.pause();

    const ox = this.dragonContainer.x + 122;
    const oy = this.dragonContainer.y + 8;

    // Layered fire cone: white core → yellow → orange → red outer
    const layers: { color: number; w: number; h: number; a: number }[] = [
      { color: 0xffffff, w: 55, h: 10, a: 0.95 },
      { color: 0xffee00, w: 62, h: 18, a: 0.88 },
      { color: 0xff8800, w: 68, h: 26, a: 0.80 },
      { color: 0xff4000, w: 72, h: 34, a: 0.68 },
      { color: 0xcc1000, w: 75, h: 40, a: 0.52 },
    ];

    const flames = layers.map(({ color, w, h, a }) => {
      const f = this.add.graphics();
      f.fillStyle(color, a);
      // Tapered cone shape wider at front
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
      f.x = ox;
      f.y = oy;
      f.scaleX = 0;
      f.alpha = 0;
      return f;
    });

    // Flying sparks / embers
    for (let i = 0; i < 12; i++) {
      const spark = this.add.graphics();
      const sc = [0xffffff, 0xffee00, 0xff8800][Math.floor(Math.random() * 3)];
      spark.fillStyle(sc, 1);
      spark.fillCircle(0, 0, 1.5 + Math.random() * 3.5);
      spark.x = ox + 10 + Math.random() * 55;
      spark.y = oy + (Math.random() - 0.5) * 14;
      this.tweens.add({
        targets: spark,
        x: spark.x + 35 + Math.random() * 55,
        y: spark.y + (Math.random() - 0.5) * 50,
        alpha: 0,
        scaleX: 0.2, scaleY: 0.2,
        duration: 450 + Math.random() * 350,
        ease: 'Power1',
        onComplete: () => spark.destroy(),
      });
    }

    // Expand flames
    this.tweens.add({
      targets: flames,
      scaleX: 1,
      alpha: 1,
      duration: 160,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Hold then collapse
        this.time.delayedCall(380, () => {
          this.tweens.add({
            targets: flames,
            scaleX: 0.2,
            alpha: 0,
            duration: 220,
            ease: 'Power2.easeIn',
            onComplete: () => {
              flames.forEach(f => f.destroy());
              this.idleTween.resume();
            },
          });
        });
      },
    });

    // Dragon recoil jolt
    this.tweens.add({
      targets: this.dragonContainer,
      x: this.dragonContainer.x - 9,
      duration: 70,
      yoyo: true,
      repeat: 1,
    });
  }

  setRoomBackground(roomType: RoomType) {
    const colors: Partial<Record<RoomType, number>> = {
      ENTRANCE:        0x081008,
      FLOOR:           0x0a0f0b,
      DOOR:            0x110800,
      TREASURE:        0x081100,
      CHARM_FIRE:      0x120400,
      CHARM_ICE:       0x00080f,
      CHARM_LIGHTNING: 0x080810,
      FINAL_VAULT:     0x0f0d00,
    };
    this.bg.setFillStyle(colors[roomType] ?? 0x0a0f0b);
  }
}
