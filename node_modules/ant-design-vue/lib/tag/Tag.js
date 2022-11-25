'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _wave = require('../_util/wave');

var _wave2 = _interopRequireDefault(_wave);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PresetColorTypes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'];
var PresetColorRegex = new RegExp('^(' + PresetColorTypes.join('|') + ')(-inverse)?$');

exports['default'] = {
  name: 'ATag',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'visible',
    event: 'close.visible'
  },
  props: {
    prefixCls: _vueTypes2['default'].string,
    color: _vueTypes2['default'].string,
    closable: _vueTypes2['default'].bool.def(false),
    visible: _vueTypes2['default'].bool,
    afterClose: _vueTypes2['default'].func
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    var _visible = true;
    var props = (0, _propsUtil.getOptionProps)(this);
    if ('visible' in props) {
      _visible = this.visible;
    }
    (0, _warning2['default'])(!('afterClose' in props), 'Tag', "'afterClose' will be deprecated, please use 'close' event, we will remove this in the next version.");
    return {
      _visible: _visible
    };
  },

  watch: {
    visible: function visible(val) {
      this.setState({
        _visible: val
      });
    }
  },
  methods: {
    setVisible: function setVisible(visible, e) {
      this.$emit('close', e);
      this.$emit('close.visible', false);
      var afterClose = this.afterClose;
      if (afterClose) {
        // next version remove.
        afterClose();
      }
      if (e.defaultPrevented) {
        return;
      }
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({ _visible: visible });
      }
    },
    handleIconClick: function handleIconClick(e) {
      e.stopPropagation();
      this.setVisible(false, e);
    },
    isPresetColor: function isPresetColor() {
      var color = this.$props.color;

      if (!color) {
        return false;
      }
      return PresetColorRegex.test(color);
    },
    getTagStyle: function getTagStyle() {
      var color = this.$props.color;

      var isPresetColor = this.isPresetColor();
      return {
        backgroundColor: color && !isPresetColor ? color : undefined
      };
    },
    getTagClassName: function getTagClassName(prefixCls) {
      var _ref;

      var color = this.$props.color;

      var isPresetColor = this.isPresetColor();
      return _ref = {}, (0, _defineProperty3['default'])(_ref, prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + color, isPresetColor), (0, _defineProperty3['default'])(_ref, prefixCls + '-has-color', color && !isPresetColor), _ref;
    },
    renderCloseIcon: function renderCloseIcon() {
      var h = this.$createElement;
      var closable = this.$props.closable;

      return closable ? h(_icon2['default'], {
        attrs: { type: 'close' },
        on: {
          'click': this.handleIconClick
        }
      }) : null;
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.$props.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tag', customizePrefixCls);
    var visible = this.$data._visible;

    var tag = h(
      'span',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        directives: [{
          name: 'show',
          value: visible
        }]
      }, { on: (0, _omit2['default'])((0, _propsUtil.getListeners)(this), ['close']) }, {
        'class': this.getTagClassName(prefixCls),
        style: this.getTagStyle()
      }]),
      [this.$slots['default'], this.renderCloseIcon()]
    );
    var transitionProps = (0, _getTransitionProps2['default'])(prefixCls + '-zoom', {
      appear: false
    });
    return h(_wave2['default'], [h(
      'transition',
      transitionProps,
      [tag]
    )]);
  }
};