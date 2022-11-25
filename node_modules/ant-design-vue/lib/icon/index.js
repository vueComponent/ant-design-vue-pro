'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dist = require('@ant-design/icons/lib/dist');

var allIcons = _interopRequireWildcard(_dist);

var _iconsVue = require('@ant-design/icons-vue');

var _iconsVue2 = _interopRequireDefault(_iconsVue);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _IconFont = require('./IconFont');

var _IconFont2 = _interopRequireDefault(_IconFont);

var _utils = require('./utils');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _twoTonePrimaryColor = require('./twoTonePrimaryColor');

var _propsUtil = require('../_util/props-util');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Initial setting

// https://github.com/vueComponent/ant-design-vue/issues/2745
_iconsVue2['default'].add.apply(_iconsVue2['default'], (0, _toConsumableArray3['default'])(Object.keys(allIcons).filter(function (key) {
  return key !== 'default';
}).map(function (key) {
  return allIcons[key];
})));
(0, _twoTonePrimaryColor.setTwoToneColor)('#1890ff');
var defaultTheme = 'outlined';
var dangerousTheme = void 0;

function renderIcon(h, locale, context) {
  var _classNames;

  var props = context.$props,
      $slots = context.$slots;

  var listeners = (0, _propsUtil.getListeners)(context);
  var type = props.type,
      Component = props.component,
      viewBox = props.viewBox,
      spin = props.spin,
      theme = props.theme,
      twoToneColor = props.twoToneColor,
      rotate = props.rotate,
      tabIndex = props.tabIndex;

  var children = (0, _propsUtil.filterEmpty)($slots['default']);
  children = children.length === 0 ? undefined : children;
  (0, _warning2['default'])(Boolean(type || Component || children), 'Icon', 'Icon should have `type` prop or `component` prop or `children`.');

  var classString = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, 'anticon', true), (0, _defineProperty3['default'])(_classNames, 'anticon-' + type, !!type), _classNames));

  var svgClassString = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, 'anticon-spin', !!spin || type === 'loading'));

  var svgStyle = rotate ? {
    msTransform: 'rotate(' + rotate + 'deg)',
    transform: 'rotate(' + rotate + 'deg)'
  } : undefined;

  var innerSvgProps = {
    attrs: (0, _extends3['default'])({}, _utils.svgBaseProps, {
      viewBox: viewBox
    }),
    'class': svgClassString,
    style: svgStyle
  };
  if (!viewBox) {
    delete innerSvgProps.attrs.viewBox;
  }

  var renderInnerNode = function renderInnerNode() {
    // component > children > type
    if (Component) {
      return h(
        Component,
        innerSvgProps,
        [children]
      );
    }
    if (children) {
      (0, _warning2['default'])(Boolean(viewBox) || children.length === 1 && children[0].tag === 'use', 'Icon', 'Make sure that you provide correct `viewBox`' + ' prop (default `0 0 1024 1024`) to the icon.');
      var _innerSvgProps = {
        attrs: (0, _extends3['default'])({}, _utils.svgBaseProps),
        'class': svgClassString,
        style: svgStyle
      };
      return h(
        'svg',
        (0, _babelHelperVueJsxMergeProps2['default'])([_innerSvgProps, {
          attrs: { viewBox: viewBox }
        }]),
        [children]
      );
    }

    if (typeof type === 'string') {
      var computedType = type;
      if (theme) {
        var themeInName = (0, _utils.getThemeFromTypeName)(type);
        (0, _warning2['default'])(!themeInName || theme === themeInName, 'Icon', 'The icon name \'' + type + '\' already specify a theme \'' + themeInName + '\',' + (' the \'theme\' prop \'' + theme + '\' will be ignored.'));
      }
      computedType = (0, _utils.withThemeSuffix)((0, _utils.removeTypeTheme)((0, _utils.alias)(computedType)), dangerousTheme || theme || defaultTheme);

      return h(_iconsVue2['default'], {
        attrs: {
          focusable: 'false',

          type: computedType,
          primaryColor: twoToneColor
        },
        'class': svgClassString, style: svgStyle
      });
    }
  };
  var iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && 'click' in listeners) {
    iconTabIndex = -1;
  }
  // functional component not support nativeOn，https://github.com/vuejs/vue/issues/7526
  var iProps = {
    attrs: {
      'aria-label': type && locale.icon + ': ' + type,
      tabIndex: iconTabIndex
    },
    on: listeners,
    'class': classString,
    staticClass: ''
  };
  return h(
    'i',
    iProps,
    [renderInnerNode()]
  );
}

var Icon = {
  name: 'AIcon',
  props: {
    tabIndex: _vueTypes2['default'].number,
    type: _vueTypes2['default'].string,
    component: _vueTypes2['default'].any,
    viewBox: _vueTypes2['default'].any,
    spin: _vueTypes2['default'].bool.def(false),
    rotate: _vueTypes2['default'].number,
    theme: _vueTypes2['default'].oneOf(['filled', 'outlined', 'twoTone']),
    twoToneColor: _vueTypes2['default'].string,
    role: _vueTypes2['default'].string
  },
  render: function render(h) {
    var _this = this;

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Icon'
      },
      scopedSlots: { 'default': function _default(locale) {
          return renderIcon(h, locale, _this);
        } }
    });
  }
};

Icon.createFromIconfontCN = _IconFont2['default'];
Icon.getTwoToneColor = _twoTonePrimaryColor.getTwoToneColor;
Icon.setTwoToneColor = _twoTonePrimaryColor.setTwoToneColor;

/* istanbul ignore next */
Icon.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Icon.name, Icon);
};

exports['default'] = Icon;