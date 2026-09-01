import { DomainError } from '@shared/domain/domain-error';
import { TicTacToeBoard } from './tic-tac-toe-board.vo';

describe('TicTacToeBoard', () => {
  it('cria tabuleiro vazio e aplica jogadas de forma imutável', () => {
    const empty = TicTacToeBoard.empty();
    const played = empty.placeMark(4, 'X');
    expect(empty.toString()).toBe('_________');
    expect(played.toString()).toBe('____X____');
  });

  it('detecta vitória e tabuleiro cheio', () => {
    expect(TicTacToeBoard.fromString('XXX_O_O__').checkWinner()).toBe('X');
    expect(TicTacToeBoard.fromString('XOXXOOOXX').isFull()).toBe(true);
  });

  it.each([-1, 9])('rejeita posição inválida %i', (index) => {
    expect(() => TicTacToeBoard.empty().placeMark(index, 'X')).toThrow(DomainError);
  });

  it('rejeita célula ocupada e estado malformado', () => {
    expect(() => TicTacToeBoard.fromString('X________').placeMark(0, 'O')).toThrow('Essa posição já está ocupada.');
    expect(() => TicTacToeBoard.fromString('curto')).toThrow('Estado de tabuleiro inválido.');
  });
});
