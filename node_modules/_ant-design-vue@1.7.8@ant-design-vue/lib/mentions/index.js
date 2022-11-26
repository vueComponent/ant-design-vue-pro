'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcMentions = require('../vc-mentions');

var _vcMentions2 = _interopRequireDefault(_vcMentions);

var _mentionsProps = require('../vc-mentions/src/mentionsProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _spin = require('../spin');

var _spin2 = _interopRequireDefault(_spin);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Option = _vcMentions2['default'].Option;


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
  mixins: [_BaseMixin2['default']],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  Option: (0, _extends3['default'])({}, Option, { name: 'AMentionsOption' }),
  getMentions: getMentions,
  props: (0, _extends3['default'])({}, _mentionsProps.mentionsProps, {
    loading: _vueTypes2['default'].bool
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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

      this.$emit.apply(this, ['focus'].concat((0, _toConsumableArray3['default'])(args)));
      this.setState({
        focused: true
      });
    },
    onBlur: function onBlur() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.$emit.apply(this, ['blur'].concat((0, _toConsumableArray3['default'])(args)));
      this.setState({
        focused: false
      });
    },
    onSelect: function onSelect() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.$emit.apply(this, ['select'].concat((0, _toConsumableArray3['default'])(args)));
      this.setState({
        focused: true
      });
    },
    onChange: function onChange(val) {
      this.$emit('change', val);
    },
    getNotFoundContent: function getNotFoundContent(renderEmpty) {
      var h = this.$createElement;
      var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty(h, 'Select');
    },
    getOptions: function getOptions() {
      var h = this.$createElement;
      var loading = this.$props.loading;

      var children = (0, _propsUtil.filterEmpty)(this.$slots['default'] || []);

      if (loading) {
        return h(
          Option,
          {
            attrs: { value: 'ANTD_SEARCHING', disabled: true }
          },
          [h(_spin2['default'], {
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

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        disabled = _getOptionProps.disabled,
        getPopupContainer = _getOptionProps.getPopupContainer,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'disabled', 'getPopupContainer']);

    var prefixCls = getPrefixCls('mentions', customizePrefixCls);
    var otherProps = (0, _omit2['default'])(restProps, ['loading']);

    var mergedClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-focused', focused), _classNames));

    var mentionsProps = {
      props: (0, _extends3['default'])({
        prefixCls: prefixCls,
        notFoundContent: this.getNotFoundContent(renderEmpty)
      }, otherProps, {
        disabled: disabled,
        filterOption: this.getFilterOption(),
        getPopupContainer: getPopupContainer,
        children: this.getOptions()
      }),
      'class': mergedClassName,
      attrs: (0, _extends3['default'])({ rows: 1 }, this.$attrs),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        change: this.onChange,
        select: this.onSelect,
        focus: this.onFocus,
        blur: this.onBlur
      }),
      ref: 'vcMentions'
    };

    return h(_vcMentions2['default'], mentionsProps);
  }
};

/* istanbul ignore next */
Mentions.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Mentions.name, Mentions);
  Vue.component(Mentions.Option.name, Mentions.Option);
};

exports['default'] = Mentions;