import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../../_util/vue-types';
import BasePopup from '../Base/BasePopup';
import SearchInput from '../SearchInput';
import { createRef } from '../util';
import { getListeners } from '../../../_util/props-util';

var SinglePopup = {
  name: 'SinglePopup',
  props: _extends({}, BasePopup.props, SearchInput.props, {
    searchValue: PropTypes.string,
    showSearch: PropTypes.bool,
    dropdownPrefixCls: PropTypes.string,
    disabled: PropTypes.bool,
    searchPlaceholder: PropTypes.string
  }),
  created: function created() {
    this.inputRef = createRef();
    this.searchRef = createRef();
    this.popupRef = createRef();
  },

  methods: {
    onPlaceholderClick: function onPlaceholderClick() {
      this.inputRef.current.focus();
    },
    getTree: function getTree() {
      return this.popupRef.current && this.popupRef.current.getTree();
    },
    _renderPlaceholder: function _renderPlaceholder() {
      var h = this.$createElement;
      var _$props = this.$props,
          searchPlaceholder = _$props.searchPlaceholder,
          searchValue = _$props.searchValue,
          prefixCls = _$props.prefixCls;


      if (!searchPlaceholder) {
        return null;
      }

      return h(
        'span',
        {
          style: {
            display: searchValue ? 'none' : 'block'
          },
          on: {
            'click': this.onPlaceholderClick
          },

          'class': prefixCls + '-search__field__placeholder'
        },
        [searchPlaceholder]
      );
    },
    _renderSearch: function _renderSearch() {
      var h = this.$createElement;
      var _$props2 = this.$props,
          showSearch = _$props2.showSearch,
          dropdownPrefixCls = _$props2.dropdownPrefixCls;


      if (!showSearch) {
        return null;
      }

      return h(
        'span',
        _mergeJSXProps([{
          'class': dropdownPrefixCls + '-search'
        }, {
          directives: [{
            name: 'ant-ref',
            value: this.searchRef
          }]
        }]),
        [h(SearchInput, {
          props: _extends({}, this.$props, { renderPlaceholder: this._renderPlaceholder }),
          on: getListeners(this),
          directives: [{
            name: 'ant-ref',
            value: this.inputRef
          }]
        })]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(BasePopup, {
      props: _extends({}, this.$props, { renderSearch: this._renderSearch, __propsSymbol__: Symbol() }),
      on: getListeners(this),
      directives: [{
        name: 'ant-ref',
        value: this.popupRef
      }]
    });
  }
};

export default SinglePopup;