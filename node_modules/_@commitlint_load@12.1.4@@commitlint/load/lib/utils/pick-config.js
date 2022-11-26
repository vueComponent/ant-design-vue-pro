"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickConfig = void 0;
const pick_1 = __importDefault(require("lodash/pick"));
const pickConfig = (input) => pick_1.default(input, 'extends', 'rules', 'plugins', 'parserPreset', 'formatter', 'ignores', 'defaultIgnores', 'helpUrl', 'prompt');
exports.pickConfig = pickConfig;
//# sourceMappingURL=pick-config.js.map