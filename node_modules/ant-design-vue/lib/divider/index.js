'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Divider = {
  name: 'ADivider',
  props: {
    prefixCls: _vueTypes2['default'].string,
    type: _vueTypes2['default'].oneOf(['horizontal', 'vertical', '']).def('horizontal'),
    dashed: _vueTypes2['default'].bool,
    orientation: _vueTypes2['default'].oneOf(['left', 'right', 'center'])
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        type = this.type,
        $slots = this.$slots,
        dashed = this.dashed,
        _orientation = this.orientation,
        orientation = _orientation === undefined ? 'center' : _orientation;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('divider', customizePrefixCls);
    var orientationPrefix = orientation.length > 0 ? '-' + orientation : orientation;

    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, prefixCls, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + type, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-with-text' + orientationPrefix, $slots['default']), (0, _defineProperty3['default'])(_classString, prefixCls + '-dashed', !!dashed), _classString);

    return h(
      'div',
      { 'class': classString, attrs: { role: 'separator' }
      },
      [$slots['default'] && h(
        'span',
        { 'class': prefixCls + '-inner-text' },
        [$slots['default']]
      )]
    );
  }
};

/* istanbul ignore next */
Divider.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Divider.name, Divider);
};

exports['default'] = Divider;