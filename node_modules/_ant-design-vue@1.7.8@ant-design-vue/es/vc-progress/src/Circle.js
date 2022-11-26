import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import Vue from 'vue';
import ref from 'vue-ref';
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

var circlePropTypes = _extends({}, propTypes, {
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  gapDegree: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])
});

var circleDefaultProps = _extends({}, defaultProps, {
  gapPosition: 'top'
});

Vue.use(ref, { name: 'ant-ref' });

var gradientSeed = 0;

function stripPercentToNumber(percent) {
  return +percent.replace('%', '');
}

function toArray(symArray) {
  return Array.isArray(symArray) ? symArray : [symArray];
}

function getPathStyles(offset, percent, strokeColor, strokeWidth) {
  var gapDegree = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var gapPosition = arguments[5];

  var radius = 50 - strokeWidth / 2;
  var beginPositionX = 0;
  var beginPositionY = -radius;
  var endPositionX = 0;
  var endPositionY = -2 * radius;
  switch (gapPosition) {
    case 'left':
      beginPositionX = -radius;
      beginPositionY = 0;
      endPositionX = 2 * radius;
      endPositionY = 0;
      break;
    case 'right':
      beginPositionX = radius;
      beginPositionY = 0;
      endPositionX = -2 * radius;
      endPositionY = 0;
      break;
    case 'bottom':
      beginPositionY = radius;
      endPositionY = 2 * radius;
      break;
    default:
  }
  var pathString = 'M 50,50 m ' + beginPositionX + ',' + beginPositionY + '\n   a ' + radius + ',' + radius + ' 0 1 1 ' + endPositionX + ',' + -endPositionY + '\n   a ' + radius + ',' + radius + ' 0 1 1 ' + -endPositionX + ',' + endPositionY;
  var len = Math.PI * 2 * radius;

  var pathStyle = {
    stroke: strokeColor,
    strokeDasharray: percent / 100 * (len - gapDegree) + 'px ' + len + 'px',
    strokeDashoffset: '-' + (gapDegree / 2 + offset / 100 * (len - gapDegree)) + 'px',
    transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s' // eslint-disable-line
  };

  return {
    pathString: pathString,
    pathStyle: pathStyle
  };
}

var Circle = {
  props: initDefaultProps(circlePropTypes, circleDefaultProps),
  created: function created() {
    this.paths = {};
    this.gradientId = gradientSeed;
    gradientSeed += 1;
  },

  methods: {
    getStokeList: function getStokeList() {
      var _this = this;

      var h = this.$createElement;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          percent = _$props.percent,
          strokeColor = _$props.strokeColor,
          strokeWidth = _$props.strokeWidth,
          strokeLinecap = _$props.strokeLinecap,
          gapDegree = _$props.gapDegree,
          gapPosition = _$props.gapPosition;

      var percentList = toArray(percent);
      var strokeColorList = toArray(strokeColor);

      var stackPtg = 0;
      return percentList.map(function (ptg, index) {
        var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];
        var stroke = Object.prototype.toString.call(color) === '[object Object]' ? 'url(#' + prefixCls + '-gradient-' + _this.gradientId + ')' : '';

        var _getPathStyles = getPathStyles(stackPtg, ptg, color, strokeWidth, gapDegree, gapPosition),
            pathString = _getPathStyles.pathString,
            pathStyle = _getPathStyles.pathStyle;

        stackPtg += ptg;

        var pathProps = {
          key: index,
          attrs: {
            d: pathString,
            stroke: stroke,
            'stroke-linecap': strokeLinecap,
            'stroke-width': strokeWidth,
            opacity: ptg === 0 ? 0 : 1,
            'fill-opacity': '0'
          },
          'class': prefixCls + '-circle-path',
          style: pathStyle,
          directives: [{
            name: 'ant-ref',
            value: function value(c) {
              _this.paths[index] = c;
            }
          }]
        };
        return h('path', pathProps);
      });
    }
  },

  render: function render() {
    var h = arguments[0];

    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        strokeWidth = _$props2.strokeWidth,
        trailWidth = _$props2.trailWidth,
        gapDegree = _$props2.gapDegree,
        gapPosition = _$props2.gapPosition,
        trailColor = _$props2.trailColor,
        strokeLinecap = _$props2.strokeLinecap,
        strokeColor = _$props2.strokeColor,
        restProps = _objectWithoutProperties(_$props2, ['prefixCls', 'strokeWidth', 'trailWidth', 'gapDegree', 'gapPosition', 'trailColor', 'strokeLinecap', 'strokeColor']);

    var _getPathStyles2 = getPathStyles(0, 100, trailColor, strokeWidth, gapDegree, gapPosition),
        pathString = _getPathStyles2.pathString,
        pathStyle = _getPathStyles2.pathStyle;

    delete restProps.percent;
    var strokeColorList = toArray(strokeColor);
    var gradient = strokeColorList.find(function (color) {
      return Object.prototype.toString.call(color) === '[object Object]';
    });
    var pathFirst = {
      attrs: {
        d: pathString,
        stroke: trailColor,
        'stroke-linecap': strokeLinecap,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-circle-trail',
      style: pathStyle
    };

    return h(
      'svg',
      _mergeJSXProps([{ 'class': prefixCls + '-circle', attrs: { viewBox: '0 0 100 100' }
      }, restProps]),
      [gradient && h('defs', [h(
        'linearGradient',
        {
          attrs: {
            id: prefixCls + '-gradient-' + this.gradientId,
            x1: '100%',
            y1: '0%',
            x2: '0%',
            y2: '0%'
          }
        },
        [Object.keys(gradient).sort(function (a, b) {
          return stripPercentToNumber(a) - stripPercentToNumber(b);
        }).map(function (key, index) {
          return h('stop', { key: index, attrs: { offset: key, 'stop-color': gradient[key] }
          });
        })]
      )]), h('path', pathFirst), this.getStokeList().reverse()]
    );
  }
};

export default enhancer(Circle);