export type Mark = 'X' | 'O';
export declare class TicTacToeBoard {
    private readonly cells;
    private constructor();
    static empty(): TicTacToeBoard;
    static fromString(raw: string): TicTacToeBoard;
    placeMark(index: number, mark: Mark): TicTacToeBoard;
    checkWinner(): Mark | null;
    isFull(): boolean;
    toString(): string;
}
