"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
class Participant {
    constructor(userId, role, joinedAt, leftAt, removedByUserId) {
        this.userId = userId;
        this.role = role;
        this.joinedAt = joinedAt;
        this.leftAt = leftAt;
        this.removedByUserId = removedByUserId;
    }
    get isActive() {
        return this.leftAt === null;
    }
    get isAdmin() {
        return this.role === 'ADMIN';
    }
    static join(userId, role = 'MEMBER') {
        return new Participant(userId, role, new Date(), null, null);
    }
}
exports.Participant = Participant;
//# sourceMappingURL=participant.js.map