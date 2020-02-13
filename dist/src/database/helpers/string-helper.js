"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanText(str) {
    if (!str)
        return '';
    return str
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/&amp;/g, '&')
        .replace(/ +(?= )/g, '')
        .trim();
}
exports.default = cleanText;
