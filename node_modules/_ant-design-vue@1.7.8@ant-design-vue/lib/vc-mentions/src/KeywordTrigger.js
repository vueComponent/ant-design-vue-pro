'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTrigger = require('../../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _DropdownMenu = require('./DropdownMenu');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

var _Option = require('./Option');

var _placement = require('./placement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

exports['default'] = {
  name: 'KeywordTrigger',
  props: {
    loading: _vueTypes2['default'].bool,
    options: _vueTypes2['default'].arrayOf(_Option.OptionProps),
    prefixCls: _vueTypes2['default'].string,
    placement: _vueTypes2['default'].oneOf(_placement.PlaceMent),
    visible: _vueTypes2['default'].bool,
    transitionName: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func
  },
  methods: {
    getDropdownPrefix: function getDropdownPrefix() {
      return this.$props.prefixCls + '-dropdown';
    },
    getDropdownElement: function getDropdownElement() {
      var h = this.$createElement;
      var options = this.$props.options;

      return h(_DropdownMenu2['default'], {
        attrs: { prefixCls: this.getDropdownPrefix(), options: options }
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        visible = _$props.visible,
        placement = _$props.placement,
        transitionName = _$props.transitionName,
        getPopupContainer = _$props.getPopupContainer;
    var $slots = this.$slots;


    var children = $slots['default'];

    var popupElement = this.getDropdownElement();

    return h(
      _vcTrigger2['default'],
      {
        attrs: {
          prefixCls: this.getDropdownPrefix(),
          popupVisible: visible,
          popup: popupElement,
          popupPlacement: placement === 'top' ? 'topRight' : 'bottomRight',
          popupTransitionName: transitionName,
          builtinPlacements: BUILT_IN_PLACEMENTS,
          getPopupContainer: getPopupContainer
        }
      },
      [children]
    );
  }
};