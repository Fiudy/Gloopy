"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToUsers = publishToUsers;
async function publishToUsers(bus, userIds, type, data) {
    await Promise.all(userIds.map((userId) => bus.publishToUser(userId, { type, data })));
}
//# sourceMappingURL=publish-to-users.helper.js.map