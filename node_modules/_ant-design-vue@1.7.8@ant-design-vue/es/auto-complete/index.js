import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import { Option, OptGroup } from '../vc-select';
import Select, { AbstractSelectProps, SelectValue } from '../select';
import Input from '../input';
import InputElement from './InputElement';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getComponentFromProp, getOptionProps, filterEmpty, isValidElement, getListeners } from '../_util/props-util';
import Base from '../base';

// const DataSourceItemObject = PropTypes.shape({
//   value: String,
//   text: String,
// }).loose
// const DataSourceItemType = PropTypes.oneOfType([
//   PropTypes.string,
//   DataSourceItemObject,
// ]).isRequired

// export interface AutoCompleteInputProps {
//   onChange?: React.FormEventHandler<any>;
//   value: any;
// }

var AutoCompleteProps = _extends({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  dataSource: PropTypes.array,
  dropdownMenuStyle: PropTypes.object,
  optionLabelProp: String,
  dropdownMatchSelectWidth: PropTypes.bool
  // onChange?: (value: SelectValue) => void;
  // onSelect?: (value: SelectValue, option: Object) => any;
});

var AutoComplete = {
  name: 'AAutoComplete',
  props: _extends({}, AutoCompleteProps, {
    prefixCls: PropTypes.string,
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom'),
    autoFocus: PropTypes.bool,
    backfill: PropTypes.bool,
    optionLabelProp: PropTypes.string.def('children'),
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(false),
    defaultActiveFirstOption: PropTypes.bool.def(true)
  }),
  Option: _extends({}, Option, { name: 'AAutoCompleteOption' }),
  OptGroup: _extends({}, OptGroup, { name: 'AAutoCompleteOptGroup' }),
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  methods: {
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    getInputElement: function getInputElement() {
      var h = this.$createElement;
      var $slots = this.$slots,
          placeholder = this.placeholder;

      var children = filterEmpty($slots['default']);
      var element = children.length ? children[0] : h(Input, {
        attrs: { lazy: false }
      });
      return h(
        InputElement,
        {
          attrs: { placeholder: placeholder }
        },
        [element]
      );
    },
    focus: function focus() {
      if (this.$refs.select) {
        this.$refs.select.focus();
      }
    },
    blur: function blur() {
      if (this.$refs.select) {
        this.$refs.select.blur();
      }
    }
  },

  render: function render() {
    var _cls;

    var h = arguments[0];
    var size = this.size,
        customizePrefixCls = this.prefixCls,
        optionLabelProp = this.optionLabelProp,
        dataSource = this.dataSource,
        $slots = this.$slots;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('select', customizePrefixCls);

    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _defineProperty(_cls, prefixCls + '-show-search', true), _defineProperty(_cls, prefixCls + '-auto-complete', true), _cls);

    var options = void 0;
    var childArray = filterEmpty($slots.dataSource);
    if (childArray.length) {
      options = childArray;
    } else {
      options = dataSource ? dataSource.map(function (item) {
        if (isValidElement(item)) {
          return item;
        }
        switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
          case 'string':
            return h(
              Option,
              { key: item },
              [item]
            );
          case 'object':
            return h(
              Option,
              { key: item.value },
              [item.text]
            );
          default:
            throw new Error('AutoComplete[dataSource] only supports type `string[] | Object[]`.');
        }
      }) : [];
    }
    var selectProps = {
      props: _extends({}, getOptionProps(this), {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        optionLabelProp: optionLabelProp,
        getInputElement: this.getInputElement,
        notFoundContent: getComponentFromProp(this, 'notFoundContent'),
        placeholder: ''
      }),
      'class': cls,
      ref: 'select',
      on: getListeners(this)
    };
    return h(
      Select,
      selectProps,
      [options]
    );
  }
};

/* istanbul ignore next */
AutoComplete.install = function (Vue) {
  Vue.use(Base);
  Vue.component(AutoComplete.name, AutoComplete);
  Vue.component(AutoComplete.Option.name, AutoComplete.Option);
  Vue.component(AutoComplete.OptGroup.name, AutoComplete.OptGroup);
};

export default AutoComplete;