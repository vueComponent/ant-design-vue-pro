import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import classNames from 'classnames';
import * as allIcons from '@ant-design/icons/lib/dist';
import VueIcon from '@ant-design/icons-vue';
import PropTypes from '../_util/vue-types';
import createFromIconfontCN from './IconFont';
import { svgBaseProps, withThemeSuffix, removeTypeTheme, getThemeFromTypeName, alias } from './utils';
import warning from '../_util/warning';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getTwoToneColor, setTwoToneColor } from './twoTonePrimaryColor';
import { filterEmpty, getListeners } from '../_util/props-util';
import Base from '../base';

// Initial setting

// https://github.com/vueComponent/ant-design-vue/issues/2745
VueIcon.add.apply(VueIcon, _toConsumableArray(Object.keys(allIcons).filter(function (key) {
  return key !== 'default';
}).map(function (key) {
  return allIcons[key];
})));
setTwoToneColor('#1890ff');
var defaultTheme = 'outlined';
var dangerousTheme = void 0;

function renderIcon(h, locale, context) {
  var _classNames;

  var props = context.$props,
      $slots = context.$slots;

  var listeners = getListeners(context);
  var type = props.type,
      Component = props.component,
      viewBox = props.viewBox,
      spin = props.spin,
      theme = props.theme,
      twoToneColor = props.twoToneColor,
      rotate = props.rotate,
      tabIndex = props.tabIndex;

  var children = filterEmpty($slots['default']);
  children = children.length === 0 ? undefined : children;
  warning(Boolean(type || Component || children), 'Icon', 'Icon should have `type` prop or `component` prop or `children`.');

  var classString = classNames((_classNames = {}, _defineProperty(_classNames, 'anticon', true), _defineProperty(_classNames, 'anticon-' + type, !!type), _classNames));

  var svgClassString = classNames(_defineProperty({}, 'anticon-spin', !!spin || type === 'loading'));

  var svgStyle = rotate ? {
    msTransform: 'rotate(' + rotate + 'deg)',
    transform: 'rotate(' + rotate + 'deg)'
  } : undefined;

  var innerSvgProps = {
    attrs: _extends({}, svgBaseProps, {
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
      warning(Boolean(viewBox) || children.length === 1 && children[0].tag === 'use', 'Icon', 'Make sure that you provide correct `viewBox`' + ' prop (default `0 0 1024 1024`) to the icon.');
      var _innerSvgProps = {
        attrs: _extends({}, svgBaseProps),
        'class': svgClassString,
        style: svgStyle
      };
      return h(
        'svg',
        _mergeJSXProps([_innerSvgProps, {
          attrs: { viewBox: viewBox }
        }]),
        [children]
      );
    }

    if (typeof type === 'string') {
      var computedType = type;
      if (theme) {
        var themeInName = getThemeFromTypeName(type);
        warning(!themeInName || theme === themeInName, 'Icon', 'The icon name \'' + type + '\' already specify a theme \'' + themeInName + '\',' + (' the \'theme\' prop \'' + theme + '\' will be ignored.'));
      }
      computedType = withThemeSuffix(removeTypeTheme(alias(computedType)), dangerousTheme || theme || defaultTheme);

      return h(VueIcon, {
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
    tabIndex: PropTypes.number,
    type: PropTypes.string,
    component: PropTypes.any,
    viewBox: PropTypes.any,
    spin: PropTypes.bool.def(false),
    rotate: PropTypes.number,
    theme: PropTypes.oneOf(['filled', 'outlined', 'twoTone']),
    twoToneColor: PropTypes.string,
    role: PropTypes.string
  },
  render: function render(h) {
    var _this = this;

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Icon'
      },
      scopedSlots: { 'default': function _default(locale) {
          return renderIcon(h, locale, _this);
        } }
    });
  }
};

Icon.createFromIconfontCN = createFromIconfontCN;
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;

/* istanbul ignore next */
Icon.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Icon.name, Icon);
};

export default Icon;