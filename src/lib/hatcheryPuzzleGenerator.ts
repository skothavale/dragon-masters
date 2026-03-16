import type { Grade, HatcheryProblem } from '../types';

export type Difficulty = 'easy' | 'medium' | 'hard';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateHatcheryProblem(grade: Grade, difficulty: Difficulty = 'medium'): HatcheryProblem {
  switch (grade) {
    case 1: return grade1(difficulty);
    case 2: return grade2(difficulty);
    case 3: return grade3(difficulty);
    case 4: return grade4(difficulty);
    case 5: return grade5(difficulty);
  }
}

function grade1(difficulty: Difficulty): HatcheryProblem {
  const ranges = { easy: [1, 5], medium: [1, 10], hard: [6, 15] };
  const [lo, hi] = ranges[difficulty];
  const a = rand(lo, hi);
  const b = rand(lo, hi);
  return {
    expression: `${a} + ${b}`,
    answer: a + b,
    hint: `Count up: start at ${a}, count ${b} more`,
  };
}

function grade2(difficulty: Difficulty): HatcheryProblem {
  const ranges = { easy: [1, 20], medium: [5, 50], hard: [20, 100] };
  const [lo, hi] = ranges[difficulty];
  const op = pick(['+', '-'] as const);
  if (op === '+') {
    const a = rand(lo, hi);
    const b = rand(lo, hi);
    return { expression: `${a} + ${b}`, answer: a + b, hint: `Count up: start at ${a}, count ${b} more` };
  } else {
    const b = rand(lo, hi);
    const a = rand(b, hi);
    return { expression: `${a} - ${b}`, answer: a - b, hint: `Count down: start at ${a}, count back ${b}` };
  }
}

function grade3(difficulty: Difficulty): HatcheryProblem {
  const multRanges = { easy: [2, 5], medium: [2, 12], hard: [6, 12] };
  const addRanges = { easy: [1, 20], medium: [5, 50], hard: [20, 100] };
  const [mlo, mhi] = multRanges[difficulty];
  const [alo, ahi] = addRanges[difficulty];
  const op = pick(['+', '-', '×'] as const);
  if (op === '×') {
    const a = rand(mlo, mhi);
    const b = rand(mlo, mhi);
    const answer = a * b;
    return { expression: `${a} × ${b}`, answer, hint: `${a} groups of ${b} = ${answer}` };
  } else if (op === '+') {
    const a = rand(alo, ahi);
    const b = rand(alo, ahi);
    return { expression: `${a} + ${b}`, answer: a + b, hint: `Count up: start at ${a}, count ${b} more` };
  } else {
    const b = rand(alo, ahi);
    const a = rand(b, ahi);
    return { expression: `${a} - ${b}`, answer: a - b, hint: `Count down: start at ${a}, count back ${b}` };
  }
}

function grade4(difficulty: Difficulty): HatcheryProblem {
  const ranges = { easy: [2, 5], medium: [2, 12], hard: [6, 12] };
  const [lo, hi] = ranges[difficulty];
  const op = pick(['×', '÷'] as const);
  if (op === '×') {
    const a = rand(lo, hi);
    const b = rand(lo, hi);
    return { expression: `${a} × ${b}`, answer: a * b, hint: `${a} groups of ${b}` };
  } else {
    const b = rand(lo, hi);
    const answer = rand(lo, hi);
    const a = b * answer;
    return { expression: `${a} ÷ ${b}`, answer, hint: `Think: ${b} × ? = ${a}` };
  }
}

function grade5(difficulty: Difficulty): HatcheryProblem {
  if (difficulty === 'easy') {
    const a = rand(2, 5);
    const b = rand(2, 5);
    const c = rand(1, 10);
    const intermediate = a * b;
    const answer = intermediate + c;
    return {
      expression: `${a} × ${b} + ${c}`,
      answer,
      hint: `Step 1: ${a} × ${b} = ${intermediate}. Step 2: ${intermediate} + ${c}`,
    };
  } else if (difficulty === 'medium') {
    const a = rand(2, 12);
    const b = rand(2, 12);
    const c = rand(2, 12);
    const intermediate = a * b;
    return {
      expression: `${a} × ${b} + ${c}`,
      answer: intermediate + c,
      hint: `Step 1: ${a} × ${b} = ${intermediate}. Step 2: add ${c}`,
    };
  } else {
    // hard: two-step with subtraction or division
    const op = pick(['sub', 'div'] as const);
    if (op === 'sub') {
      const a = rand(6, 12);
      const b = rand(6, 12);
      const c = rand(2, 20);
      const intermediate = a * b;
      return {
        expression: `${a} × ${b} - ${c}`,
        answer: intermediate - c,
        hint: `Step 1: ${a} × ${b} = ${intermediate}. Step 2: subtract ${c}`,
      };
    } else {
      const b = rand(2, 9);
      const answer2 = rand(2, 9);
      const a = b * answer2;
      const c = rand(2, 12);
      const answer = answer2 + c;
      return {
        expression: `${a} ÷ ${b} + ${c}`,
        answer,
        hint: `Step 1: ${a} ÷ ${b} = ${answer2}. Step 2: add ${c}`,
      };
    }
  }
}
