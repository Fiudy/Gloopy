import { Entity } from '@shared/domain/entity.base';
import { TicTacToeBoard } from '../value-objects/tic-tac-toe-board.vo';
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
export declare class GameSession extends Entity<GameSessionProps> {
    private constructor();
    static invite(params: {
        conversationId: string;
        invitedByUserId: string;
        opponentId: string;
    }, id: string): GameSession;
    static restore(props: GameSessionProps, id: string): GameSession;
    get conversationId(): string;
    get status(): GameStatus;
    get playerXId(): string;
    get playerOId(): string;
    get currentTurnUserId(): string | null;
    get winnerUserId(): string | null;
    get board(): string;
    get updatedAt(): Date;
    isPlayer(userId: string): boolean;
    private markOf;
    private opponentOf;
    accept(userId: string): void;
    decline(userId: string): void;
    move(userId: string, cellIndex: number): void;
    toPersistence(): {
        board: string;
        conversationId: string;
        type: GameType;
        status: GameStatus;
        invitedByUserId: string;
        playerXId: string;
        playerOId: string;
        currentTurnUserId: string | null;
        winnerUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: string;
    };
}
