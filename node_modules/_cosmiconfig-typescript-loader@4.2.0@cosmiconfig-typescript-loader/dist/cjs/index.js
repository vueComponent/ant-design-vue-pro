"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  TypeScriptLoader: () => TypeScriptLoader
});
module.exports = __toCommonJS(lib_exports);

// lib/loader.ts
var import_ts_node = require("ts-node");

// lib/typescript-compile-error.ts
var TypeScriptCompileError = class extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static fromError(error) {
    const errMsg = error.message.replace(
      /(TypeScript compiler encountered syntax errors while transpiling\. Errors:\s?)|(⨯ Unable to compile TypeScript:\s?)/,
      ""
    );
    const message = `TypeScriptLoader failed to compile TypeScript:
${errMsg}`;
    const newError = new TypeScriptCompileError(message);
    newError.stack = error.stack;
    return newError;
  }
};

// lib/loader.ts
function TypeScriptLoader(options) {
  const tsNodeInstance = (0, import_ts_node.register)({
    ...options,
    compilerOptions: { module: "commonjs" }
  });
  return (path, content) => {
    try {
      tsNodeInstance.compile(content, path);
      const result = require(path);
      return result.default || result;
    } catch (error) {
      if (error instanceof Error) {
        throw TypeScriptCompileError.fromError(error);
      }
      throw error;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TypeScriptLoader
});
