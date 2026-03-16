import type { Room, RoomType, Direction, Difficulty } from '../types';

interface MazeConfig {
  rooms: number;
  doors: number;
  treasures: number;
  charms: number;
  cols: number;
}

const MAZE_CONFIGS: Record<Difficulty, MazeConfig> = {
  easy:   { rooms: 9,  doors: 3, treasures: 2, charms: 2, cols: 3 },
  medium: { rooms: 15, doors: 5, treasures: 4, charms: 3, cols: 5 },
  hard:   { rooms: 20, doors: 8, treasures: 4, charms: 4, cols: 5 },
};

const OPPOSITE: Record<Direction, Direction> = { N: 'S', S: 'N', E: 'W', W: 'E' };

function getDirection(fromX: number, fromY: number, toX: number, toY: number): Direction | null {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (dx === 1 && dy === 0) return 'E';
  if (dx === -1 && dy === 0) return 'W';
  if (dx === 0 && dy === 1) return 'S';
  if (dx === 0 && dy === -1) return 'N';
  return null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMaze(difficulty: Difficulty): Record<string, Room> {
  const cfg = MAZE_CONFIGS[difficulty];
  const cols = cfg.cols;

  // Create rooms with grid positions
  const rooms: Record<string, Room> = {};
  for (let i = 0; i < cfg.rooms; i++) {
    const gridX = i % cols;
    const gridY = Math.floor(i / cols);
    rooms[String(i)] = {
      id: String(i),
      type: 'FLOOR',
      connections: {},
      solved: false,
      visited: false,
      gridX,
      gridY,
    };
  }

  // Build spanning tree via random walk
  const visited = new Set<string>(['0']);
  const allIds = Object.keys(rooms);

  while (visited.size < cfg.rooms) {
    // Find frontier: unvisited rooms adjacent to visited rooms
    const frontier: Array<{ from: string; to: string; dir: Direction }> = [];
    for (const visitedId of visited) {
      const r = rooms[visitedId];
      for (const candidateId of allIds) {
        if (visited.has(candidateId)) continue;
        const c = rooms[candidateId];
        const dir = getDirection(r.gridX, r.gridY, c.gridX, c.gridY);
        if (dir) frontier.push({ from: visitedId, to: candidateId, dir });
      }
    }
    if (frontier.length === 0) break;
    const edge = frontier[Math.floor(Math.random() * frontier.length)];
    rooms[edge.from].connections[edge.dir] = edge.to;
    rooms[edge.to].connections[OPPOSITE[edge.dir]] = edge.from;
    visited.add(edge.to);
  }

  // Add 1-2 extra connections for branching
  const extraCount = difficulty === 'easy' ? 1 : 2;
  for (let e = 0; e < extraCount; e++) {
    const shuffledIds = shuffle(allIds);
    for (const id of shuffledIds) {
      const r = rooms[id];
      for (const candidate of shuffle(allIds)) {
        if (candidate === id) continue;
        const c = rooms[candidate];
        const dir = getDirection(r.gridX, r.gridY, c.gridX, c.gridY);
        if (dir && !r.connections[dir]) {
          r.connections[dir] = candidate;
          c.connections[OPPOSITE[dir]] = id;
          break;
        }
      }
      break;
    }
  }

  // Find farthest room from 0 for FINAL_VAULT using BFS
  const bfsDist: Record<string, number> = { '0': 0 };
  const queue = ['0'];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const neighbor of Object.values(rooms[curr].connections)) {
      if (neighbor && !(neighbor in bfsDist)) {
        bfsDist[neighbor] = bfsDist[curr] + 1;
        queue.push(neighbor);
      }
    }
  }
  const farthest = allIds.reduce((a, b) => (bfsDist[a] ?? 0) > (bfsDist[b] ?? 0) ? a : b);

  // Assign room types
  rooms['0'].type = 'ENTRANCE';
  rooms['0'].visited = true;
  rooms[farthest].type = 'FINAL_VAULT';

  const remaining = allIds.filter(id => id !== '0' && id !== farthest);
  const shuffledRemaining = shuffle(remaining);

  const charmTypes: RoomType[] = ['CHARM_FIRE', 'CHARM_ICE', 'CHARM_LIGHTNING'];
  let idx = 0;
  for (let i = 0; i < cfg.doors && idx < shuffledRemaining.length; i++, idx++) {
    rooms[shuffledRemaining[idx]].type = 'DOOR';
  }
  for (let i = 0; i < cfg.treasures && idx < shuffledRemaining.length; i++, idx++) {
    rooms[shuffledRemaining[idx]].type = 'TREASURE';
  }
  for (let i = 0; i < cfg.charms && idx < shuffledRemaining.length; i++, idx++) {
    rooms[shuffledRemaining[idx]].type = charmTypes[i % 3];
  }
  // Remaining are FLOOR

  return rooms;
}
