"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./config/db"));
const Customer_routes_1 = __importDefault(require("./routes/Customer.routes"));
const Agent_routes_1 = __importDefault(require("./routes/Agent.routes"));
const CarInsuranceRate_routes_1 = __importDefault(require("./routes/CarInsuranceRate.routes"));
const Purchase_routes_1 = __importDefault(require("./routes/Purchase.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
(0, db_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// ✅ ใช้การกำหนดค่า Limit ตรงนี้จุดเดียวพอครับ
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Test root route
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Routes
app.use('/customers', Customer_routes_1.default);
app.use('/agents', Agent_routes_1.default);
app.use('/api', CarInsuranceRate_routes_1.default);
app.use('/purchase', Purchase_routes_1.default);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
