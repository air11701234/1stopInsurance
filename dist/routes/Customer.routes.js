"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Customer_controller_1 = require("../controllers/Customer.controller");
const router = (0, express_1.Router)();
// ------------------------
// PUBLIC ROUTES
// ------------------------
// Register
router.post('/register', Customer_controller_1.createCustomer);
// Login
router.post('/login', Customer_controller_1.loginCustomer);
router.post("/profile", Customer_controller_1.getProfile);
const authMiddleware_1 = require("../middlewares/authMiddleware");
// ------------------------
// PROTECTED ROUTES (ต้อง login)
// ------------------------
router.get('/', authMiddleware_1.authenticateJWT, Customer_controller_1.getAllCustomers);
router.get('/:id', authMiddleware_1.authenticateJWT, Customer_controller_1.getCustomerById);
router.put('/:id', authMiddleware_1.authenticateJWT, Customer_controller_1.updateCustomer);
router.delete('/:id', authMiddleware_1.authenticateJWT, Customer_controller_1.deleteCustomer);
exports.default = router;
