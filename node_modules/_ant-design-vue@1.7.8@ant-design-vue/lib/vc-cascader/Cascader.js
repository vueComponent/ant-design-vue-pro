'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _propsUtil = require('../_util/props-util');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTrigger = require('../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _Menus = require('./Menus');

var _Menus2 = _interopRequireDefault(_Menus);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _arrays = require('shallow-equal/arrays');

var _arrays2 = _interopRequireDefault(_arrays);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  }
};

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: _vueTypes2['default'].array,
    defaultValue: _vueTypes2['default'].array,
    options: _vueTypes2['default'].array,
    // onChange: PropTypes.func,
    // onPopupVisibleChange: PropTypes.func,
    popupVisible: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool.def(false),
    transitionName: _vueTypes2['default'].string.def(''),
    popupClassName: _vueTypes2['default'].string.def(''),
    popupStyle: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    popupPlacement: _vueTypes2['default'].string.def('bottomLeft'),
    prefixCls: _vueTypes2['default'].string.def('rc-cascader'),
    dropdownMenuColumnStyle: _vueTypes2['default'].object,
    builtinPlacements: _vueTypes2['default'].object.def(BUILT_IN_PLACEMENTS),
    loadData: _vueTypes2['default'].func,
    changeOnSelect: _vueTypes2['default'].bool,
    // onKeyDown: PropTypes.func,
    expandTrigger: _vueTypes2['default'].string.def('click'),
    fieldNames: _vueTypes2['default'].object.def(function () {
      return {
        label: 'label',
        value: 'value',
        children: 'children'
      };
    }),
    expandIcon: _vueTypes2['default'].any,
    loadingIcon: _vueTypes2['default'].any,
    getPopupContainer: _vueTypes2['default'].func
  },
  data: function data() {
    var initialValue = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        popupVisible = this.popupVisible;

    if ((0, _propsUtil.hasProp)(this, 'value')) {
      initialValue = value || [];
    } else if ((0, _propsUtil.hasProp)(this, 'defaultValue')) {
      initialValue = defaultValue || [];
    }
    // warning(!('filedNames' in props),
    //   '`filedNames` of Cascader is a typo usage and deprecated, please use `fieldNames` instead.');

    return {
      sPopupVisible: popupVisible,
      sActiveValue: initialValue,
      sValue: initialValue
    };
  },

  watch: {
    value: function value(val, oldValue) {
      if (!(0, _arrays2['default'])(val, oldValue)) {
        var newValues = {
          sValue: val || []
        };
        // allow activeValue diff from value
        // https://github.com/ant-design/ant-design/issues/2767
        if (!(0, _propsUtil.hasProp)(this, 'loadData')) {
          newValues.sActiveValue = val || [];
        }
        this.setState(newValues);
      }
    },
    popupVisible: function popupVisible(val) {
      this.setState({
        sPopupVisible: val
      });
    }
  },
  methods: {
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    getFieldName: function getFieldName(name) {
      var defaultFieldNames = this.defaultFieldNames,
          fieldNames = this.fieldNames;

      return fieldNames[name] || defaultFieldNames[name];
    },
    getFieldNames: function getFieldNames() {
      return this.fieldNames;
    },
    getCurrentLevelOptions: function getCurrentLevelOptions() {
      var _this = this;

      var _options = this.options,
          options = _options === undefined ? [] : _options,
          _sActiveValue = this.sActiveValue,
          sActiveValue = _sActiveValue === undefined ? [] : _sActiveValue;

      var result = (0, _arrayTreeFilter2['default'])(options, function (o, level) {
        return o[_this.getFieldName('value')] === sActiveValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
      if (result[result.length - 2]) {
        return result[result.length - 2][this.getFieldName('children')];
      }
      return [].concat((0, _toConsumableArray3['default'])(options)).filter(function (o) {
        return !o.disabled;
      });
    },
    getActiveOptions: function getActiveOptions(activeValue) {
      var _this2 = this;

      return (0, _arrayTreeFilter2['default'])(this.options || [], function (o, level) {
        return o[_this2.getFieldName('value')] === activeValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
    },
    setPopupVisible: function setPopupVisible(popupVisible) {
      if (!(0, _propsUtil.hasProp)(this, 'popupVisible')) {
        this.setState({ sPopupVisible: popupVisible });
      }
      // sync activeValue with value when panel open
      if (popupVisible && !this.sPopupVisible) {
        this.setState({
          sActiveValue: this.sValue
        });
      }
      this.__emit('popupVisibleChange', popupVisible);
    },
    handleChange: function handleChange(options, setProps, e) {
      var _this3 = this;

      if (e.type !== 'keydown' || e.keyCode === _KeyCode2['default'].ENTER) {
        this.__emit('change', options.map(function (o) {
          return o[_this3.getFieldName('value')];
        }), options);
        this.setPopupVisible(setProps.visible);
      }
    },
    handlePopupVisibleChange: function handlePopupVisibleChange(popupVisible) {
      this.setPopupVisible(popupVisible);
    },
    handleMenuSelect: function handleMenuSelect(targetOption, menuIndex, e) {
      // Keep focused state for keyboard support
      var triggerNode = this.$refs.trigger.getRootDomNode();
      if (triggerNode && triggerNode.focus) {
        triggerNode.focus();
      }
      var changeOnSelect = this.changeOnSelect,
          loadData = this.loadData,
          expandTrigger = this.expandTrigger;

      if (!targetOption || targetOption.disabled) {
        return;
      }
      var sActiveValue = this.sActiveValue;

      sActiveValue = sActiveValue.slice(0, menuIndex + 1);
      sActiveValue[menuIndex] = targetOption[this.getFieldName('value')];
      var activeOptions = this.getActiveOptions(sActiveValue);
      if (targetOption.isLeaf === false && !targetOption[this.getFieldName('children')] && loadData) {
        if (changeOnSelect) {
          this.handleChange(activeOptions, { visible: true }, e);
        }
        this.setState({ sActiveValue: sActiveValue });
        loadData(activeOptions);
        return;
      }
      var newState = {};
      if (!targetOption[this.getFieldName('children')] || !targetOption[this.getFieldName('children')].length) {
        this.handleChange(activeOptions, { visible: false }, e);
        // set value to activeValue when select leaf option
        newState.sValue = sActiveValue;
        // add e.type judgement to prevent `onChange` being triggered by mouseEnter
      } else if (changeOnSelect && (e.type === 'click' || e.type === 'keydown')) {
        if (expandTrigger === 'hover') {
          this.handleChange(activeOptions, { visible: false }, e);
        } else {
          this.handleChange(activeOptions, { visible: true }, e);
        }
        // set value to activeValue on every select
        newState.sValue = sActiveValue;
      }
      newState.sActiveValue = sActiveValue;
      //  not change the value by keyboard
      if ((0, _propsUtil.hasProp)(this, 'value') || e.type === 'keydown' && e.keyCode !== _KeyCode2['default'].ENTER) {
        delete newState.sValue;
      }
      this.setState(newState);
    },
    handleItemDoubleClick: function handleItemDoubleClick() {
      var changeOnSelect = this.$props.changeOnSelect;

      if (changeOnSelect) {
        this.setPopupVisible(false);
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      var _this4 = this;

      var $slots = this.$slots;

      var children = $slots['default'] && $slots['default'][0];
      // https://github.com/ant-design/ant-design/issues/6717
      // Don't bind keyboard support when children specify the onKeyDown
      if (children) {
        var keydown = (0, _propsUtil.getEvents)(children).keydown;
        if (keydown) {
          keydown(e);
          return;
        }
      }
      var activeValue = [].concat((0, _toConsumableArray3['default'])(this.sActiveValue));
      var currentLevel = activeValue.length - 1 < 0 ? 0 : activeValue.length - 1;
      var currentOptions = this.getCurrentLevelOptions();
      var currentIndex = currentOptions.map(function (o) {
        return o[_this4.getFieldName('value')];
      }).indexOf(activeValue[currentLevel]);
      if (e.keyCode !== _KeyCode2['default'].DOWN && e.keyCode !== _KeyCode2['default'].UP && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ENTER && e.keyCode !== _KeyCode2['default'].SPACE && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].ESC && e.keyCode !== _KeyCode2['default'].TAB) {
        return;
      }
      // Press any keys above to reopen menu
      if (!this.sPopupVisible && e.keyCode !== _KeyCode2['default'].BACKSPACE && e.keyCode !== _KeyCode2['default'].LEFT && e.keyCode !== _KeyCode2['default'].RIGHT && e.keyCode !== _KeyCode2['default'].ESC && e.keyCode !== _KeyCode2['default'].TAB) {
        this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === _KeyCode2['default'].DOWN || e.keyCode === _KeyCode2['default'].UP) {
        e.preventDefault();
        var nextIndex = currentIndex;
        if (nextIndex !== -1) {
          if (e.keyCode === _KeyCode2['default'].DOWN) {
            nextIndex += 1;
            nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
          } else {
            nextIndex -= 1;
            nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
          }
        } else {
          nextIndex = 0;
        }
        activeValue[currentLevel] = currentOptions[nextIndex][this.getFieldName('value')];
      } else if (e.keyCode === _KeyCode2['default'].LEFT || e.keyCode === _KeyCode2['default'].BACKSPACE) {
        e.preventDefault();
        activeValue.splice(activeValue.length - 1, 1);
      } else if (e.keyCode === _KeyCode2['default'].RIGHT) {
        e.preventDefault();
        if (currentOptions[currentIndex] && currentOptions[currentIndex][this.getFieldName('children')]) {
          activeValue.push(currentOptions[currentIndex][this.getFieldName('children')][0][this.getFieldName('value')]);
        }
      } else if (e.keyCode === _KeyCode2['default'].ESC || e.keyCode === _KeyCode2['default'].TAB) {
        this.setPopupVisible(false);
        return;
      }
      if (!activeValue || activeValue.length === 0) {
        this.setPopupVisible(false);
      }
      var activeOptions = this.getActiveOptions(activeValue);
      var targetOption = activeOptions[activeOptions.length - 1];
      this.handleMenuSelect(targetOption, activeOptions.length - 1, e);
      this.__emit('keydown', e);
    }
  },

  render: function render() {
    var h = arguments[0];
    var $props = this.$props,
        sActiveValue = this.sActiveValue,
        handleMenuSelect = this.handleMenuSelect,
        sPopupVisible = this.sPopupVisible,
        handlePopupVisibleChange = this.handlePopupVisibleChange,
        handleKeyDown = this.handleKeyDown;

    var listeners = (0, _propsUtil.getListeners)(this);
    var prefixCls = $props.prefixCls,
        transitionName = $props.transitionName,
        popupClassName = $props.popupClassName,
        _$props$options = $props.options,
        options = _$props$options === undefined ? [] : _$props$options,
        disabled = $props.disabled,
        builtinPlacements = $props.builtinPlacements,
        popupPlacement = $props.popupPlacement,
        restProps = (0, _objectWithoutProperties3['default'])($props, ['prefixCls', 'transitionName', 'popupClassName', 'options', 'disabled', 'builtinPlacements', 'popupPlacement']);
    // Did not show popup when there is no options

    var menus = h('div');
    var emptyMenuClassName = '';
    if (options && options.length > 0) {
      var loadingIcon = (0, _propsUtil.getComponentFromProp)(this, 'loadingIcon');
      var expandIcon = (0, _propsUtil.getComponentFromProp)(this, 'expandIcon') || '>';
      var menusProps = {
        props: (0, _extends3['default'])({}, $props, {
          fieldNames: this.getFieldNames(),
          defaultFieldNames: this.defaultFieldNames,
          activeValue: sActiveValue,
          visible: sPopupVisible,
          loadingIcon: loadingIcon,
          expandIcon: expandIcon
        }),
        on: (0, _extends3['default'])({}, listeners, {
          select: handleMenuSelect,
          itemDoubleClick: this.handleItemDoubleClick
        })
      };
      menus = h(_Menus2['default'], menusProps);
    } else {
      emptyMenuClassName = ' ' + prefixCls + '-menus-empty';
    }
    var triggerProps = {
      props: (0, _extends3['default'])({}, restProps, {
        disabled: disabled,
        popupPlacement: popupPlacement,
        builtinPlacements: builtinPlacements,
        popupTransitionName: transitionName,
        action: disabled ? [] : ['click'],
        popupVisible: disabled ? false : sPopupVisible,
        prefixCls: prefixCls + '-menus',
        popupClassName: popupClassName + emptyMenuClassName
      }),
      on: (0, _extends3['default'])({}, listeners, {
        popupVisibleChange: handlePopupVisibleChange
      }),
      ref: 'trigger'
    };
    var children = (0, _propsUtil.getSlot)(this, 'default')[0];
    return h(
      _vcTrigger2['default'],
      triggerProps,
      [children && (0, _vnode.cloneElement)(children, {
        on: {
          keydown: handleKeyDown
        },
        attrs: {
          tabIndex: disabled ? undefined : 0
        }
      }), h(
        'template',
        { slot: 'popup' },
        [menus]
      )]
    );
  }
};