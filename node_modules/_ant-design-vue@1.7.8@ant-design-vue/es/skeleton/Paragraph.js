import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import PropTypes from '../_util/vue-types';

var widthUnit = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

var skeletonParagraphProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([widthUnit, PropTypes.arrayOf(widthUnit)]),
  rows: PropTypes.number
};

export var SkeletonParagraphProps = PropTypes.shape(skeletonParagraphProps);

var Paragraph = {
  props: skeletonParagraphProps,
  methods: {
    getWidth: function getWidth(index) {
      var width = this.width,
          _rows = this.rows,
          rows = _rows === undefined ? 2 : _rows;

      if (Array.isArray(width)) {
        return width[index];
      }
      // last paragraph
      if (rows - 1 === index) {
        return width;
      }
      return undefined;
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        rows = _$props.rows;

    var rowList = [].concat(_toConsumableArray(Array(rows))).map(function (_, index) {
      var width = _this.getWidth(index);
      return h('li', { key: index, style: { width: typeof width === 'number' ? width + 'px' : width } });
    });
    return h(
      'ul',
      { 'class': prefixCls },
      [rowList]
    );
  }
};

export default Paragraph;