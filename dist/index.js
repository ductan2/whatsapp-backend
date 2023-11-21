"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("./config/logger"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const SockerServer_1 = __importDefault(require("./SockerServer"));
dotenv_1.default.config();
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)("dev"));
}
app.use((0, helmet_1.default)());
const PORT = process.env.PORT || 6969;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
// ==>connect to database 
mongoose_1.default.connection.on('error', (err) => {
    logger_1.default.error("Error database is ==> ", err);
    process.exit(1);
});
if (process.env.NODE_ENV !== "production") {
    mongoose_1.default.set('debug', true);
}
mongoose_1.default.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    logger_1.default.info("Connect to database successfully");
});
// ==> start server
let server;
server = app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
});
app.use('/api/v1', index_routes_1.default);
// ==> handle error
app.use(async (req, res, next) => {
    next(http_errors_1.default.NotFound("This route does not exist."));
});
app.use(async (err, req, res, next) => {
    if (Array.isArray(err)) {
        res.status(err[0].status || 500).json({
            error: err
        });
    }
    else {
        res.status(err.status || 500).json({
            error: [
                {
                    message: err.message || "Internal Server Error",
                    path: err.path || "Server",
                    status: err.status || 500
                }
            ]
        });
    }
});
// ==> socket io
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_ENDPOINT,
        // methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    logger_1.default.info("Socket connected: " + socket.id);
    (0, SockerServer_1.default)(socket, io);
});
// ==> handle unexpected error resolution
const exitHandler = () => {
    if (server) {
        logger_1.default.info("Server closed.");
        process.exit(1);
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
//SIGTERM
process.on("SIGTERM", () => {
    if (server) {
        logger_1.default.info("Server closed.");
        process.exit(1);
    }
});
