'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _propsUtil = require('../_util/props-util');

var _Statistic = require('./Statistic');

var _Statistic2 = _interopRequireDefault(_Statistic);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var REFRESH_INTERVAL = 1000 / 30;

function getTime(value) {
  return (0, _interopDefault2['default'])(moment)(value).valueOf();
}

exports['default'] = {
  name: 'AStatisticCountdown',
  props: (0, _propsUtil.initDefaultProps)(_Statistic.StatisticProps, {
    format: 'HH:mm:ss'
  }),

  created: function created() {
    this.countdownId = undefined;
  },
  mounted: function mounted() {
    this.syncTimer();
  },
  updated: function updated() {
    this.syncTimer();
  },
  beforeDestroy: function beforeDestroy() {
    this.stopTimer();
  },


  methods: {
    syncTimer: function syncTimer() {
      var value = this.$props.value;

      var timestamp = getTime(value);
      if (timestamp >= Date.now()) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },
    startTimer: function startTimer() {
      var _this = this;

      if (this.countdownId) return;
      this.countdownId = window.setInterval(function () {
        _this.$refs.statistic.$forceUpdate();
        _this.syncTimer();
      }, REFRESH_INTERVAL);
    },
    stopTimer: function stopTimer() {
      var value = this.$props.value;

      if (this.countdownId) {
        clearInterval(this.countdownId);
        this.countdownId = undefined;

        var timestamp = getTime(value);
        if (timestamp < Date.now()) {
          this.$emit('finish');
        }
      }
    },
    formatCountdown: function formatCountdown(_ref) {
      var value = _ref.value,
          config = _ref.config;
      var format = this.$props.format;

      return (0, _utils.formatCountdown)(value, (0, _extends3['default'])({}, config, { format: format }));
    },


    valueRenderHtml: function valueRenderHtml(node) {
      return node;
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_Statistic2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([{
      ref: 'statistic'
    }, {
      props: (0, _extends3['default'])({}, this.$props, {
        valueRender: this.valueRenderHtml,
        formatter: this.formatCountdown
      }),
      on: (0, _propsUtil.getListeners)(this)
    }]));
  }
};