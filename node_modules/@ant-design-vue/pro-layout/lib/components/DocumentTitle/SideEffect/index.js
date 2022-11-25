"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable */
var SideEffect = function SideEffect(_ref) {
  var propsToState = _ref.propsToState,
      handleStateChange = _ref.handleStateChange;

  _classCallCheck(this, SideEffect);

  if (typeof propsToState !== 'function') {
    throw new Error('Expected propsToState to be a function.');
  }

  if (typeof handleStateChange !== 'function') {
    throw new Error('Expected handleStateChange to be a function.');
  }

  this.options = {
    propsToState: propsToState,
    handleStateChange: handleStateChange
  };
};

var _default = SideEffect;
exports["default"] = _default;