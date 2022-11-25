import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import ResponsiveObserve from '../_util/responsiveObserve';

var RowProps = {
  gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  type: PropTypes.oneOf(['flex']),
  align: PropTypes.oneOf(['top', 'middle', 'bottom', 'stretch']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  prefixCls: PropTypes.string
};

var responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

export default {
  name: 'ARow',
  mixins: [BaseMixin],
  props: _extends({}, RowProps, {
    gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]).def(0)
  }),
  provide: function provide() {
    return {
      rowContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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
      _this.token = ResponsiveObserve.subscribe(function (screens) {
        var gutter = _this.gutter;

        if ((typeof gutter === 'undefined' ? 'undefined' : _typeof(gutter)) === 'object' || Array.isArray(gutter) && (_typeof(gutter[0]) === 'object' || _typeof(gutter[1]) === 'object')) {
          _this.screens = screens;
        }
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    ResponsiveObserve.unsubscribe(this.token);
  },

  methods: {
    getGutter: function getGutter() {
      var results = [0, 0];
      var gutter = this.gutter,
          screens = this.screens;

      var normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
      normalizedGutter.forEach(function (g, index) {
        if ((typeof g === 'undefined' ? 'undefined' : _typeof(g)) === 'object') {
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
    var classes = (_classes = {}, _defineProperty(_classes, prefixCls, !type), _defineProperty(_classes, prefixCls + '-' + type, type), _defineProperty(_classes, prefixCls + '-' + type + '-' + justify, type && justify), _defineProperty(_classes, prefixCls + '-' + type + '-' + align, type && align), _classes);
    var rowStyle = _extends({}, gutter[0] > 0 ? {
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