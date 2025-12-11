"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const carInsuranceSchema = new mongoose_1.Schema({
    carBrand: { type: String, required: true },
    carModel: { type: String, required: true },
    subModel: { type: String, required: true },
    year: { type: Number, required: true },
    insuranceBrand: { type: String, required: true },
    level: { type: String, required: true }, // ชั้นประกัน
    repairType: { type: String, default: "ซ่อมอู่" },
    hasFireCoverage: { type: Boolean, default: false },
    hasFloodCoverage: { type: Boolean, default: false },
    hasTheftCoverage: { type: Boolean, default: false },
    personalAccidentCoverageOut: { type: Number, default: 0 },
    personalAccidentCoverageIn: { type: Number, default: 0 },
    propertyDamageCoverage: { type: Number, default: 0 },
    perAccidentCoverage: { type: Number, default: 0 },
    fireFloodCoverage: { type: Number, default: 0 },
    firstLossCoverage: { type: Number, default: 0 },
    premium: { type: Number, default: 0 },
    img: { type: String, default: "" },
}, { timestamps: true });
// ✅ ระบุ generic type ให้ชัด เพื่อให้ TypeScript รู้ว่า Model นี้ใช้ interface ไหน
exports.default = (0, mongoose_1.model)("CarInsuranceRate", carInsuranceSchema);
