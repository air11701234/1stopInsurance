"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getAllCustomers = exports.getProfile = exports.loginCustomer = exports.createCustomer = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Customer_model_1 = __importDefault(require("../models/Customer.model"));
const type_1 = require("../interfaces/type");
// Secret สำหรับ JWT (ควรเก็บใน .env)
const JWT_SECRET = process.env.JWT_SECRET || '92680bcc59e60c4753ce03a8e6efb1bc';
// if (!process.env.JWT_SECRET) {
//   throw new Error('❌ Missing JWT_SECRET environment variable');
// }
// const JWT_SECRET = process.env.JWT_SECRET;
// =========================
// CREATE CUSTOMER (Register)
// =========================
const createCustomer = async (req, res) => {
    // console.log(req.body);
    const { first_name, last_name, email, address, birth_date, phone, username, password } = req.body;
    try {
        if (!first_name || !last_name || !email || !address || !birth_date || !phone || !username || !password) {
            return res.status(400).json({ message: "Some input fields are missing" });
        }
        // ตรวจสอบ username ซ้ำ
        const existing = await Customer_model_1.default.findOne({ username: username });
        if (existing) {
            console.log("Username already exists");
            return res.status(400).json({ message: "username นี้มีผู้ใช้แล้ว" });
        }
        // hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // สร้าง user ใหม่
        const user = new Customer_model_1.default({
            first_name, last_name, email, address,
            birth_date: new Date(birth_date),
            phone, username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (err) {
        console.error("Error creating user:", err);
        res.send("Server error");
    }
};
exports.createCustomer = createCustomer;
// =========================
// LOGIN CUSTOMER
// =========================
const loginCustomer = async (req, res) => {
    try {
        const { username, password } = req.body;
        const customer = await Customer_model_1.default.findOne({ username });
        if (!customer) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
        // ✅ สร้าง token พร้อม username
        const token = jsonwebtoken_1.default.sign({
            _id: customer._id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            address: customer.address,
            birth_date: customer.birth_date,
            phone: customer.phone,
            username: customer.username,
            imgProfile_customer: customer.imgProfile_customer,
            role: type_1.ROLES.CUSTOMER
        }, JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({
            message: 'Login successful',
            token,
            customer: {
                _id: customer._id,
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                address: customer.address,
                birth_date: customer.birth_date,
                phone: customer.phone,
                username: customer.username,
                imgProfile_customer: customer.imgProfile_customer,
                role: type_1.ROLES.CUSTOMER
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.loginCustomer = loginCustomer;
// ดึงข้อมูล user จาก token
const getProfile = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, _id } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "Missing _id in request body" });
        }
        const customerData = await Customer_model_1.default.findById(_id);
        if (!customerData) {
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log("Found data:", customerData);
        res.json(customerData);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
//ข้างล่างยังไม่ได้ใช้งาน
// =========================
// GET ALL CUSTOMERS
// =========================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer_model_1.default.find().select('-password'); // ไม่ส่ง password กลับ
        res.status(200).json(customers);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.getAllCustomers = getAllCustomers;
// =========================
// GET CUSTOMER BY ID
// =========================
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer_model_1.default.findById(id).select('-password');
        if (!customer)
            return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json(customer);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.getCustomerById = getCustomerById;
// =========================
// UPDATE CUSTOMER
// =========================
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        // ถ้า update password ต้อง hash ก่อน
        if (updateData.password) {
            updateData.password = await bcryptjs_1.default.hash(updateData.password, 10);
        }
        const updatedCustomer = await Customer_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!updatedCustomer)
            return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json({ message: 'Customer updated', customer: updatedCustomer });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.updateCustomer = updateCustomer;
// =========================
// DELETE CUSTOMER
// =========================
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer_model_1.default.findByIdAndDelete(id);
        if (!deletedCustomer)
            return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json({ message: 'Customer deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.deleteCustomer = deleteCustomer;
