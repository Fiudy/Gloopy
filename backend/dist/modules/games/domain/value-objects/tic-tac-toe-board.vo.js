"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeBoard = void 0;
const domain_error_1 = require("../../../../shared/domain/domain-error");
const EMPTY_BOARD = '_________';
const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
class TicTacToeBoard {
    constructor(cells) {
        this.cells = cells;
    }
    static empty() {
        return TicTacToeBoard.fromString(EMPTY_BOARD);
    }
    static fromString(raw) {
        if (raw.length !== 9 || !/^[XO_]{9}$/.test(raw)) {
            throw new domain_error_1.DomainError('Estado de tabuleiro inválido.');
        }
        return new TicTacToeBoard(raw.split(''));
    }
    placeMark(index, mark) {
        if (index < 0 || index > 8) {
            throw new domain_error_1.DomainError('Posição inválida no tabuleiro.');
        }
        if (this.cells[index] !== '_') {
            throw new domain_error_1.DomainError('Essa posição já está ocupada.');
        }
        const next = [...this.cells];
        next[index] = mark;
        return new TicTacToeBoard(next);
    }
    checkWinner() {
        for (const [a, b, c] of WIN_LINES) {
            if (this.cells[a] !== '_' && this.cells[a] === this.cells[b] && this.cells[b] === this.cells[c]) {
                return this.cells[a];
            }
        }
        return null;
    }
    isFull() {
        return this.cells.every((cell) => cell !== '_');
    }
    toString() {
        return this.cells.join('');
    }
}
exports.TicTacToeBoard = TicTacToeBoard;
//# sourceMappingURL=tic-tac-toe-board.vo.js.map