export function safeEval(expression: string): number | null {
  // Whitelist check
  if (!/^[\d\s+\-*/().]+$/.test(expression)) return null;

  try {
    // Simple recursive descent parser
    const tokens = tokenize(expression);
    if (tokens.length === 0) return null;
    const { value, pos } = parseExpr(tokens, 0);
    if (pos !== tokens.length) return null;
    return value;
  } catch {
    return null;
  }
}

type Token = { type: 'num'; value: number } | { type: 'op'; value: string } | { type: 'lparen' } | { type: 'rparen' };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === ' ') { i++; continue; }
    if (expr[i] === '(') { tokens.push({ type: 'lparen' }); i++; continue; }
    if (expr[i] === ')') { tokens.push({ type: 'rparen' }); i++; continue; }
    if ('+-*/'.includes(expr[i])) { tokens.push({ type: 'op', value: expr[i] }); i++; continue; }
    if (expr[i] >= '0' && expr[i] <= '9') {
      let num = '';
      while (i < expr.length && expr[i] >= '0' && expr[i] <= '9') { num += expr[i++]; }
      tokens.push({ type: 'num', value: parseInt(num, 10) });
      continue;
    }
    throw new Error('Invalid char: ' + expr[i]);
  }
  return tokens;
}

function parseExpr(tokens: Token[], pos: number): { value: number; pos: number } {
  let { value: left, pos: p } = parseTerm(tokens, pos);
  while (p < tokens.length && tokens[p].type === 'op' && ((tokens[p] as { type: 'op'; value: string }).value === '+' || (tokens[p] as { type: 'op'; value: string }).value === '-')) {
    const op = (tokens[p] as { type: 'op'; value: string }).value;
    const { value: right, pos: newP } = parseTerm(tokens, p + 1);
    left = op === '+' ? left + right : left - right;
    p = newP;
  }
  return { value: left, pos: p };
}

function parseTerm(tokens: Token[], pos: number): { value: number; pos: number } {
  let { value: left, pos: p } = parseFactor(tokens, pos);
  while (p < tokens.length && tokens[p].type === 'op' && ((tokens[p] as { type: 'op'; value: string }).value === '*' || (tokens[p] as { type: 'op'; value: string }).value === '/')) {
    const op = (tokens[p] as { type: 'op'; value: string }).value;
    const { value: right, pos: newP } = parseFactor(tokens, p + 1);
    if (op === '/') {
      if (right === 0) throw new Error('Division by zero');
      left = left / right;
    } else {
      left = left * right;
    }
    p = newP;
  }
  return { value: left, pos: p };
}

function parseFactor(tokens: Token[], pos: number): { value: number; pos: number } {
  if (pos >= tokens.length) throw new Error('Unexpected end');
  const tok = tokens[pos];
  if (tok.type === 'num') return { value: tok.value, pos: pos + 1 };
  if (tok.type === 'lparen') {
    const { value, pos: p } = parseExpr(tokens, pos + 1);
    if (p >= tokens.length || tokens[p].type !== 'rparen') throw new Error('Expected )');
    return { value, pos: p + 1 };
  }
  if (tok.type === 'op' && tok.value === '-') {
    const { value, pos: p } = parseFactor(tokens, pos + 1);
    return { value: -value, pos: p };
  }
  throw new Error('Unexpected token: ' + JSON.stringify(tok));
}

function extractNumbers(expression: string): number[] | null {
  if (!/^[\d\s+\-*/().]+$/.test(expression)) return null;
  try {
    const tokens = tokenize(expression);
    return tokens.filter((t): t is { type: 'num'; value: number } => t.type === 'num').map(t => t.value);
  } catch {
    return null;
  }
}

function sameMultiset(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<number, number>();
  for (const n of a) counts.set(n, (counts.get(n) ?? 0) + 1);
  for (const n of b) {
    const c = counts.get(n);
    if (!c) return false;
    counts.set(n, c - 1);
  }
  return true;
}

function isSubsetMultiset(used: number[], pool: number[]): boolean {
  const counts = new Map<number, number>();
  for (const n of pool) counts.set(n, (counts.get(n) ?? 0) + 1);
  for (const n of used) {
    const c = counts.get(n);
    if (!c) return false;
    counts.set(n, c - 1);
  }
  return true;
}

export function checkAnswer(
  expression: string,
  target: number,
  allowedNumbers?: number[],
  requireAll: boolean = true,
): { correct: boolean; value: number | null; error?: string } {
  const trimmed = expression.trim();
  const value = safeEval(trimmed);
  if (value === null) return { correct: false, value: null, error: 'Invalid expression' };

  if (allowedNumbers) {
    const used = extractNumbers(trimmed);
    if (!used) return { correct: false, value: null, error: 'Invalid expression' };
    if (requireAll) {
      if (used.length < allowedNumbers.length) {
        return { correct: false, value, error: `Use all ${allowedNumbers.length} numbers` };
      }
      if (!sameMultiset(used, allowedNumbers)) {
        return { correct: false, value, error: 'Use only the given numbers, each exactly once' };
      }
    } else {
      if (used.length === 0) {
        return { correct: false, value, error: 'Use at least one of the given numbers' };
      }
      if (!isSubsetMultiset(used, allowedNumbers)) {
        return { correct: false, value, error: 'Only use numbers from the list' };
      }
    }
  }

  const correct = Math.abs(value - target) < 0.001;
  return { correct, value };
}
