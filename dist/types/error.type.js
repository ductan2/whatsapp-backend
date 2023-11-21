"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatus = void 0;
class ErrorWithStatus {
    message;
    status;
    path;
    constructor({ message, status, path }) {
        this.message = message;
        this.status = status;
        this.path = path;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
