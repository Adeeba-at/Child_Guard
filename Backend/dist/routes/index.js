"use strict";
// src/routes/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({
        message: "Welcome to the ChildGuard API!",
        status: "Running",
        version: "1.0",
        endpoints: {
            register: "/api/auth/register",
            login: "/api/auth/login",
        }
    });
});
exports.default = router;
