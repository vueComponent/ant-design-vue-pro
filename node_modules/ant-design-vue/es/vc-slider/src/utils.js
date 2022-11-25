import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import keyCode from '../../_util/KeyCode';

export function isEventFromHandle(e, handles) {
  try {
    return Object.keys(handles).some(function (key) {
      return e.target === handles[key].$el || e.target === handles[key];
    });
  } catch (error) {
    return false;
  }
}

export function isValueOutOfRange(value, _ref) {
  var min = _ref.min,
      max = _ref.max;

  return value < min || value > max;
}

export function isNotTouchEvent(e) {
  return e.touches.length > 1 || e.type.toLowerCase() === 'touchend' && e.touches.length > 0;
}

export function getClosestPoint(val, _ref2) {
  var marks = _ref2.marks,
      step = _ref2.step,
      min = _ref2.min,
      max = _ref2.max;

  var points = Object.keys(marks).map(parseFloat);
  if (step !== null) {
    var base = Math.pow(10, getPrecision(step));
    var maxSteps = Math.floor((max * base - min * base) / (step * base));
    var steps = Math.min((val - min) / step, maxSteps);
    var closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
  }
  var diffs = points.map(function (point) {
    return Math.abs(val - point);
  });
  return points[diffs.indexOf(Math.min.apply(Math, _toConsumableArray(diffs)))];
}

export function getPrecision(step) {
  var stepString = step.toString();
  var precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }
  return precision;
}

export function getMousePosition(vertical, e) {
  var zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.clientY : e.pageX) / zoom;
}

export function getTouchPosition(vertical, e) {
  var zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.touches[0].clientY : e.touches[0].pageX) / zoom;
}

export function getHandleCenterPosition(vertical, handle) {
  var coords = handle.getBoundingClientRect();
  return vertical ? coords.top + coords.height * 0.5 : window.pageXOffset + coords.left + coords.width * 0.5;
}

export function ensureValueInRange(val, _ref3) {
  var max = _ref3.max,
      min = _ref3.min;

  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}

export function ensureValuePrecision(val, props) {
  var step = props.step;

  var closestPoint = isFinite(getClosestPoint(val, props)) ? getClosestPoint(val, props) : 0; // eslint-disable-line
  return step === null ? closestPoint : parseFloat(closestPoint.toFixed(getPrecision(step)));
}

export function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

export function calculateNextValue(func, value, props) {
  var operations = {
    increase: function increase(a, b) {
      return a + b;
    },
    decrease: function decrease(a, b) {
      return a - b;
    }
  };

  var indexToGet = operations[func](Object.keys(props.marks).indexOf(JSON.stringify(value)), 1);
  var keyToGet = Object.keys(props.marks)[indexToGet];

  if (props.step) {
    return operations[func](value, props.step);
  } else if (!!Object.keys(props.marks).length && !!props.marks[keyToGet]) {
    return props.marks[keyToGet];
  }
  return value;
}

export function getKeyboardValueMutator(e, vertical, reverse) {
  var increase = 'increase';
  var decrease = 'decrease';
  var method = increase;
  switch (e.keyCode) {
    case keyCode.UP:
      method = vertical && reverse ? decrease : increase;
      break;
    case keyCode.RIGHT:
      method = !vertical && reverse ? decrease : increase;
      break;
    case keyCode.DOWN:
      method = vertical && reverse ? increase : decrease;
      break;
    case keyCode.LEFT:
      method = !vertical && reverse ? increase : decrease;
      break;

    case keyCode.END:
      return function (value, props) {
        return props.max;
      };
    case keyCode.HOME:
      return function (value, props) {
        return props.min;
      };
    case keyCode.PAGE_UP:
      return function (value, props) {
        return value + props.step * 2;
      };
    case keyCode.PAGE_DOWN:
      return function (value, props) {
        return value - props.step * 2;
      };

    default:
      return undefined;
  }
  return function (value, props) {
    return calculateNextValue(method, value, props);
  };
}