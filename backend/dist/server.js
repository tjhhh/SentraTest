"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const errorHandler_1 = require("./middleware/errorHandler");
const database_1 = require("./utils/database");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Initialize database
(0, database_1.initializeDatabase)();
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'NotFound',
        message: `Route ${req.method} ${req.path} not found`,
        status: 404,
    });
});
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for ${FRONTEND_URL}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoints:`);
    console.log(`   POST ${PORT}/api/auth/register`);
    console.log(`   POST ${PORT}/api/auth/login`);
    console.log(`   POST ${PORT}/api/auth/refresh`);
    console.log(`   POST ${PORT}/api/auth/logout`);
});
exports.default = app;
//# sourceMappingURL=server.js.map