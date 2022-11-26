'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonParagraphProps = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var widthUnit = _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]);

var skeletonParagraphProps = {
  prefixCls: _vueTypes2['default'].string,
  width: _vueTypes2['default'].oneOfType([widthUnit, _vueTypes2['default'].arrayOf(widthUnit)]),
  rows: _vueTypes2['default'].number
};

var SkeletonParagraphProps = exports.SkeletonParagraphProps = _vueTypes2['default'].shape(skeletonParagraphProps);

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

    var rowList = [].concat((0, _toConsumableArray3['default'])(Array(rows))).map(function (_, index) {
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

exports['default'] = Paragraph;