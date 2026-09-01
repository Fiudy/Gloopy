import { Entity } from '@shared/domain/entity.base';
import { DomainError } from '@shared/domain/domain-error';
import { TicTacToeBoard, Mark } from '../value-objects/tic-tac-toe-board.vo';

export type GameType = 'TIC_TAC_TOE';
export type GameStatus = 'PENDING' | 'IN_PROGRESS' | 'FINISHED' | 'DECLINED';

export interface GameSessionProps {
  conversationId: string;
  type: GameType;
  status: GameStatus;
  invitedByUserId: string;
  playerXId: string;
  playerOId: string;
  currentTurnUserId: string | null;
  winnerUserId: string | null;
  board: TicTacToeBoard;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agregado raiz do contexto Games. Hoje só existe um tipo de jogo (jogo da
 * velha), mas a estrutura já separa "regras de turno/convite/estado" (aqui)
 * de "regras do tabuleiro em si" (no VO TicTacToeBoard) - um novo jogo no
 * futuro ganha seu próprio VO de tabuleiro/estado, reaproveitando o resto.
 */
export class GameSession extends Entity<GameSessionProps> {
  private constructor(props: GameSessionProps, id: string) {
    super(props, id);
  }

  /** Quem convida sempre joga com X e começa assim que o convite for aceito. */
  static invite(
    params: { conversationId: string; invitedByUserId: string; opponentId: string },
    id: string,
  ): GameSession {
    if (params.invitedByUserId === params.opponentId) {
      throw new DomainError('Não é possível convidar a si mesmo pra jogar.');
    }

    const now = new Date();
    return new GameSession(
      {
        conversationId: params.conversationId,
        type: 'TIC_TAC_TOE',
        status: 'PENDING',
        invitedByUserId: params.invitedByUserId,
        playerXId: params.invitedByUserId,
        playerOId: params.opponentId,
        currentTurnUserId: null,
        winnerUserId: null,
        board: TicTacToeBoard.empty(),
        createdAt: now,
        updatedAt: now,
      },
      id,
    );
  }

  static restore(props: GameSessionProps, id: string): GameSession {
    return new GameSession(props, id);
  }

  get conversationId(): string {
    return this.props.conversationId;
  }

  get status(): GameStatus {
    return this.props.status;
  }

  get playerXId(): string {
    return this.props.playerXId;
  }

  get playerOId(): string {
    return this.props.playerOId;
  }

  get currentTurnUserId(): string | null {
    return this.props.currentTurnUserId;
  }

  get winnerUserId(): string | null {
    return this.props.winnerUserId;
  }

  get board(): string {
    return this.props.board.toString();
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isPlayer(userId: string): boolean {
    return this.props.playerXId === userId || this.props.playerOId === userId;
  }

  private markOf(userId: string): Mark {
    return this.props.playerXId === userId ? 'X' : 'O';
  }

  private opponentOf(userId: string): string {
    return this.props.playerXId === userId ? this.props.playerOId : this.props.playerXId;
  }

  /** Só quem foi convidado (playerO) pode aceitar - quem convidou já "aceitou" implicitamente. */
  accept(userId: string): void {
    if (this.props.status !== 'PENDING') {
      throw new DomainError('Este convite já foi respondido.');
    }
    if (userId !== this.props.playerOId) {
      throw new DomainError('Apenas o convidado pode aceitar esta partida.');
    }
    this.props.status = 'IN_PROGRESS';
    this.props.currentTurnUserId = this.props.playerXId; // X sempre começa
    this.props.updatedAt = new Date();
  }

  decline(userId: string): void {
    if (this.props.status !== 'PENDING') {
      throw new DomainError('Este convite já foi respondido.');
    }
    if (userId !== this.props.playerOId) {
      throw new DomainError('Apenas o convidado pode recusar esta partida.');
    }
    this.props.status = 'DECLINED';
    this.props.updatedAt = new Date();
  }

  move(userId: string, cellIndex: number): void {
    if (this.props.status !== 'IN_PROGRESS') {
      throw new DomainError('Esta partida não está em andamento.');
    }
    if (userId !== this.props.currentTurnUserId) {
      throw new DomainError('Não é a sua vez de jogar.');
    }

    const mark = this.markOf(userId);
    this.props.board = this.props.board.placeMark(cellIndex, mark); // lança DomainError se ocupado

    const winnerMark = this.props.board.checkWinner();
    if (winnerMark) {
      this.props.status = 'FINISHED';
      this.props.winnerUserId = userId;
    } else if (this.props.board.isFull()) {
      this.props.status = 'FINISHED';
      this.props.winnerUserId = null; // empate
    } else {
      this.props.currentTurnUserId = this.opponentOf(userId);
    }

    this.props.updatedAt = new Date();
  }

  toPersistence() {
    return { id: this.id, ...this.props, board: this.props.board.toString() };
  }
}
