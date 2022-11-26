'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'Star',
  mixins: [_BaseMixin2['default']],
  props: {
    value: _vueTypes2['default'].number,
    index: _vueTypes2['default'].number,
    prefixCls: _vueTypes2['default'].string,
    allowHalf: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    character: _vueTypes2['default'].any,
    characterRender: _vueTypes2['default'].func,
    focused: _vueTypes2['default'].bool,
    count: _vueTypes2['default'].number
  },
  methods: {
    onHover: function onHover(e) {
      var index = this.index;

      this.$emit('hover', e, index);
    },
    onClick: function onClick(e) {
      var index = this.index;

      this.$emit('click', e, index);
    },
    onKeyDown: function onKeyDown(e) {
      var index = this.$props.index;

      if (e.keyCode === 13) {
        this.__emit('click', e, index);
      }
    },
    getClassName: function getClassName() {
      var prefixCls = this.prefixCls,
          index = this.index,
          value = this.value,
          allowHalf = this.allowHalf,
          focused = this.focused;

      var starValue = index + 1;
      var className = prefixCls;
      if (value === 0 && index === 0 && focused) {
        className += ' ' + prefixCls + '-focused';
      } else if (allowHalf && value + 0.5 === starValue) {
        className += ' ' + prefixCls + '-half ' + prefixCls + '-active';
        if (focused) {
          className += ' ' + prefixCls + '-focused';
        }
      } else {
        className += starValue <= value ? ' ' + prefixCls + '-full' : ' ' + prefixCls + '-zero';
        if (starValue === value && focused) {
          className += ' ' + prefixCls + '-focused';
        }
      }
      return className;
    }
  },
  render: function render() {
    var h = arguments[0];
    var onHover = this.onHover,
        onClick = this.onClick,
        onKeyDown = this.onKeyDown,
        disabled = this.disabled,
        prefixCls = this.prefixCls,
        characterRender = this.characterRender,
        index = this.index,
        count = this.count,
        value = this.value;


    var character = (0, _propsUtil.getComponentFromProp)(this, 'character');
    var star = h(
      'li',
      { 'class': this.getClassName() },
      [h(
        'div',
        {
          on: {
            'click': disabled ? noop : onClick,
            'keydown': disabled ? noop : onKeyDown,
            'mousemove': disabled ? noop : onHover
          },
          attrs: {
            role: 'radio',
            'aria-checked': value > index ? 'true' : 'false',
            'aria-posinset': index + 1,
            'aria-setsize': count,
            tabIndex: 0
          }
        },
        [h(
          'div',
          { 'class': prefixCls + '-first' },
          [character]
        ), h(
          'div',
          { 'class': prefixCls + '-second' },
          [character]
        )]
      )]
    );
    if (characterRender) {
      star = characterRender(star, this.$props);
    }
    return star;
  }
};