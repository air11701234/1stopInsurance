"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAgent = exports.createAgent = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Agent_model_1 = __importDefault(require("../models/Agent.model"));
const type_1 = require("../interfaces/type");
// if (!process.env.JWT_SECRET) {
//   throw new Error('❌ Missing JWT_SECRET environment variable');
// }
const JWT_SECRET = process.env.JWT_SECRET || '92680bcc59e60c4753ce03a8e6efb1bc';
const createAgent = async (req, res) => {
    // console.log("create Agent");
    try {
        const { first_name, last_name, agent_license_number, card_expiry_date, address, imgProfile, idLine, phone, note, username, password, birth_date } = req.body;
        const checkUsername = await Agent_model_1.default.findOne({ username: username });
        if (checkUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newAgent = new Agent_model_1.default({
            first_name, last_name,
            agent_license_number,
            card_expiry_date: new Date(card_expiry_date),
            address, imgProfile, idLine, phone, note, username,
            password: hashedPassword,
            birth_date: new Date(birth_date)
        });
        await newAgent.save();
        // console.log("create Agent succes")
        res.status(201).json({ message: "Agent created successfully", newAgent });
    }
    catch (err) {
        // console.log("create Agent fail")
        const error = err;
        res.status(500).json({ message: "Create agent failed", error: error.message });
    }
};
exports.createAgent = createAgent;
const loginAgent = async (req, res) => {
    try {
        const { username, password } = req.body;
        const agent = await Agent_model_1.default.findOne({ username: username });
        if (!agent) {
            // return res.status(400).json({message:"Not found user"})
            return res.status(400).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, agent.password);
        if (!isMatch) {
            // return res.status(400).json({message:"password is false"})
            return res.status(400).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
        const token = jsonwebtoken_1.default.sign({ id: agent._id, username: agent.username, role: type_1.ROLES.AGENT }, JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({
            message: "Login Agent successful",
            token,
            Agent: {
                id: agent._id, username: agent.username, role: type_1.ROLES.AGENT
            }
        });
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: "Create agent failed", error: error.message });
    }
};
exports.loginAgent = loginAgent;
