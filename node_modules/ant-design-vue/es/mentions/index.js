import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps } from '../vc-mentions/src/mentionsProps';
import Base from '../base';
import Spin from '../spin';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getOptionProps, getComponentFromProp, getListeners, filterEmpty } from '../_util/props-util';

var Option = VcMentions.Option;


function loadingFilterOption() {
  return true;
}

function getMentions() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var config = arguments[1];

  var _ref = config || {},
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === undefined ? '@' : _ref$prefix,
      _ref$split = _ref.split,
      split = _ref$split === undefined ? ' ' : _ref$split;

  var prefixList = Array.isArray(prefix) ? prefix : [prefix];

  return value.split(split).map(function () {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var hitPrefix = null;

    prefixList.some(function (prefixStr) {
      var startStr = str.slice(0, prefixStr.length);
      if (startStr === prefixStr) {
        hitPrefix = prefixStr;
        return true;
      }
      return false;
    });

    if (hitPrefix !== null) {
      return {
        prefix: hitPrefix,
        value: str.slice(hitPrefix.length)
      };
    }
    return null;
  }).filter(function (entity) {
    return !!entity && !!entity.value;
  });
}

var Mentions = {
  name: 'AMentions',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  Option: _extends({}, Option, { name: 'AMentionsOption' }),
  getMentions: getMentions,
  props: _extends({}, mentionsProps, {
    loading: PropTypes.bool
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      focused: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.focus();
      }
    });
  },

  methods: {
    onFocus: function onFocus() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.$emit.apply(this, ['focus'].concat(_toConsumableArray(args)));
      this.setState({
        focused: true
      });
    },
    onBlur: function onBlur() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.$emit.apply(this, ['blur'].concat(_toConsumableArray(args)));
      this.setState({
        focused: false
      });
    },
    onSelect: function onSelect() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.$emit.apply(this, ['select'].concat(_toConsumableArray(args)));
      this.setState({
        focused: true
      });
    },
    onChange: function onChange(val) {
      this.$emit('change', val);
    },
    getNotFoundContent: function getNotFoundContent(renderEmpty) {
      var h = this.$createElement;
      var notFoundContent = getComponentFromProp(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty(h, 'Select');
    },
    getOptions: function getOptions() {
      var h = this.$createElement;
      var loading = this.$props.loading;

      var children = filterEmpty(this.$slots['default'] || []);

      if (loading) {
        return h(
          Option,
          {
            attrs: { value: 'ANTD_SEARCHING', disabled: true }
          },
          [h(Spin, {
            attrs: { size: 'small' }
          })]
        );
      }
      return children;
    },
    getFilterOption: function getFilterOption() {
      var _$props = this.$props,
          filterOption = _$props.filterOption,
          loading = _$props.loading;

      if (loading) {
        return loadingFilterOption;
      }
      return filterOption;
    },
    focus: function focus() {
      this.$refs.vcMentions.focus();
    },
    blur: function blur() {
      this.$refs.vcMentions.blur();
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];
    var focused = this.$data.focused;
    var _configProvider = this.configProvider,
        getPrefixCls = _configProvider.getPrefixCls,
        renderEmpty = _configProvider.renderEmpty;

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled,
        getPopupContainer = _getOptionProps.getPopupContainer,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'disabled', 'getPopupContainer']);

    var prefixCls = getPrefixCls('mentions', customizePrefixCls);
    var otherProps = omit(restProps, ['loading']);

    var mergedClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-disabled', disabled), _defineProperty(_classNames, prefixCls + '-focused', focused), _classNames));

    var mentionsProps = {
      props: _extends({
        prefixCls: prefixCls,
        notFoundContent: this.getNotFoundContent(renderEmpty)
      }, otherProps, {
        disabled: disabled,
        filterOption: this.getFilterOption(),
        getPopupContainer: getPopupContainer,
        children: this.getOptions()
      }),
      'class': mergedClassName,
      attrs: _extends({ rows: 1 }, this.$attrs),
      on: _extends({}, getListeners(this), {
        change: this.onChange,
        select: this.onSelect,
        focus: this.onFocus,
        blur: this.onBlur
      }),
      ref: 'vcMentions'
    };

    return h(VcMentions, mentionsProps);
  }
};

/* istanbul ignore next */
Mentions.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Mentions.name, Mentions);
  Vue.component(Mentions.Option.name, Mentions.Option);
};

export default Mentions;