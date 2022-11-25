import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import warning from '../../_util/warning';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

var Slider = {
  name: 'Slider',
  mixins: [BaseMixin],
  props: {
    defaultValue: PropTypes.number,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,
    reverse: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number
  },
  data: function data() {
    var defaultValue = this.defaultValue !== undefined ? this.defaultValue : this.min;
    var value = this.value !== undefined ? this.value : defaultValue;

    warning(!hasProp(this, 'minimumTrackStyle'), 'Slider', 'minimumTrackStyle will be deprecate, please use trackStyle instead.');
    warning(!hasProp(this, 'maximumTrackStyle'), 'Slider', 'maximumTrackStyle will be deprecate, please use railStyle instead.');
    return {
      sValue: this.trimAlignValue(value),
      dragging: false
    };
  },

  watch: {
    value: {
      handler: function handler(val) {
        this.setChangeValue(val);
      },

      deep: true
    },
    min: function min() {
      var sValue = this.sValue;

      this.setChangeValue(sValue);
    },
    max: function max() {
      var sValue = this.sValue;

      this.setChangeValue(sValue);
    }
  },
  methods: {
    setChangeValue: function setChangeValue(value) {
      var newValue = value !== undefined ? value : this.sValue;
      var nextValue = this.trimAlignValue(newValue, this.$props);
      if (nextValue === this.sValue) return;

      this.setState({ sValue: nextValue });
      if (utils.isValueOutOfRange(newValue, this.$props)) {
        this.$emit('change', nextValue);
      }
    },
    onChange: function onChange(state) {
      var isNotControlled = !hasProp(this, 'value');
      var nextState = state.sValue > this.max ? _extends({}, state, { sValue: this.max }) : state;
      if (isNotControlled) {
        this.setState(nextState);
      }

      var changedValue = nextState.sValue;
      this.$emit('change', changedValue);
    },
    onStart: function onStart(position) {
      this.setState({ dragging: true });
      var sValue = this.sValue;

      this.$emit('beforeChange', sValue);

      var value = this.calcValueByPos(position);

      this.startValue = value;
      this.startPosition = position;
      if (value === sValue) return;

      this.prevMovedHandleIndex = 0;
      this.onChange({ sValue: value });
    },
    onEnd: function onEnd(force) {
      var dragging = this.dragging;

      this.removeDocumentEvents();
      if (dragging || force) {
        this.$emit('afterChange', this.sValue);
      }
      this.setState({ dragging: false });
    },
    onMove: function onMove(e, position) {
      utils.pauseEvent(e);
      var sValue = this.sValue;

      var value = this.calcValueByPos(position);
      if (value === sValue) return;

      this.onChange({ sValue: value });
    },
    onKeyboard: function onKeyboard(e) {
      var _$props = this.$props,
          reverse = _$props.reverse,
          vertical = _$props.vertical;

      var valueMutator = utils.getKeyboardValueMutator(e, vertical, reverse);
      if (valueMutator) {
        utils.pauseEvent(e);
        var sValue = this.sValue;

        var mutatedValue = valueMutator(sValue, this.$props);
        var value = this.trimAlignValue(mutatedValue);
        if (value === sValue) return;

        this.onChange({ sValue: value });
        this.$emit('afterChange', value);
        this.onEnd();
      }
    },
    getLowerBound: function getLowerBound() {
      return this.min;
    },
    getUpperBound: function getUpperBound() {
      return this.sValue;
    },
    trimAlignValue: function trimAlignValue(v) {
      var nextProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (v === null) {
        return null;
      }
      var mergedProps = _extends({}, this.$props, nextProps);
      var val = utils.ensureValueInRange(v, mergedProps);
      return utils.ensureValuePrecision(val, mergedProps);
    },
    getTrack: function getTrack(_ref) {
      var prefixCls = _ref.prefixCls,
          reverse = _ref.reverse,
          vertical = _ref.vertical,
          included = _ref.included,
          offset = _ref.offset,
          minimumTrackStyle = _ref.minimumTrackStyle,
          _trackStyle = _ref._trackStyle;
      var h = this.$createElement;

      return h(Track, {
        'class': prefixCls + '-track',
        attrs: { vertical: vertical,
          included: included,
          offset: 0,
          reverse: reverse,
          length: offset
        },
        style: _extends({}, minimumTrackStyle, _trackStyle)
      });
    },
    renderSlider: function renderSlider() {
      var _this = this;

      var prefixCls = this.prefixCls,
          vertical = this.vertical,
          included = this.included,
          disabled = this.disabled,
          minimumTrackStyle = this.minimumTrackStyle,
          trackStyle = this.trackStyle,
          handleStyle = this.handleStyle,
          tabIndex = this.tabIndex,
          min = this.min,
          max = this.max,
          reverse = this.reverse,
          handle = this.handle,
          defaultHandle = this.defaultHandle;

      var handleGenerator = handle || defaultHandle;
      var sValue = this.sValue,
          dragging = this.dragging;

      var offset = this.calcOffset(sValue);
      var handles = handleGenerator({
        className: prefixCls + '-handle',
        prefixCls: prefixCls,
        vertical: vertical,
        offset: offset,
        value: sValue,
        dragging: dragging,
        disabled: disabled,
        min: min,
        max: max,
        reverse: reverse,
        index: 0,
        tabIndex: tabIndex,
        style: handleStyle[0] || handleStyle,
        directives: [{
          name: 'ant-ref',
          value: function value(h) {
            return _this.saveHandle(0, h);
          }
        }],
        on: {
          focus: this.onFocus,
          blur: this.onBlur
        }
      });

      var _trackStyle = trackStyle[0] || trackStyle;
      return {
        tracks: this.getTrack({
          prefixCls: prefixCls,
          reverse: reverse,
          vertical: vertical,
          included: included,
          offset: offset,
          minimumTrackStyle: minimumTrackStyle,
          _trackStyle: _trackStyle
        }),
        handles: handles
      };
    }
  }
};

export default createSlider(Slider);