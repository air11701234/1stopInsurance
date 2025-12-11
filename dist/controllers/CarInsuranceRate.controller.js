"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInsurance = exports.getPlans = void 0;
const CarInsuranceRate_model_1 = __importDefault(require("../models/CarInsuranceRate.model"));
const getPlans = async (req, res) => {
    try {
        // const { carBrand, level, insuranceBrand, year, model, subModel } = req.query;
        const { carBrand, level, insuranceBrand, year, carModel, subModel } = req.query;
        const query = {};
        if (carBrand)
            query.carBrand = carBrand;
        if (level)
            query.level = level;
        if (insuranceBrand)
            query.insuranceBrand = insuranceBrand;
        if (year)
            query.year = parseInt(year);
        // if (model) query.model = model;
        if (carModel)
            query.model = carModel;
        if (subModel)
            query.subModel = subModel;
        const plans = await CarInsuranceRate_model_1.default.find(query);
        res.json(plans);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getPlans = getPlans;
const addInsurance = async (req, res) => {
    try {
        const newData = new CarInsuranceRate_model_1.default(req.body);
        const saved = await newData.save();
        res.json({ message: "Insurance data added successfully", data: saved });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addInsurance = addInsurance;
