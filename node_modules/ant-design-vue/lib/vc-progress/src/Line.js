'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _propsUtil = require('../../_util/props-util');

var _enhancer = require('./enhancer');

var _enhancer2 = _interopRequireDefault(_enhancer);

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' });

var Line = {
  props: (0, _propsUtil.initDefaultProps)(_types.propTypes, _types.defaultProps),
  created: function created() {
    this.paths = {};
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        percent = _$props.percent,
        prefixCls = _$props.prefixCls,
        strokeColor = _$props.strokeColor,
        strokeLinecap = _$props.strokeLinecap,
        strokeWidth = _$props.strokeWidth,
        trailColor = _$props.trailColor,
        trailWidth = _$props.trailWidth,
        transition = _$props.transition,
        restProps = (0, _objectWithoutProperties3['default'])(_$props, ['percent', 'prefixCls', 'strokeColor', 'strokeLinecap', 'strokeWidth', 'trailColor', 'trailWidth', 'transition']);


    delete restProps.gapPosition;

    var percentList = Array.isArray(percent) ? percent : [percent];
    var strokeColorList = Array.isArray(strokeColor) ? strokeColor : [strokeColor];

    var center = strokeWidth / 2;
    var right = 100 - strokeWidth / 2;
    var pathString = 'M ' + (strokeLinecap === 'round' ? center : 0) + ',' + center + '\n           L ' + (strokeLinecap === 'round' ? right : 100) + ',' + center;
    var viewBoxString = '0 0 100 ' + strokeWidth;

    var stackPtg = 0;

    var pathFirst = {
      attrs: {
        d: pathString,
        'stroke-linecap': strokeLinecap,
        stroke: trailColor,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0'
      },
      'class': prefixCls + '-line-trail'
    };
    return h(
      'svg',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        'class': prefixCls + '-line',
        attrs: { viewBox: viewBoxString,
          preserveAspectRatio: 'none'
        }
      }, restProps]),
      [h('path', pathFirst), percentList.map(function (ptg, index) {
        var pathStyle = {
          strokeDasharray: ptg + 'px, 100px',
          strokeDashoffset: '-' + stackPtg + 'px',
          transition: transition || 'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear'
        };
        var color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];

        stackPtg += ptg;

        var pathProps = {
          key: index,
          attrs: {
            d: pathString,
            'stroke-linecap': strokeLinecap,
            stroke: color,
            'stroke-width': strokeWidth,
            'fill-opacity': '0'
          },
          'class': prefixCls + '-line-path',
          style: pathStyle,
          directives: [{
            name: 'ant-ref',
            value: function value(c) {
              _this.paths[index] = c;
            }
          }]
        };

        return h('path', pathProps);
      })]
    );
  }
};

exports['default'] = (0, _enhancer2['default'])(Line);