/**
 * Safe Mathematical Expression Evaluator (No eval!)
 * Supports: +, -, *, /, %, parentheses (), floating point numbers
 */

type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const cleaned = expr.replace(/\s+/g, '');

  while (i < cleaned.length) {
    const ch = cleaned[i];

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        numStr += cleaned[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '×', '÷', '%'].includes(ch)) {
      tokens.push({ type: 'OP', value: ch === '×' ? '*' : ch === '÷' ? '/' : ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  return tokens;
}

// Shunting-yard algorithm to convert infix to postfix (RPN)
function infixToRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'OP') {
      // Handle unary minus
      if (token.value === '-' && (i === 0 || tokens[i - 1].type === 'OP' || tokens[i - 1].type === 'LPAREN')) {
        // Treat next number as negative or insert zero before it
        output.push({ type: 'NUMBER', value: '0' });
      }

      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1].type === 'OP' &&
        precedence[opStack[opStack.length - 1].value] >= precedence[token.value]
      ) {
        output.push(opStack.pop()!);
      }
      opStack.push(token);
    } else if (token.type === 'LPAREN') {
      opStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
        output.push(opStack.pop()!);
      }
      if (opStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }
      opStack.pop(); // pop LPAREN
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    output.push(top);
  }

  return output;
}

// Evaluate RPN
function evaluateRPN(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (isNaN(val)) throw new Error('Invalid number');
      stack.push(val);
    } else if (token.type === 'OP') {
      if (stack.length < 2) throw new Error('Invalid expression structure');
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Cannot divide by zero');
          stack.push(a / b);
          break;
        case '%':
          stack.push(a % b);
          break;
        default:
          throw new Error(`Unknown operator ${token.value}`);
      }
    }
  }

  if (stack.length !== 1) throw new Error('Malformed expression');
  const result = stack[0];
  if (!isFinite(result) || isNaN(result)) throw new Error('Calculation overflow');
  return Math.round(result * 10000000000) / 10000000000;
}

export function safeCalculate(expr: string): number {
  const tokens = tokenize(expr);
  const rpn = infixToRPN(tokens);
  return evaluateRPN(rpn);
}
