import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import Icon from '../icon';
import getTransitionProps from '../_util/getTransitionProps';
import omit from 'omit.js';
import Wave from '../_util/wave';
import { hasProp, getListeners, getOptionProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import warning from '../_util/warning';

var PresetColorTypes = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'];
var PresetColorRegex = new RegExp('^(' + PresetColorTypes.join('|') + ')(-inverse)?$');

export default {
  name: 'ATag',
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'close.visible'
  },
  props: {
    prefixCls: PropTypes.string,
    color: PropTypes.string,
    closable: PropTypes.bool.def(false),
    visible: PropTypes.bool,
    afterClose: PropTypes.func
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var _visible = true;
    var props = getOptionProps(this);
    if ('visible' in props) {
      _visible = this.visible;
    }
    warning(!('afterClose' in props), 'Tag', "'afterClose' will be deprecated, please use 'close' event, we will remove this in the next version.");
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
      if (!hasProp(this, 'visible')) {
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
      return _ref = {}, _defineProperty(_ref, prefixCls, true), _defineProperty(_ref, prefixCls + '-' + color, isPresetColor), _defineProperty(_ref, prefixCls + '-has-color', color && !isPresetColor), _ref;
    },
    renderCloseIcon: function renderCloseIcon() {
      var h = this.$createElement;
      var closable = this.$props.closable;

      return closable ? h(Icon, {
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
      _mergeJSXProps([{
        directives: [{
          name: 'show',
          value: visible
        }]
      }, { on: omit(getListeners(this), ['close']) }, {
        'class': this.getTagClassName(prefixCls),
        style: this.getTagStyle()
      }]),
      [this.$slots['default'], this.renderCloseIcon()]
    );
    var transitionProps = getTransitionProps(prefixCls + '-zoom', {
      appear: false
    });
    return h(Wave, [h(
      'transition',
      transitionProps,
      [tag]
    )]);
  }
};