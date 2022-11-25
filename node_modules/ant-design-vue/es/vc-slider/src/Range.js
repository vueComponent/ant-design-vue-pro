import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { initDefaultProps, hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';

var _trimAlignValue = function _trimAlignValue(_ref) {
  var value = _ref.value,
      handle = _ref.handle,
      bounds = _ref.bounds,
      props = _ref.props;
  var allowCross = props.allowCross,
      pushable = props.pushable;

  var thershold = Number(pushable);
  var valInRange = utils.ensureValueInRange(value, props);
  var valNotConflict = valInRange;
  if (!allowCross && handle != null && bounds !== undefined) {
    if (handle > 0 && valInRange <= bounds[handle - 1] + thershold) {
      valNotConflict = bounds[handle - 1] + thershold;
    }
    if (handle < bounds.length - 1 && valInRange >= bounds[handle + 1] - thershold) {
      valNotConflict = bounds[handle + 1] - thershold;
    }
  }
  return utils.ensureValuePrecision(valNotConflict, props);
};

var rangeProps = {
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  value: PropTypes.arrayOf(PropTypes.number),
  count: PropTypes.number,
  pushable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  allowCross: PropTypes.bool,
  disabled: PropTypes.bool,
  reverse: PropTypes.bool,
  tabIndex: PropTypes.arrayOf(PropTypes.number),
  prefixCls: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  autoFocus: PropTypes.bool
};
var Range = {
  name: 'Range',
  displayName: 'Range',
  mixins: [BaseMixin],
  props: initDefaultProps(rangeProps, {
    count: 1,
    allowCross: true,
    pushable: false,
    tabIndex: []
  }),
  data: function data() {
    var _this = this;

    var count = this.count,
        min = this.min,
        max = this.max;

    var initialValue = Array.apply(undefined, _toConsumableArray(Array(count + 1))).map(function () {
      return min;
    });
    var defaultValue = hasProp(this, 'defaultValue') ? this.defaultValue : initialValue;
    var value = this.value;

    if (value === undefined) {
      value = defaultValue;
    }
    var bounds = value.map(function (v, i) {
      return _trimAlignValue({
        value: v,
        handle: i,
        props: _this.$props
      });
    });
    var recent = bounds[0] === max ? 0 : bounds.length - 1;
    return {
      sHandle: null,
      recent: recent,
      bounds: bounds
    };
  },

  watch: {
    value: {
      handler: function handler(val) {
        var bounds = this.bounds;

        this.setChangeValue(val || bounds);
      },

      deep: true
    },
    min: function min() {
      var value = this.value;

      this.setChangeValue(value || this.bounds);
    },
    max: function max() {
      var value = this.value;

      this.setChangeValue(value || this.bounds);
    }
  },
  methods: {
    setChangeValue: function setChangeValue(value) {
      var _this2 = this;

      var bounds = this.bounds;

      var nextBounds = value.map(function (v, i) {
        return _trimAlignValue({
          value: v,
          handle: i,
          bounds: bounds,
          props: _this2.$props
        });
      });
      if (nextBounds.length === bounds.length && nextBounds.every(function (v, i) {
        return v === bounds[i];
      })) return;

      this.setState({ bounds: nextBounds });

      if (value.some(function (v) {
        return utils.isValueOutOfRange(v, _this2.$props);
      })) {
        var newValues = value.map(function (v) {
          return utils.ensureValueInRange(v, _this2.$props);
        });
        this.$emit('change', newValues);
      }
    },
    onChange: function onChange(state) {
      var isNotControlled = !hasProp(this, 'value');
      if (isNotControlled) {
        this.setState(state);
      } else {
        var controlledState = {};

        ['sHandle', 'recent'].forEach(function (item) {
          if (state[item] !== undefined) {
            controlledState[item] = state[item];
          }
        });

        if (Object.keys(controlledState).length) {
          this.setState(controlledState);
        }
      }

      var data = _extends({}, this.$data, state);
      var changedValue = data.bounds;
      this.$emit('change', changedValue);
    },
    onStart: function onStart(position) {
      var bounds = this.bounds;

      this.$emit('beforeChange', bounds);

      var value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      var closestBound = this.getClosestBound(value);
      this.prevMovedHandleIndex = this.getBoundNeedMoving(value, closestBound);

      this.setState({
        sHandle: this.prevMovedHandleIndex,
        recent: this.prevMovedHandleIndex
      });

      var prevValue = bounds[this.prevMovedHandleIndex];
      if (value === prevValue) return;
      var nextBounds = [].concat(_toConsumableArray(bounds));
      nextBounds[this.prevMovedHandleIndex] = value;
      this.onChange({ bounds: nextBounds });
    },
    onEnd: function onEnd(force) {
      var sHandle = this.sHandle;

      this.removeDocumentEvents();
      if (sHandle !== null || force) {
        this.$emit('afterChange', this.bounds);
      }
      this.setState({ sHandle: null });
    },
    onMove: function onMove(e, position) {
      utils.pauseEvent(e);
      var bounds = this.bounds,
          sHandle = this.sHandle;

      var value = this.calcValueByPos(position);
      var oldValue = bounds[sHandle];
      if (value === oldValue) return;

      this.moveTo(value);
    },
    onKeyboard: function onKeyboard(e) {
      var _$props = this.$props,
          reverse = _$props.reverse,
          vertical = _$props.vertical;

      var valueMutator = utils.getKeyboardValueMutator(e, vertical, reverse);

      if (valueMutator) {
        utils.pauseEvent(e);
        var bounds = this.bounds,
            sHandle = this.sHandle;

        var oldValue = bounds[sHandle === null ? this.recent : sHandle];
        var mutatedValue = valueMutator(oldValue, this.$props);
        var value = _trimAlignValue({
          value: mutatedValue,
          handle: sHandle,
          bounds: bounds,
          props: this.$props
        });
        if (value === oldValue) return;
        var isFromKeyboardEvent = true;
        this.moveTo(value, isFromKeyboardEvent);
      }
    },
    getClosestBound: function getClosestBound(value) {
      var bounds = this.bounds;

      var closestBound = 0;
      for (var i = 1; i < bounds.length - 1; ++i) {
        if (value > bounds[i]) {
          closestBound = i;
        }
      }
      if (Math.abs(bounds[closestBound + 1] - value) < Math.abs(bounds[closestBound] - value)) {
        closestBound += 1;
      }
      return closestBound;
    },
    getBoundNeedMoving: function getBoundNeedMoving(value, closestBound) {
      var bounds = this.bounds,
          recent = this.recent;

      var boundNeedMoving = closestBound;
      var isAtTheSamePoint = bounds[closestBound + 1] === bounds[closestBound];

      if (isAtTheSamePoint && bounds[recent] === bounds[closestBound]) {
        boundNeedMoving = recent;
      }

      if (isAtTheSamePoint && value !== bounds[closestBound + 1]) {
        boundNeedMoving = value < bounds[closestBound + 1] ? closestBound : closestBound + 1;
      }
      return boundNeedMoving;
    },
    getLowerBound: function getLowerBound() {
      return this.bounds[0];
    },
    getUpperBound: function getUpperBound() {
      var bounds = this.bounds;

      return bounds[bounds.length - 1];
    },

    /**
     * Returns an array of possible slider points, taking into account both
     * `marks` and `step`. The result is cached.
     */
    getPoints: function getPoints() {
      var marks = this.marks,
          step = this.step,
          min = this.min,
          max = this.max;

      var cache = this._getPointsCache;
      if (!cache || cache.marks !== marks || cache.step !== step) {
        var pointsObject = _extends({}, marks);
        if (step !== null) {
          for (var point = min; point <= max; point += step) {
            pointsObject[point] = point;
          }
        }
        var points = Object.keys(pointsObject).map(parseFloat);
        points.sort(function (a, b) {
          return a - b;
        });
        this._getPointsCache = { marks: marks, step: step, points: points };
      }
      return this._getPointsCache.points;
    },
    moveTo: function moveTo(value, isFromKeyboardEvent) {
      var _this3 = this;

      var nextBounds = [].concat(_toConsumableArray(this.bounds));
      var sHandle = this.sHandle,
          recent = this.recent;

      var handle = sHandle === null ? recent : sHandle;
      nextBounds[handle] = value;
      var nextHandle = handle;
      if (this.$props.pushable !== false) {
        this.pushSurroundingHandles(nextBounds, nextHandle);
      } else if (this.$props.allowCross) {
        nextBounds.sort(function (a, b) {
          return a - b;
        });
        nextHandle = nextBounds.indexOf(value);
      }
      this.onChange({
        recent: nextHandle,
        sHandle: nextHandle,
        bounds: nextBounds
      });
      if (isFromKeyboardEvent) {
        // known problem: because setState is async,
        // so trigger focus will invoke handler's onEnd and another handler's onStart too early,
        // cause onBeforeChange and onAfterChange receive wrong value.
        // here use setState callback to hack，but not elegant
        this.$emit('afterChange', nextBounds);
        this.setState({}, function () {
          _this3.handlesRefs[nextHandle].focus();
        });
        this.onEnd();
      }
    },
    pushSurroundingHandles: function pushSurroundingHandles(bounds, handle) {
      var value = bounds[handle];
      var threshold = this.pushable;

      threshold = Number(threshold);

      var direction = 0;
      if (bounds[handle + 1] - value < threshold) {
        direction = +1; // push to right
      }
      if (value - bounds[handle - 1] < threshold) {
        direction = -1; // push to left
      }

      if (direction === 0) {
        return;
      }

      var nextHandle = handle + direction;
      var diffToNext = direction * (bounds[nextHandle] - value);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // revert to original value if pushing is impossible
        bounds[handle] = bounds[nextHandle] - direction * threshold;
      }
    },
    pushHandle: function pushHandle(bounds, handle, direction, amount) {
      var originalValue = bounds[handle];
      var currentValue = bounds[handle];
      while (direction * (currentValue - originalValue) < amount) {
        if (!this.pushHandleOnePoint(bounds, handle, direction)) {
          // can't push handle enough to create the needed `amount` gap, so we
          // revert its position to the original value
          bounds[handle] = originalValue;
          return false;
        }
        currentValue = bounds[handle];
      }
      // the handle was pushed enough to create the needed `amount` gap
      return true;
    },
    pushHandleOnePoint: function pushHandleOnePoint(bounds, handle, direction) {
      var points = this.getPoints();
      var pointIndex = points.indexOf(bounds[handle]);
      var nextPointIndex = pointIndex + direction;
      if (nextPointIndex >= points.length || nextPointIndex < 0) {
        // reached the minimum or maximum available point, can't push anymore
        return false;
      }
      var nextHandle = handle + direction;
      var nextValue = points[nextPointIndex];
      var threshold = this.pushable;

      var diffToNext = direction * (bounds[nextHandle] - nextValue);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // couldn't push next handle, so we won't push this one either
        return false;
      }
      // push the handle
      bounds[handle] = nextValue;
      return true;
    },
    trimAlignValue: function trimAlignValue(value) {
      var sHandle = this.sHandle,
          bounds = this.bounds;

      return _trimAlignValue({
        value: value,
        handle: sHandle,
        bounds: bounds,
        props: this.$props
      });
    },
    ensureValueNotConflict: function ensureValueNotConflict(handle, val, _ref2) {
      var allowCross = _ref2.allowCross,
          thershold = _ref2.pushable;

      var state = this.$data || {};
      var bounds = state.bounds;

      handle = handle === undefined ? state.sHandle : handle;
      thershold = Number(thershold);
      /* eslint-disable eqeqeq */
      if (!allowCross && handle != null && bounds !== undefined) {
        if (handle > 0 && val <= bounds[handle - 1] + thershold) {
          return bounds[handle - 1] + thershold;
        }
        if (handle < bounds.length - 1 && val >= bounds[handle + 1] - thershold) {
          return bounds[handle + 1] - thershold;
        }
      }
      /* eslint-enable eqeqeq */
      return val;
    },
    getTrack: function getTrack(_ref3) {
      var bounds = _ref3.bounds,
          prefixCls = _ref3.prefixCls,
          reverse = _ref3.reverse,
          vertical = _ref3.vertical,
          included = _ref3.included,
          offsets = _ref3.offsets,
          trackStyle = _ref3.trackStyle;
      var h = this.$createElement;

      return bounds.slice(0, -1).map(function (_, index) {
        var _classNames;

        var i = index + 1;
        var trackClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-track', true), _defineProperty(_classNames, prefixCls + '-track-' + i, true), _classNames));
        return h(Track, {
          'class': trackClassName,
          attrs: { vertical: vertical,
            reverse: reverse,
            included: included,
            offset: offsets[i - 1],
            length: offsets[i] - offsets[i - 1]
          },
          style: trackStyle[index],
          key: i
        });
      });
    },
    renderSlider: function renderSlider() {
      var _this4 = this;

      var sHandle = this.sHandle,
          bounds = this.bounds,
          prefixCls = this.prefixCls,
          vertical = this.vertical,
          included = this.included,
          disabled = this.disabled,
          min = this.min,
          max = this.max,
          reverse = this.reverse,
          handle = this.handle,
          defaultHandle = this.defaultHandle,
          trackStyle = this.trackStyle,
          handleStyle = this.handleStyle,
          tabIndex = this.tabIndex;

      var handleGenerator = handle || defaultHandle;
      var offsets = bounds.map(function (v) {
        return _this4.calcOffset(v);
      });

      var handleClassName = prefixCls + '-handle';
      var handles = bounds.map(function (v, i) {
        var _classNames2;

        var _tabIndex = tabIndex[i] || 0;
        if (disabled || tabIndex[i] === null) {
          _tabIndex = null;
        }
        return handleGenerator({
          className: classNames((_classNames2 = {}, _defineProperty(_classNames2, handleClassName, true), _defineProperty(_classNames2, handleClassName + '-' + (i + 1), true), _classNames2)),
          prefixCls: prefixCls,
          vertical: vertical,
          offset: offsets[i],
          value: v,
          dragging: sHandle === i,
          index: i,
          tabIndex: _tabIndex,
          min: min,
          max: max,
          reverse: reverse,
          disabled: disabled,
          style: handleStyle[i],
          directives: [{
            name: 'ant-ref',
            value: function value(h) {
              return _this4.saveHandle(i, h);
            }
          }],
          on: {
            focus: _this4.onFocus,
            blur: _this4.onBlur
          }
        });
      });

      return {
        tracks: this.getTrack({
          bounds: bounds,
          prefixCls: prefixCls,
          reverse: reverse,
          vertical: vertical,
          included: included,
          offsets: offsets,
          trackStyle: trackStyle
        }),
        handles: handles
      };
    }
  }
};

export default createSlider(Range);