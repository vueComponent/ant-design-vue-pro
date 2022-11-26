import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import { getOptionProps } from './props-util';

export default {
  methods: {
    setState: function setState() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments[1];

      var newState = typeof state === 'function' ? state(this.$data, this.$props) : state;
      if (this.getDerivedStateFromProps) {
        var s = this.getDerivedStateFromProps(getOptionProps(this), _extends({}, this.$data, newState));
        if (s === null) {
          return;
        } else {
          newState = _extends({}, newState, s || {});
        }
      }
      _extends(this.$data, newState);
      this.$forceUpdate();
      this.$nextTick(function () {
        callback && callback();
      });
    },
    __emit: function __emit() {
      // 直接调用listeners，底层组件不需要vueTool记录events
      var args = [].slice.call(arguments, 0);
      var eventName = args[0];
      var event = this.$listeners[eventName];
      if (args.length && event) {
        if (Array.isArray(event)) {
          for (var i = 0, l = event.length; i < l; i++) {
            event[i].apply(event, _toConsumableArray(args.slice(1)));
          }
        } else {
          event.apply(undefined, _toConsumableArray(args.slice(1)));
        }
      }
    }
  }
};