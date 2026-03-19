import type { BattleDragon, DragonRarity, DragonShape, FireColor } from '../types';

const COLORS = [
  { name: 'Crimson',  bg: '#7f1d1d', border: '#dc2626' },
  { name: 'Azure',    bg: '#1e3a5f', border: '#3b82f6' },
  { name: 'Emerald',  bg: '#14532d', border: '#22c55e' },
  { name: 'Violet',   bg: '#4c1d95', border: '#8b5cf6' },
  { name: 'Amber',    bg: '#78350f', border: '#f59e0b' },
  { name: 'Sapphire', bg: '#0c4a6e', border: '#0ea5e9' },
  { name: 'Jade',     bg: '#064e3b', border: '#10b981' },
  { name: 'Obsidian', bg: '#27272a', border: '#a1a1aa' },
];

const FIRE_MAP: Record<FireColor, string> = {
  blazing: '🔥',
  icy:     '❄️',
  storm:   '⚡',
  toxic:   '☢️',
  holy:    '✨',
};

const SHAPES: DragonShape[] = ['serpentine', 'wyvern', 'drake'];
const FIRE_COLORS: FireColor[] = ['blazing', 'icy', 'storm', 'toxic', 'holy'];

const PREFIXES = ['Shadow', 'Storm', 'Frost', 'Ember', 'Stone', 'Blood', 'Sky', 'Thunder', 'Iron', 'Mystic', 'Crystal', 'Dark', 'Wild', 'Ancient', 'Void', 'Inferno', 'Glacial', 'Tempest', 'Crimson', 'Solar'];
const SUFFIXES = ['fang', 'claw', 'wing', 'scale', 'fire', 'breath', 'heart', 'fury', 'strike', 'blaze', 'crest', 'talon', 'storm', 'forge', 'veil'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDragon(id: string): BattleDragon {
  const roll = Math.random();
  let rarity: DragonRarity;
  let minStat: number, maxStat: number;

  if (roll < 0.6) {
    rarity = 'common'; minStat = 1; maxStat = 4;
  } else if (roll < 0.9) {
    rarity = 'uncommon'; minStat = 5; maxStat = 8;
  } else {
    rarity = 'rare'; minStat = 9; maxStat = 10;
  }

  const color = pick(COLORS);
  const shape = pick(SHAPES);
  const fireColor = pick(FIRE_COLORS);
  const name = pick(PREFIXES) + pick(SUFFIXES);

  return {
    id,
    name,
    shape,
    colorName: color.name,
    colorBg: color.bg,
    colorBorder: color.border,
    fireColor,
    fireEmoji: FIRE_MAP[fireColor],
    rarity,
    power: randInt(minStat, maxStat),
    health: randInt(minStat, maxStat),
  };
}

export function shapeEmoji(shape: DragonShape): string {
  if (shape === 'serpentine') return '🐉';
  if (shape === 'wyvern') return '🦎';
  return '🐲';
}

export function rarityStars(rarity: DragonRarity): string {
  if (rarity === 'common') return '⭐';
  if (rarity === 'uncommon') return '⭐⭐';
  return '⭐⭐⭐';
}
