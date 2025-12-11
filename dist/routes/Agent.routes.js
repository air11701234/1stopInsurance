"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Agent_controller_1 = require("../controllers/Agent.controller");
const router = (0, express_1.Router)();
router.post('/register', Agent_controller_1.createAgent);
router.post('/login', Agent_controller_1.loginAgent);
exports.default = router;
