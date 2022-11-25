import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../../../_util/vue-types';
import { createRef } from '../../util';
import generateSelector, { selectorPropTypes } from '../../Base/BaseSelector';
import SearchInput from '../../SearchInput';
import Selection from './Selection';
import { getComponentFromProp, getListeners } from '../../../../_util/props-util';
import getTransitionProps from '../../../../_util/getTransitionProps';
import BaseMixin from '../../../../_util/BaseMixin';
var TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

var Selector = generateSelector('multiple');

// export const multipleSelectorContextTypes = {
//   onMultipleSelectorRemove: PropTypes.func.isRequired,
// }

var MultipleSelector = {
  mixins: [BaseMixin],
  props: _extends({}, selectorPropTypes(), SearchInput.props, {
    selectorValueList: PropTypes.array,
    disabled: PropTypes.bool,
    searchValue: PropTypes.string,
    labelInValue: PropTypes.bool,
    maxTagCount: PropTypes.number,
    maxTagPlaceholder: PropTypes.any

    // onChoiceAnimationLeave: PropTypes.func,
  }),
  inject: {
    vcTreeSelect: { 'default': function _default() {
        return {};
      } }
  },
  created: function created() {
    this.inputRef = createRef();
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

      this.__emit.apply(this, ['choiceAnimationLeave'].concat(_toConsumableArray(args)));
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

      var listeners = getListeners(this);
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
          Selection,
          _mergeJSXProps([{
            props: _extends({}, _this.$props, {
              label: label,
              value: value
            }),
            on: _extends({}, listeners, { remove: onMultipleSelectorRemove })
          }, {
            key: value || TREE_SELECT_EMPTY_VALUE_KEY
          }]),
          [$slots['default']]
        );
      });

      // Rest node count
      if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
        var content = '+ ' + (selectorValueList.length - maxTagCount) + ' ...';
        var maxTagPlaceholder = getComponentFromProp(this, 'maxTagPlaceholder', {}, false);
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
          Selection,
          _mergeJSXProps([{
            props: _extends({}, this.$props, {
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
          SearchInput,
          {
            props: _extends({}, this.$props, {
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
        var transitionProps = getTransitionProps(choiceTransitionName, {
          tag: 'ul',
          afterLeave: this.onChoiceAnimationLeave
        });
        return h(
          'transition-group',
          _mergeJSXProps([{ 'class': className }, transitionProps]),
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

    var listeners = getListeners(this);
    var _$props$showArrow = $props.showArrow,
        showArrow = _$props$showArrow === undefined ? false : _$props$showArrow;

    return h(
      Selector,
      {
        props: _extends({}, this.$props, {
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

export default MultipleSelector;