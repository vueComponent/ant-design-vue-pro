'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _util = require('../../util');

var _propsUtil = require('../../../../_util/props-util');

var _BaseMixin = require('../../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Selection = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    maxTagTextLength: _vueTypes2['default'].number,
    // onRemove: PropTypes.func,

    label: _vueTypes2['default'].any,
    value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    removeIcon: _vueTypes2['default'].any
  },
  methods: {
    onRemove: function onRemove(event) {
      var value = this.$props.value;

      this.__emit('remove', event, value);
      event.stopPropagation();
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        maxTagTextLength = _$props.maxTagTextLength,
        label = _$props.label,
        value = _$props.value;

    var content = label || value;
    if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
      content = content.slice(0, maxTagTextLength) + '...';
    }

    return h(
      'li',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        style: _util.UNSELECTABLE_STYLE
      }, { attrs: _util.UNSELECTABLE_ATTRIBUTE }, {
        attrs: {
          role: 'menuitem',

          title: (0, _util.toTitle)(label)
        },
        'class': prefixCls + '-selection__choice' }]),
      [(0, _propsUtil.getListeners)(this).remove && h(
        'span',
        { 'class': prefixCls + '-selection__choice__remove', on: {
            'click': this.onRemove
          }
        },
        [(0, _propsUtil.getComponentFromProp)(this, 'removeIcon')]
      ), h(
        'span',
        { 'class': prefixCls + '-selection__choice__content' },
        [content]
      )]
    );
  }
};

exports['default'] = Selection;