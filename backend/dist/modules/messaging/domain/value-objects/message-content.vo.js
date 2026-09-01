"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContent = void 0;
const domain_error_1 = require("../../../../shared/domain/domain-error");
const MAX_LENGTH = 4096;
class MessageContent {
    constructor(value) {
        this.value = value;
    }
    static create(raw) {
        const trimmed = raw.trim();
        if (trimmed.length === 0) {
            throw new domain_error_1.DomainError('A mensagem não pode ser vazia.');
        }
        if (trimmed.length > MAX_LENGTH) {
            throw new domain_error_1.DomainError(`A mensagem excede o limite de ${MAX_LENGTH} caracteres.`);
        }
        return new MessageContent(trimmed);
    }
    toString() {
        return this.value;
    }
}
exports.MessageContent = MessageContent;
//# sourceMappingURL=message-content.vo.js.map