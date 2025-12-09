import { Request, Response } from "express";
import CarInsuranceRate from "../models/CarInsuranceRate.model";

export const getPlans = async (req: Request, res: Response) => {
  try {
    // const { carBrand, level, insuranceBrand, year, model, subModel } = req.query;
    const { carBrand, level, insuranceBrand, year, carModel, subModel } = req.query;

    const query: Record<string, any> = {};
    if (carBrand) query.carBrand = carBrand;
    if (level) query.level = level;
    if (insuranceBrand) query.insuranceBrand = insuranceBrand;
    if (year) query.year = parseInt(year as string);
    // if (model) query.model = model;
    if (carModel) query.model = carModel;
    if (subModel) query.subModel = subModel;

    const plans = await CarInsuranceRate.find(query);
    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addInsurance = async (req: Request, res: Response) => {
  try {
    const newData = new CarInsuranceRate(req.body);
    const saved = await newData.save();
    res.json({ message: "Insurance data added successfully", data: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
