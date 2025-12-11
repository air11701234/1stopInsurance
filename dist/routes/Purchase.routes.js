"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Purchase_controller_1 = require("../controllers/Purchase.controller");
const router = express_1.default.Router();
router.post("/insurance", Purchase_controller_1.createPurchase);
router.get("/customer/:customer_id", Purchase_controller_1.getPurchasesByCustomerId);
exports.default = router;
