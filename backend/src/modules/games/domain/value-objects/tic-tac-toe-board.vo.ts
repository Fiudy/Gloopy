import { DomainError } from '@shared/domain/domain-error';

export type Mark = 'X' | 'O';
type Cell = Mark | '_';

const EMPTY_BOARD = '_________';

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Value Object imutável - representa o tabuleiro como string de 9 posições.
 * Qualquer transição de estado inválida (célula ocupada, índice fora do range)
 * lança DomainError; a entidade GameSession nunca chega a persistir um estado
 * de tabuleiro impossível.
 */
export class TicTacToeBoard {
  private constructor(private readonly cells: Cell[]) {}

  static empty(): TicTacToeBoard {
    return TicTacToeBoard.fromString(EMPTY_BOARD);
  }

  static fromString(raw: string): TicTacToeBoard {
    if (raw.length !== 9 || !/^[XO_]{9}$/.test(raw)) {
      throw new DomainError('Estado de tabuleiro inválido.');
    }
    return new TicTacToeBoard(raw.split('') as Cell[]);
  }

  placeMark(index: number, mark: Mark): TicTacToeBoard {
    if (index < 0 || index > 8) {
      throw new DomainError('Posição inválida no tabuleiro.');
    }
    if (this.cells[index] !== '_') {
      throw new DomainError('Essa posição já está ocupada.');
    }
    const next = [...this.cells];
    next[index] = mark;
    return new TicTacToeBoard(next);
  }

  checkWinner(): Mark | null {
    for (const [a, b, c] of WIN_LINES) {
      if (this.cells[a] !== '_' && this.cells[a] === this.cells[b] && this.cells[b] === this.cells[c]) {
        return this.cells[a] as Mark;
      }
    }
    return null;
  }

  isFull(): boolean {
    return this.cells.every((cell) => cell !== '_');
  }

  toString(): string {
    return this.cells.join('');
  }
}
