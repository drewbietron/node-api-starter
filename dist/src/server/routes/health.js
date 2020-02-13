"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function index(req, res) {
    try {
        res.status(200).json({ status: "ok" });
    }
    catch (e) {
        res.status(500).json(Object.assign({ status: "down" }, e));
    }
}
exports.default = index;
