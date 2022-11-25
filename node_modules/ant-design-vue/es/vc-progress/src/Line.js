import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import Vue from 'vue';
import ref from 'vue-ref';
import { initDefaultProps } from '../../_util/props-util';
import enhancer from './enhancer';
import { propTypes, defaultProps } from './types';

Vue.use(ref, { name: 'ant-ref' });

var Line = {
  props: initDefaultProps(propTypes, defaultProps),
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
        restProps = _objectWithoutProperties(_$props, ['percent', 'prefixCls', 'strokeColor', 'strokeLinecap', 'strokeWidth', 'trailColor', 'trailWidth', 'transition']);

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
      _mergeJSXProps([{
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

export default enhancer(Line);