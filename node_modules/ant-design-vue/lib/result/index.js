'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResultProps = exports.ExceptionMap = exports.IconMap = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _noFound = require('./noFound');

var _noFound2 = _interopRequireDefault(_noFound);

var _serverError = require('./serverError');

var _serverError2 = _interopRequireDefault(_serverError);

var _unauthorized = require('./unauthorized');

var _unauthorized2 = _interopRequireDefault(_unauthorized);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var IconMap = exports.IconMap = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning'
};

var ExceptionMap = exports.ExceptionMap = {
  '404': _noFound2['default'],
  '500': _serverError2['default'],
  '403': _unauthorized2['default']
};

// ExceptionImageMap keys
var ExceptionStatus = Object.keys(ExceptionMap);

var ResultProps = exports.ResultProps = {
  prefixCls: _vueTypes2['default'].string,
  icon: _vueTypes2['default'].any,
  status: _vueTypes2['default'].oneOf(['success', 'error', 'info', 'warning', '404', '403', '500']).def('info'),
  title: _vueTypes2['default'].any,
  subTitle: _vueTypes2['default'].any,
  extra: _vueTypes2['default'].any
};

var renderIcon = function renderIcon(h, prefixCls, _ref) {
  var status = _ref.status,
      icon = _ref.icon;

  if (ExceptionStatus.includes('' + status)) {
    var SVGComponent = ExceptionMap[status];
    return h(
      'div',
      { 'class': prefixCls + '-icon ' + prefixCls + '-image' },
      [h(SVGComponent)]
    );
  }
  // prop `icon` require slot or VNode
  var iconString = IconMap[status];
  var iconNode = icon || h(_icon2['default'], {
    attrs: { type: iconString, theme: 'filled' }
  });
  return h(
    'div',
    { 'class': prefixCls + '-icon' },
    [iconNode]
  );
};

var renderExtra = function renderExtra(h, prefixCls, extra) {
  return extra && h(
    'div',
    { 'class': prefixCls + '-extra' },
    [extra]
  );
};

var Result = {
  name: 'AResult',
  props: ResultProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render(h) {
    var customizePrefixCls = this.prefixCls,
        status = this.status;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('result', customizePrefixCls);

    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var subTitle = (0, _propsUtil.getComponentFromProp)(this, 'subTitle');
    var icon = (0, _propsUtil.getComponentFromProp)(this, 'icon');
    var extra = (0, _propsUtil.getComponentFromProp)(this, 'extra');

    return h(
      'div',
      { 'class': prefixCls + ' ' + prefixCls + '-' + status },
      [renderIcon(h, prefixCls, { status: status, icon: icon }), h(
        'div',
        { 'class': prefixCls + '-title' },
        [title]
      ), subTitle && h(
        'div',
        { 'class': prefixCls + '-subtitle' },
        [subTitle]
      ), this.$slots['default'] && h(
        'div',
        { 'class': prefixCls + '-content' },
        [this.$slots['default']]
      ), renderExtra(h, prefixCls, extra)]
    );
  }
};

/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];

/* istanbul ignore next */
Result.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Result.name, Result);
};
exports['default'] = Result;