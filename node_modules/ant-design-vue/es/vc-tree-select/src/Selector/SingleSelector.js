import _extends from 'babel-runtime/helpers/extends';
import generateSelector, { selectorPropTypes } from '../Base/BaseSelector';
import { toTitle } from '../util';
import { getOptionProps, getListeners } from '../../../_util/props-util';
import { createRef } from '../util';
var Selector = generateSelector('single');

var SingleSelector = {
  name: 'SingleSelector',
  props: selectorPropTypes(),
  created: function created() {
    this.selectorRef = createRef();
  },

  methods: {
    focus: function focus() {
      this.selectorRef.current.focus();
    },
    blur: function blur() {
      this.selectorRef.current.blur();
    },
    renderSelection: function renderSelection() {
      var h = this.$createElement;
      var _$props = this.$props,
          selectorValueList = _$props.selectorValueList,
          placeholder = _$props.placeholder,
          prefixCls = _$props.prefixCls;


      var innerNode = void 0;

      if (selectorValueList.length) {
        var _selectorValueList$ = selectorValueList[0],
            label = _selectorValueList$.label,
            value = _selectorValueList$.value;

        innerNode = h(
          'span',
          { key: 'value', attrs: { title: toTitle(label) },
            'class': prefixCls + '-selection-selected-value' },
          [label || value]
        );
      } else {
        innerNode = h(
          'span',
          { key: 'placeholder', 'class': prefixCls + '-selection__placeholder' },
          [placeholder]
        );
      }

      return h(
        'span',
        { 'class': prefixCls + '-selection__rendered' },
        [innerNode]
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props$showArrow = this.$props.showArrow,
        showArrow = _$props$showArrow === undefined ? true : _$props$showArrow;

    var props = {
      props: _extends({}, getOptionProps(this), {
        showArrow: showArrow,
        renderSelection: this.renderSelection
      }),
      on: getListeners(this),
      directives: [{
        name: 'ant-ref',
        value: this.selectorRef
      }]
    };
    return h(Selector, props);
  }
};

export default SingleSelector;