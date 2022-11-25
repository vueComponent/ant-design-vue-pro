'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.spyElementPrototypes = spyElementPrototypes;
exports.spyElementPrototype = spyElementPrototype;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var __NULL__ = { notExist: true };

function spyElementPrototypes(Element, properties) {
  var propNames = Object.keys(properties);
  var originDescriptors = {};

  propNames.forEach(function (propName) {
    var originDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, propName);
    originDescriptors[propName] = originDescriptor || __NULL__;

    var spyProp = properties[propName];

    if (typeof spyProp === 'function') {
      // If is a function
      Element.prototype[propName] = function spyFunc() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return spyProp.call.apply(spyProp, [this, originDescriptor].concat(args));
      };
    } else {
      // Otherwise tread as a property
      Object.defineProperty(Element.prototype, propName, (0, _extends3['default'])({}, spyProp, {
        set: function set(value) {
          if (spyProp.set) {
            return spyProp.set.call(this, originDescriptor, value);
          }
          return originDescriptor.set(value);
        },
        get: function get() {
          if (spyProp.get) {
            return spyProp.get.call(this, originDescriptor);
          }
          return originDescriptor.get();
        }
      }));
    }
  });

  return {
    mockRestore: function mockRestore() {
      propNames.forEach(function (propName) {
        var originDescriptor = originDescriptors[propName];
        if (originDescriptor === __NULL__) {
          delete Element.prototype[propName];
        } else if (typeof originDescriptor === 'function') {
          Element.prototype[propName] = originDescriptor;
        } else {
          Object.defineProperty(Element.prototype, propName, originDescriptor);
        }
      });
    }
  };
}

function spyElementPrototype(Element, propName, property) {
  return spyElementPrototypes(Element, (0, _defineProperty3['default'])({}, propName, property));
}