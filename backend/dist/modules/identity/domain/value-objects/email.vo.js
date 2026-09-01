"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const domain_error_1 = require("../../../../shared/domain/domain-error");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(raw) {
        const normalized = raw.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalized)) {
            throw new domain_error_1.DomainError('E-mail inválido.');
        }
        return new Email(normalized);
    }
    toString() {
        return this.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map