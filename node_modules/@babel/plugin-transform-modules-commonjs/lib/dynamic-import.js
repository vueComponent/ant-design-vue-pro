"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformDynamicImport = transformDynamicImport;

var _core = require("@babel/core");

var _helperModuleTransforms = require("@babel/helper-module-transforms");

const requireNoInterop = source => _core.template.expression.ast`require(${source})`;

const requireInterop = (source, file) => _core.types.callExpression(file.addHelper("interopRequireWildcard"), [requireNoInterop(source)]);

function transformDynamicImport(path, noInterop, file) {
  const buildRequire = noInterop ? requireNoInterop : requireInterop;
  const source = (0, _helperModuleTransforms.getDynamicImportSource)(path.node);
  const replacement = _core.types.isStringLiteral(source) || _core.types.isTemplateLiteral(source) && source.quasis.length === 0 ? _core.template.expression.ast`
        Promise.resolve().then(() => ${buildRequire(source, file)})
      ` : _core.template.expression.ast`
        Promise.resolve(${source}).then(
          s => ${buildRequire(_core.types.identifier("s"), file)}
        )
      `;
  path.replaceWith(replacement);
}

//# sourceMappingURL=dynamic-import.js.map
