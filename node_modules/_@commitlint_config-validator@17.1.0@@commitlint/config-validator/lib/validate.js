"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const ajv_1 = __importDefault(require("ajv"));
const commitlint_schema_json_1 = __importDefault(require("./commitlint.schema.json"));
const formatErrors_1 = require("./formatErrors");
const TYPE_OF = [
    'undefined',
    'string',
    'number',
    'object',
    'function',
    'boolean',
    'symbol',
];
function validateConfig(source, config) {
    const ajv = new ajv_1.default({
        meta: false,
        strict: false,
        useDefaults: true,
        validateSchema: false,
        verbose: true,
    });
    ajv.addKeyword({
        keyword: 'typeof',
        validate: function typeOfFunc(schema, data) {
            return typeof data === schema;
        },
        metaSchema: { type: 'string', enum: TYPE_OF },
        schema: true,
    });
    const validate = ajv.compile(commitlint_schema_json_1.default);
    const isValid = validate(config);
    if (!isValid && validate.errors && validate.errors.length) {
        throw new Error(`Commitlint configuration in ${source} is invalid:\n${(0, formatErrors_1.formatErrors)(validate.errors)}`);
    }
}
exports.validateConfig = validateConfig;
//# sourceMappingURL=validate.js.map