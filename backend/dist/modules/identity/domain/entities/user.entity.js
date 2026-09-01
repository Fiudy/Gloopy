"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const entity_base_1 = require("../../../../shared/domain/entity.base");
const domain_error_1 = require("../../../../shared/domain/domain-error");
class User extends entity_base_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const now = new Date();
        return new User({
            name: props.name,
            email: props.email,
            passwordHash: props.passwordHash,
            avatarUrl: props.avatarUrl ?? null,
            showLastSeen: true,
            readReceiptsEnabled: true,
            lastSeenAt: null,
            createdAt: now,
            updatedAt: now,
        }, id);
    }
    static restore(props, id) {
        return new User(props, id);
    }
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get passwordHash() {
        return this.props.passwordHash;
    }
    get avatarUrl() {
        return this.props.avatarUrl;
    }
    get showLastSeen() {
        return this.props.showLastSeen;
    }
    get readReceiptsEnabled() {
        return this.props.readReceiptsEnabled;
    }
    get lastSeenAt() {
        return this.props.lastSeenAt;
    }
    touchLastSeen() {
        this.props.lastSeenAt = new Date();
        this.props.updatedAt = new Date();
    }
    updateProfile(params) {
        if (params.name !== undefined) {
            const name = params.name.trim();
            if (name.length < 2)
                throw new domain_error_1.DomainError('O nome precisa ter pelo menos 2 caracteres.');
            this.props.name = name;
        }
        if (params.showLastSeen !== undefined)
            this.props.showLastSeen = params.showLastSeen;
        if (params.readReceiptsEnabled !== undefined)
            this.props.readReceiptsEnabled = params.readReceiptsEnabled;
        this.props.updatedAt = new Date();
    }
    setReadReceiptsEnabled(enabled) {
        this.props.readReceiptsEnabled = enabled;
        this.props.updatedAt = new Date();
    }
    setShowLastSeen(show) {
        this.props.showLastSeen = show;
        this.props.updatedAt = new Date();
    }
    toPersistence() {
        return { id: this.id, ...this.props };
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map