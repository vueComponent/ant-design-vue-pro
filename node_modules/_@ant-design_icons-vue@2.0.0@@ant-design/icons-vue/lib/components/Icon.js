'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var twoToneColorPalette = {
  primaryColor: '#333',
  secondaryColor: '#E6E6E6'
};

var Icon = {
  name: 'AntdIcon',
  props: ['type', 'primaryColor', 'secondaryColor'],
  displayName: 'IconVue',
  definitions: new _utils.MiniMap(),
  data: function data() {
    return {
      twoToneColorPalette: twoToneColorPalette
    };
  },
  add: function add() {
    for (var _len = arguments.length, icons = Array(_len), _key = 0; _key < _len; _key++) {
      icons[_key] = arguments[_key];
    }

    icons.forEach(function (icon) {
      Icon.definitions.set((0, _utils.withSuffix)(icon.name, icon.theme), icon);
    });
  },
  clear: function clear() {
    Icon.definitions.clear();
  },
  get: function get(key) {
    var colors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : twoToneColorPalette;

    if (key) {
      var target = Icon.definitions.get(key);
      if (target && typeof target.icon === 'function') {
        target = (0, _extends3['default'])({}, target, {
          icon: target.icon(colors.primaryColor, colors.secondaryColor)
        });
      }
      return target;
    }
  },
  setTwoToneColors: function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor,
        secondaryColor = _ref.secondaryColor;

    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || (0, _utils.getSecondaryColor)(primaryColor);
  },
  getTwoToneColors: function getTwoToneColors() {
    return (0, _extends3['default'])({}, twoToneColorPalette);
  },
  render: function render(h) {
    var _$props = this.$props,
        type = _$props.type,
        primaryColor = _$props.primaryColor,
        secondaryColor = _$props.secondaryColor;


    var target = void 0;
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor || (0, _utils.getSecondaryColor)(primaryColor)
      };
    }
    if ((0, _utils.isIconDefinition)(type)) {
      target = type;
    } else if (typeof type === 'string') {
      target = Icon.get(type, colors);
      if (!target) {
        // log(`Could not find icon: ${type}`);
        return null;
      }
    }
    if (!target) {
      (0, _utils.log)('type should be string or icon definiton, but got ' + type);
      return null;
    }
    if (target && typeof target.icon === 'function') {
      target = (0, _extends3['default'])({}, target, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return (0, _utils.generate)(h, target.icon, 'svg-' + target.name, {
      attrs: {
        'data-icon': target.name,
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        'aria-hidden': 'true'
      },
      on: this.$listeners
    });
  }
};

/* istanbul ignore next */
Icon.install = function (Vue) {
  Vue.component(Icon.name, Icon);
};

exports['default'] = Icon;
module.exports = exports['default'];