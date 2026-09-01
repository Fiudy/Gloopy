"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    constructor(props, id) {
        this._id = id;
        this.props = props;
    }
    get id() {
        return this._id;
    }
    equals(entity) {
        if (!entity)
            return false;
        if (this === entity)
            return true;
        return this._id === entity._id;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.base.js.map