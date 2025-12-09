import express from "express";
import { getPlans, addInsurance } from "../controllers/CarInsuranceRate.controller";

const router = express.Router();

router.get("/plans", getPlans);
router.post("/insurance", addInsurance);

export default router;
