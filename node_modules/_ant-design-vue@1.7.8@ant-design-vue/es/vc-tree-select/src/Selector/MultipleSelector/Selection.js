import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../../../../_util/vue-types';
import { toTitle, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE } from '../../util';
import { getComponentFromProp, getListeners } from '../../../../_util/props-util';
import BaseMixin from '../../../../_util/BaseMixin';

var Selection = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    maxTagTextLength: PropTypes.number,
    // onRemove: PropTypes.func,

    label: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    removeIcon: PropTypes.any
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
      _mergeJSXProps([{
        style: UNSELECTABLE_STYLE
      }, { attrs: UNSELECTABLE_ATTRIBUTE }, {
        attrs: {
          role: 'menuitem',

          title: toTitle(label)
        },
        'class': prefixCls + '-selection__choice' }]),
      [getListeners(this).remove && h(
        'span',
        { 'class': prefixCls + '-selection__choice__remove', on: {
            'click': this.onRemove
          }
        },
        [getComponentFromProp(this, 'removeIcon')]
      ), h(
        'span',
        { 'class': prefixCls + '-selection__choice__content' },
        [content]
      )]
    );
  }
};

export default Selection;