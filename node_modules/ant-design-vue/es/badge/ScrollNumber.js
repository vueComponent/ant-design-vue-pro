import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getStyle } from '../_util/props-util';
import omit from 'omit.js';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function getNumberArray(num) {
  return num ? num.toString().split('').reverse().map(function (i) {
    var current = Number(i);
    return isNaN(current) ? i : current;
  }) : [];
}

var ScrollNumberProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.any,
  component: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string, null]),
  displayComponent: PropTypes.any,
  className: PropTypes.object
};

export default {
  mixins: [BaseMixin],
  props: ScrollNumberProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      animateStarted: true,
      sCount: this.count
    };
  },

  watch: {
    count: function count() {
      this.lastCount = this.sCount;
      this.setState({
        animateStarted: true
      });
    }
  },
  updated: function updated() {
    var _this = this;

    var animateStarted = this.animateStarted,
        count = this.count;

    if (animateStarted) {
      this.clearTimeout();
      // Let browser has time to reset the scroller before actually
      // performing the transition.
      this.timeout = setTimeout(function () {
        _this.setState({
          animateStarted: false,
          sCount: count
        }, _this.onAnimated);
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.clearTimeout();
  },

  methods: {
    clearTimeout: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
    }),
    getPositionByNum: function getPositionByNum(num, i) {
      var sCount = this.sCount;

      var currentCount = Math.abs(Number(sCount));
      var lastCount = Math.abs(Number(this.lastCount));
      var currentDigit = Math.abs(getNumberArray(sCount)[i]);
      var lastDigit = Math.abs(getNumberArray(this.lastCount)[i]);

      if (this.animateStarted) {
        return 10 + num;
      }
      // 同方向则在同一侧切换数字
      if (currentCount > lastCount) {
        if (currentDigit >= lastDigit) {
          return 10 + num;
        }
        return 20 + num;
      }
      if (currentDigit <= lastDigit) {
        return 10 + num;
      }
      return num;
    },
    onAnimated: function onAnimated() {
      this.$emit('animated');
    },
    renderNumberList: function renderNumberList(position, className) {
      var h = this.$createElement;

      var childrenToReturn = [];
      for (var i = 0; i < 30; i++) {
        childrenToReturn.push(h(
          'p',
          {
            key: i.toString(),
            'class': classNames(className, {
              current: position === i
            })
          },
          [i % 10]
        ));
      }

      return childrenToReturn;
    },
    renderCurrentNumber: function renderCurrentNumber(prefixCls, num, i) {
      var h = this.$createElement;

      if (typeof num === 'number') {
        var position = this.getPositionByNum(num, i);
        var removeTransition = this.animateStarted || getNumberArray(this.lastCount)[i] === undefined;
        var style = {
          transition: removeTransition ? 'none' : undefined,
          msTransform: 'translateY(' + -position * 100 + '%)',
          WebkitTransform: 'translateY(' + -position * 100 + '%)',
          transform: 'translateY(' + -position * 100 + '%)'
        };
        return h(
          'span',
          { 'class': prefixCls + '-only', style: style, key: i },
          [this.renderNumberList(position, prefixCls + '-only-unit')]
        );
      }
      return h(
        'span',
        { key: 'symbol', 'class': prefixCls + '-symbol' },
        [num]
      );
    },
    renderNumberElement: function renderNumberElement(prefixCls) {
      var _this2 = this;

      var sCount = this.sCount;

      if (sCount && Number(sCount) % 1 === 0) {
        return getNumberArray(sCount).map(function (num, i) {
          return _this2.renderCurrentNumber(prefixCls, num, i);
        }).reverse();
      }
      return sCount;
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        title = this.title,
        _component = this.component,
        Tag = _component === undefined ? 'sup' : _component,
        displayComponent = this.displayComponent,
        className = this.className;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('scroll-number', customizePrefixCls);
    if (displayComponent) {
      return cloneElement(displayComponent, {
        'class': prefixCls + '-custom-component'
      });
    }
    var style = getStyle(this, true);
    // fix https://fb.me/react-unknown-prop
    var restProps = omit(this.$props, ['count', 'component', 'prefixCls', 'displayComponent']);
    var newProps = {
      props: _extends({}, restProps),
      attrs: {
        title: title
      },
      style: style,
      'class': classNames(prefixCls, className)
    };
    // allow specify the border
    // mock border-color by box-shadow for compatible with old usage:
    // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
    if (style && style.borderColor) {
      newProps.style.boxShadow = '0 0 0 1px ' + style.borderColor + ' inset';
    }

    return h(
      Tag,
      newProps,
      [this.renderNumberElement(prefixCls)]
    );
  }
};