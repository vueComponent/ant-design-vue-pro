"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BaseMenu", {
  enumerable: true,
  get: function get() {
    return _RouteMenu["default"];
  }
});
Object.defineProperty(exports, "BasicLayoutProps", {
  enumerable: true,
  get: function get() {
    return _BasicLayout.BasicLayoutProps;
  }
});
Object.defineProperty(exports, "BlockLayout", {
  enumerable: true,
  get: function get() {
    return _BlockLayout["default"];
  }
});
Object.defineProperty(exports, "DocumentTitle", {
  enumerable: true,
  get: function get() {
    return _DocumentTitle["default"];
  }
});
Object.defineProperty(exports, "GlobalFooter", {
  enumerable: true,
  get: function get() {
    return _GlobalFooter["default"];
  }
});
Object.defineProperty(exports, "PageHeaderWrapper", {
  enumerable: true,
  get: function get() {
    return _PageHeaderWrapper["default"];
  }
});
Object.defineProperty(exports, "SettingDrawer", {
  enumerable: true,
  get: function get() {
    return _SettingDrawer["default"];
  }
});
Object.defineProperty(exports, "SiderMenuWrapper", {
  enumerable: true,
  get: function get() {
    return _SiderMenu["default"];
  }
});
Object.defineProperty(exports, "WaterMark", {
  enumerable: true,
  get: function get() {
    return _WaterMark["default"];
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _BasicLayout["default"];
  }
});
Object.defineProperty(exports, "updateColorWeak", {
  enumerable: true,
  get: function get() {
    return _dynamicTheme.updateColorWeak;
  }
});
Object.defineProperty(exports, "updateTheme", {
  enumerable: true,
  get: function get() {
    return _dynamicTheme.updateTheme;
  }
});

var _BasicLayout = _interopRequireWildcard(require("./BasicLayout"));

var _BlockLayout = _interopRequireDefault(require("./BlockLayout"));

var _PageHeaderWrapper = _interopRequireDefault(require("./components/PageHeaderWrapper"));

var _SiderMenu = _interopRequireDefault(require("./components/SiderMenu"));

var _GlobalFooter = _interopRequireDefault(require("./components/GlobalFooter"));

var _SettingDrawer = _interopRequireDefault(require("./components/SettingDrawer"));

var _DocumentTitle = _interopRequireDefault(require("./components/DocumentTitle"));

var _RouteMenu = _interopRequireDefault(require("./components/RouteMenu"));

var _WaterMark = _interopRequireDefault(require("./components/WaterMark"));

var _dynamicTheme = require("./utils/dynamicTheme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }