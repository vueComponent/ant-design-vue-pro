"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleConfigQuality = exports.RuleConfigSeverity = void 0;
/**
 * Rules always have a severity.
 * Severity indicates what to do if the rule is found to be broken
 * 0 - Disable this rule
 * 1 - Warn for violations
 * 2 - Error for violations
 */
var RuleConfigSeverity;
(function (RuleConfigSeverity) {
    RuleConfigSeverity[RuleConfigSeverity["Disabled"] = 0] = "Disabled";
    RuleConfigSeverity[RuleConfigSeverity["Warning"] = 1] = "Warning";
    RuleConfigSeverity[RuleConfigSeverity["Error"] = 2] = "Error";
})(RuleConfigSeverity = exports.RuleConfigSeverity || (exports.RuleConfigSeverity = {}));
var RuleConfigQuality;
(function (RuleConfigQuality) {
    RuleConfigQuality[RuleConfigQuality["User"] = 0] = "User";
    RuleConfigQuality[RuleConfigQuality["Qualified"] = 1] = "Qualified";
})(RuleConfigQuality = exports.RuleConfigQuality || (exports.RuleConfigQuality = {}));
//# sourceMappingURL=rules.js.map