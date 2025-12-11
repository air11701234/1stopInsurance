"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CarInsuranceRate_controller_1 = require("../controllers/CarInsuranceRate.controller");
const router = express_1.default.Router();
router.get("/plans", CarInsuranceRate_controller_1.getPlans);
router.post("/insurance", CarInsuranceRate_controller_1.addInsurance);
exports.default = router;
