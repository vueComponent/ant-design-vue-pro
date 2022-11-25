'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _BaseSelector = require('../Base/BaseSelector');

var _BaseSelector2 = _interopRequireDefault(_BaseSelector);

var _util = require('../util');

var _propsUtil = require('../../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Selector = (0, _BaseSelector2['default'])('single');

var SingleSelector = {
  name: 'SingleSelector',
  props: (0, _BaseSelector.selectorPropTypes)(),
  created: function created() {
    this.selectorRef = (0, _util.createRef)();
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
          { key: 'value', attrs: { title: (0, _util.toTitle)(label) },
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
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        showArrow: showArrow,
        renderSelection: this.renderSelection
      }),
      on: (0, _propsUtil.getListeners)(this),
      directives: [{
        name: 'ant-ref',
        value: this.selectorRef
      }]
    };
    return h(Selector, props);
  }
};

exports['default'] = SingleSelector;