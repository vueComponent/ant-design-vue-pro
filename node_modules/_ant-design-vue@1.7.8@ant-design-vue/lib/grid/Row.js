'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _responsiveObserve = require('../_util/responsiveObserve');

var _responsiveObserve2 = _interopRequireDefault(_responsiveObserve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RowProps = {
  gutter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].number, _vueTypes2['default'].array]),
  type: _vueTypes2['default'].oneOf(['flex']),
  align: _vueTypes2['default'].oneOf(['top', 'middle', 'bottom', 'stretch']),
  justify: _vueTypes2['default'].oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: _vueTypes2['default'].string
};

var responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

exports['default'] = {
  name: 'ARow',
  mixins: [_BaseMixin2['default']],
  props: (0, _extends3['default'])({}, RowProps, {
    gutter: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].number, _vueTypes2['default'].array]).def(0)
  }),
  provide: function provide() {
    return {
      rowContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      screens: {}
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.token = _responsiveObserve2['default'].subscribe(function (screens) {
        var gutter = _this.gutter;

        if ((typeof gutter === 'undefined' ? 'undefined' : (0, _typeof3['default'])(gutter)) === 'object' || Array.isArray(gutter) && ((0, _typeof3['default'])(gutter[0]) === 'object' || (0, _typeof3['default'])(gutter[1]) === 'object')) {
          _this.screens = screens;
        }
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    _responsiveObserve2['default'].unsubscribe(this.token);
  },

  methods: {
    getGutter: function getGutter() {
      var results = [0, 0];
      var gutter = this.gutter,
          screens = this.screens;

      var normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
      normalizedGutter.forEach(function (g, index) {
        if ((typeof g === 'undefined' ? 'undefined' : (0, _typeof3['default'])(g)) === 'object') {
          for (var i = 0; i < responsiveArray.length; i++) {
            var breakpoint = responsiveArray[i];
            if (screens[breakpoint] && g[breakpoint] !== undefined) {
              results[index] = g[breakpoint];
              break;
            }
          }
        } else {
          results[index] = g || 0;
        }
      });
      return results;
    }
  },

  render: function render() {
    var _classes;

    var h = arguments[0];
    var type = this.type,
        justify = this.justify,
        align = this.align,
        customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('row', customizePrefixCls);

    var gutter = this.getGutter();
    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, prefixCls, !type), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type, type), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type + '-' + justify, type && justify), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + type + '-' + align, type && align), _classes);
    var rowStyle = (0, _extends3['default'])({}, gutter[0] > 0 ? {
      marginLeft: gutter[0] / -2 + 'px',
      marginRight: gutter[0] / -2 + 'px'
    } : {}, gutter[1] > 0 ? {
      marginTop: gutter[1] / -2 + 'px',
      marginBottom: gutter[1] / -2 + 'px'
    } : {});
    return h(
      'div',
      { 'class': classes, style: rowStyle },
      [$slots['default']]
    );
  }
};