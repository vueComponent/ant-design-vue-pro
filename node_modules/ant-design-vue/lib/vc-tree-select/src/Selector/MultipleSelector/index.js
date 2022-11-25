'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _util = require('../../util');

var _BaseSelector = require('../../Base/BaseSelector');

var _BaseSelector2 = _interopRequireDefault(_BaseSelector);

var _SearchInput = require('../../SearchInput');

var _SearchInput2 = _interopRequireDefault(_SearchInput);

var _Selection = require('./Selection');

var _Selection2 = _interopRequireDefault(_Selection);

var _propsUtil = require('../../../../_util/props-util');

var _getTransitionProps = require('../../../../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _BaseMixin = require('../../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

var Selector = (0, _BaseSelector2['default'])('multiple');

// export const multipleSelectorContextTypes = {
//   onMultipleSelectorRemove: PropTypes.func.isRequired,
// }

var MultipleSelector = {
  mixins: [_BaseMixin2['default']],
  props: (0, _extends3['default'])({}, (0, _BaseSelector.selectorPropTypes)(), _SearchInput2['default'].props, {
    selectorValueList: _vueTypes2['default'].array,
    disabled: _vueTypes2['default'].bool,
    searchValue: _vueTypes2['default'].string,
    labelInValue: _vueTypes2['default'].bool,
    maxTagCount: _vueTypes2['default'].number,
    maxTagPlaceholder: _vueTypes2['default'].any

    // onChoiceAnimationLeave: PropTypes.func,
  }),
  inject: {
    vcTreeSelect: { 'default': function _default() {
        return {};
      } }
  },
  created: function created() {
    this.inputRef = (0, _util.createRef)();
  },

  methods: {
    onPlaceholderClick: function onPlaceholderClick() {
      this.inputRef.current.focus();
    },
    focus: function focus() {
      this.inputRef.current.focus();
    },
    blur: function blur() {
      this.inputRef.current.blur();
    },
    _renderPlaceholder: function _renderPlaceholder() {
      var h = this.$createElement;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          placeholder = _$props.placeholder,
          searchPlaceholder = _$props.searchPlaceholder,
          searchValue = _$props.searchValue,
          selectorValueList = _$props.selectorValueList;


      var currentPlaceholder = placeholder || searchPlaceholder;

      if (!currentPlaceholder) return null;

      var hidden = searchValue || selectorValueList.length;

      // [Legacy] Not remove the placeholder
      return h(
        'span',
        {
          style: {
            display: hidden ? 'none' : 'block'
          },
          on: {
            'click': this.onPlaceholderClick
          },

          'class': prefixCls + '-search__field__placeholder'
        },
        [currentPlaceholder]
      );
    },
    onChoiceAnimationLeave: function onChoiceAnimationLeave() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.__emit.apply(this, ['choiceAnimationLeave'].concat((0, _toConsumableArray3['default'])(args)));
    },
    renderSelection: function renderSelection() {
      var _this = this;

      var h = this.$createElement;
      var _$props2 = this.$props,
          selectorValueList = _$props2.selectorValueList,
          choiceTransitionName = _$props2.choiceTransitionName,
          prefixCls = _$props2.prefixCls,
          labelInValue = _$props2.labelInValue,
          maxTagCount = _$props2.maxTagCount;
      var onMultipleSelectorRemove = this.vcTreeSelect.onMultipleSelectorRemove,
          $slots = this.$slots;

      var listeners = (0, _propsUtil.getListeners)(this);
      // Check if `maxTagCount` is set
      var myValueList = selectorValueList;
      if (maxTagCount >= 0) {
        myValueList = selectorValueList.slice(0, maxTagCount);
      }
      // Selector node list
      var selectedValueNodes = myValueList.map(function (_ref) {
        var label = _ref.label,
            value = _ref.value;
        return h(
          _Selection2['default'],
          (0, _babelHelperVueJsxMergeProps2['default'])([{
            props: (0, _extends3['default'])({}, _this.$props, {
              label: label,
              value: value
            }),
            on: (0, _extends3['default'])({}, listeners, { remove: onMultipleSelectorRemove })
          }, {
            key: value || TREE_SELECT_EMPTY_VALUE_KEY
          }]),
          [$slots['default']]
        );
      });

      // Rest node count
      if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
        var content = '+ ' + (selectorValueList.length - maxTagCount) + ' ...';
        var maxTagPlaceholder = (0, _propsUtil.getComponentFromProp)(this, 'maxTagPlaceholder', {}, false);
        if (typeof maxTagPlaceholder === 'string') {
          content = maxTagPlaceholder;
        } else if (typeof maxTagPlaceholder === 'function') {
          var restValueList = selectorValueList.slice(maxTagCount);
          content = maxTagPlaceholder(labelInValue ? restValueList : restValueList.map(function (_ref2) {
            var value = _ref2.value;
            return value;
          }));
        }

        var restNodeSelect = h(
          _Selection2['default'],
          (0, _babelHelperVueJsxMergeProps2['default'])([{
            props: (0, _extends3['default'])({}, this.$props, {
              label: content,
              value: null
            }),
            on: listeners
          }, {
            key: 'rc-tree-select-internal-max-tag-counter'
          }]),
          [$slots['default']]
        );

        selectedValueNodes.push(restNodeSelect);
      }

      selectedValueNodes.push(h(
        'li',
        { 'class': prefixCls + '-search ' + prefixCls + '-search--inline', key: '__input' },
        [h(
          _SearchInput2['default'],
          {
            props: (0, _extends3['default'])({}, this.$props, {
              needAlign: true
            }),
            on: listeners,
            directives: [{
              name: 'ant-ref',
              value: this.inputRef
            }]
          },
          [$slots['default']]
        )]
      ));
      var className = prefixCls + '-selection__rendered';
      if (choiceTransitionName) {
        var transitionProps = (0, _getTransitionProps2['default'])(choiceTransitionName, {
          tag: 'ul',
          afterLeave: this.onChoiceAnimationLeave
        });
        return h(
          'transition-group',
          (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': className }, transitionProps]),
          [selectedValueNodes]
        );
      }
      return h(
        'ul',
        { 'class': className, attrs: { role: 'menubar' }
        },
        [selectedValueNodes]
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        $props = this.$props;

    var listeners = (0, _propsUtil.getListeners)(this);
    var _$props$showArrow = $props.showArrow,
        showArrow = _$props$showArrow === undefined ? false : _$props$showArrow;

    return h(
      Selector,
      {
        props: (0, _extends3['default'])({}, this.$props, {
          showArrow: showArrow,
          tabIndex: -1,
          renderSelection: this.renderSelection,
          renderPlaceholder: this._renderPlaceholder
        }),
        on: listeners
      },
      [$slots['default']]
    );
  }
};

exports['default'] = MultipleSelector;