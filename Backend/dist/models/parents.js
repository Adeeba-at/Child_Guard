"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentModel = void 0;
// src/models/parents.ts
const User_1 = require("./User");
const BaseModels_1 = require("./BaseModels");
class ParentModel extends BaseModels_1.BaseModel {
    static create(data) {
        this.init();
        const user = User_1.UserModel.create({
            username: data.username,
            email: data.email,
            password: data.password,
            role: "parent",
        });
        const insertParent = this.db.prepare(`
      INSERT INTO parents (parent_id, phone, address)
      VALUES (?, ?, ?)
    `);
        insertParent.run(user.user_id, data.phone ?? null, data.address ?? null);
        const extra = this.db.prepare("SELECT parent_id, phone, address FROM parents WHERE parent_id = ?").get(user.user_id);
        return { ...user, ...extra };
    }
    static find(user_id) {
        this.init();
        const user = User_1.UserModel.findById(user_id);
        if (!user || user.role !== "parent")
            return null;
        const extra = this.db.prepare("SELECT parent_id, phone, address FROM parents WHERE parent_id = ?").get(user_id);
        return { ...user, ...extra };
    }
}
exports.ParentModel = ParentModel;
