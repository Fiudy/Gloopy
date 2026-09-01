"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaAsset = void 0;
const entity_base_1 = require("../../../../shared/domain/entity.base");
class MediaAsset extends entity_base_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(params, id) {
        return new MediaAsset({
            uploaderId: params.uploaderId,
            kind: params.file.kind,
            mimeType: params.file.mimeType,
            sizeBytes: params.file.sizeBytes,
            fileName: params.file.fileName,
            storageKey: params.storageKey,
            createdAt: new Date(),
        }, id);
    }
    static restore(props, id) {
        return new MediaAsset(props, id);
    }
    get uploaderId() {
        return this.props.uploaderId;
    }
    get kind() {
        return this.props.kind;
    }
    get mimeType() {
        return this.props.mimeType;
    }
    get sizeBytes() {
        return this.props.sizeBytes;
    }
    get fileName() {
        return this.props.fileName;
    }
    get storageKey() {
        return this.props.storageKey;
    }
    toPersistence() {
        return { id: this.id, ...this.props };
    }
}
exports.MediaAsset = MediaAsset;
//# sourceMappingURL=media-asset.entity.js.map