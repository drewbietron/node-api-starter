"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = (req, res) => {
    try {
        res.status(200).end();
    }
    catch (_a) {
        res.status(500).end();
    }
};
exports.default = exports.index;
