"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const entity_base_1 = require("../../../../shared/domain/entity.base");
const domain_error_1 = require("../../../../shared/domain/domain-error");
const tic_tac_toe_board_vo_1 = require("../value-objects/tic-tac-toe-board.vo");
class GameSession extends entity_base_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static invite(params, id) {
        if (params.invitedByUserId === params.opponentId) {
            throw new domain_error_1.DomainError('Não é possível convidar a si mesmo pra jogar.');
        }
        const now = new Date();
        return new GameSession({
            conversationId: params.conversationId,
            type: 'TIC_TAC_TOE',
            status: 'PENDING',
            invitedByUserId: params.invitedByUserId,
            playerXId: params.invitedByUserId,
            playerOId: params.opponentId,
            currentTurnUserId: null,
            winnerUserId: null,
            board: tic_tac_toe_board_vo_1.TicTacToeBoard.empty(),
            createdAt: now,
            updatedAt: now,
        }, id);
    }
    static restore(props, id) {
        return new GameSession(props, id);
    }
    get conversationId() {
        return this.props.conversationId;
    }
    get status() {
        return this.props.status;
    }
    get playerXId() {
        return this.props.playerXId;
    }
    get playerOId() {
        return this.props.playerOId;
    }
    get currentTurnUserId() {
        return this.props.currentTurnUserId;
    }
    get winnerUserId() {
        return this.props.winnerUserId;
    }
    get board() {
        return this.props.board.toString();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    isPlayer(userId) {
        return this.props.playerXId === userId || this.props.playerOId === userId;
    }
    markOf(userId) {
        return this.props.playerXId === userId ? 'X' : 'O';
    }
    opponentOf(userId) {
        return this.props.playerXId === userId ? this.props.playerOId : this.props.playerXId;
    }
    accept(userId) {
        if (this.props.status !== 'PENDING') {
            throw new domain_error_1.DomainError('Este convite já foi respondido.');
        }
        if (userId !== this.props.playerOId) {
            throw new domain_error_1.DomainError('Apenas o convidado pode aceitar esta partida.');
        }
        this.props.status = 'IN_PROGRESS';
        this.props.currentTurnUserId = this.props.playerXId;
        this.props.updatedAt = new Date();
    }
    decline(userId) {
        if (this.props.status !== 'PENDING') {
            throw new domain_error_1.DomainError('Este convite já foi respondido.');
        }
        if (userId !== this.props.playerOId) {
            throw new domain_error_1.DomainError('Apenas o convidado pode recusar esta partida.');
        }
        this.props.status = 'DECLINED';
        this.props.updatedAt = new Date();
    }
    move(userId, cellIndex) {
        if (this.props.status !== 'IN_PROGRESS') {
            throw new domain_error_1.DomainError('Esta partida não está em andamento.');
        }
        if (userId !== this.props.currentTurnUserId) {
            throw new domain_error_1.DomainError('Não é a sua vez de jogar.');
        }
        const mark = this.markOf(userId);
        this.props.board = this.props.board.placeMark(cellIndex, mark);
        const winnerMark = this.props.board.checkWinner();
        if (winnerMark) {
            this.props.status = 'FINISHED';
            this.props.winnerUserId = userId;
        }
        else if (this.props.board.isFull()) {
            this.props.status = 'FINISHED';
            this.props.winnerUserId = null;
        }
        else {
            this.props.currentTurnUserId = this.opponentOf(userId);
        }
        this.props.updatedAt = new Date();
    }
    toPersistence() {
        return { id: this.id, ...this.props, board: this.props.board.toString() };
    }
}
exports.GameSession = GameSession;
//# sourceMappingURL=game-session.entity.js.map