import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import * as moment from 'moment';
import interopDefault from '../_util/interopDefault';
import { initDefaultProps, getListeners } from '../_util/props-util';
import Statistic, { StatisticProps } from './Statistic';
import { formatCountdown as _formatCountdown } from './utils';

var REFRESH_INTERVAL = 1000 / 30;

function getTime(value) {
  return interopDefault(moment)(value).valueOf();
}

export default {
  name: 'AStatisticCountdown',
  props: initDefaultProps(StatisticProps, {
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

      return _formatCountdown(value, _extends({}, config, { format: format }));
    },


    valueRenderHtml: function valueRenderHtml(node) {
      return node;
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(Statistic, _mergeJSXProps([{
      ref: 'statistic'
    }, {
      props: _extends({}, this.$props, {
        valueRender: this.valueRenderHtml,
        formatter: this.formatCountdown
      }),
      on: getListeners(this)
    }]));
  }
};