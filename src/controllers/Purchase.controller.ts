import { Request, Response } from "express";
import Car from "../models/Car.model";
import Purchase from "../models/Purchase.model";
import mongoose from "mongoose";

// ... (ฟังก์ชัน createPurchase เดิมของคุณคงไว้เหมือนเดิมข้างบน) ...

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      agent_id,
      plan_id,
      carBrand,
      carModel,
      subModel,
      carYear,
      registration,
      color,
      citizenCardImage,
      carRegistrationImage
    } = req.body;

    // 1. บันทึกรถก่อน
    const car = await Car.create({
      customer_id,
      brand: carBrand,
      carModel,
      subModel,
      year: carYear,
      registration,
      color
    });

    // 3. บันทึกข้อมูล purchase
    const purchase = await Purchase.create({
      customer_id,
      agent_id: agent_id || null,
      car_id: car._id,
      carInsurance_id: plan_id,
      policy_number: null,
      citizenCardImage,
      carRegistrationImage,
      status: "pending"
    });

    res.status(201).json({
      message: "Purchase created successfully",
      purchase
    });

  } catch (error) {
    console.error("🔥 Error creating purchase:", error);
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};

// ==========================================
// ✅ ส่วนที่เพิ่มใหม่: ดึงข้อมูลตาม Customer ID
// ==========================================
export const getPurchasesByCustomerId = async (req: Request, res: Response) => {
    try {
      const { customer_id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(customer_id)) {
          return res.status(400).json({ message: "Invalid Customer ID" });
      }
  
      // ดึงข้อมูล Purchase + ข้อมูลรถ (ทะเบียน) + ข้อมูลประกัน (ชื่อแผน)
      const purchases = await Purchase.find({ customer_id })
        .populate("car_id", "registration brand carModel color") 
        .populate("carInsurance_id") // ดึงข้อมูลแผนประกันทั้งหมดมา
        .sort({ createdAt: -1 }); // เรียงจากใหม่ไปเก่า
  
      res.status(200).json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };