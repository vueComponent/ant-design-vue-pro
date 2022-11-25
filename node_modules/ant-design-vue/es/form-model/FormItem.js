import _extends from 'babel-runtime/helpers/extends';
import AsyncValidator from 'async-validator';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from '../_util/vue-types';
import { ColProps } from '../grid/Col';
import { initDefaultProps, getComponentFromProp, getOptionProps, getEvents, filterEmpty, isValidElement } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import FormItem from '../form/FormItem';
import { cloneElement } from '../_util/vnode';

function noop() {}

function getPropByPath(obj, path, strict) {
  var tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  var keyArr = path.split('.');
  var i = 0;
  for (var len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    var key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
}
export var FormItemProps = {
  id: PropTypes.string,
  htmlFor: PropTypes.string,
  prefixCls: PropTypes.string,
  label: PropTypes.any,
  help: PropTypes.any,
  extra: PropTypes.any,
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  hasFeedback: PropTypes.bool,
  colon: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  prop: PropTypes.string,
  rules: PropTypes.oneOfType([Array, Object]),
  autoLink: PropTypes.bool,
  required: PropTypes.bool,
  validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating'])
};

export default {
  name: 'AFormModelItem',
  __ANT_NEW_FORM_ITEM: true,
  mixins: [BaseMixin],
  props: initDefaultProps(FormItemProps, {
    hasFeedback: false,
    autoLink: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } },
    FormContext: { 'default': function _default() {
        return {};
      } }
  },
  data: function data() {
    return {
      validateState: this.validateStatus,
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    };
  },


  computed: {
    fieldValue: function fieldValue() {
      var model = this.FormContext.model;
      if (!model || !this.prop) {
        return;
      }
      var path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/g, '.');
      }
      return getPropByPath(model, path, true).v;
    },
    isRequired: function isRequired() {
      var rules = this.getRules();
      var isRequired = false;
      if (rules && rules.length) {
        rules.every(function (rule) {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    }
  },
  watch: {
    validateStatus: function validateStatus(val) {
      this.validateState = val;
    }
  },
  mounted: function mounted() {
    if (this.prop) {
      var addField = this.FormContext.addField;

      addField && addField(this);
      this.initialValue = cloneDeep(this.fieldValue);
    }
  },
  beforeDestroy: function beforeDestroy() {
    var removeField = this.FormContext.removeField;

    removeField && removeField(this);
  },

  methods: {
    validate: function validate(trigger) {
      var _this = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      this.validateDisabled = false;
      var rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
        callback();
        return true;
      }
      this.validateState = 'validating';
      var descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(function (rule) {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;
      var validator = new AsyncValidator(descriptor);
      if (this.FormContext && this.FormContext.validateMessages) {
        validator.messages(this.FormContext.validateMessages);
      }
      var model = {};
      model[this.prop] = this.fieldValue;
      validator.validate(model, { firstFields: true }, function (errors, invalidFields) {
        _this.validateState = errors ? 'error' : 'success';
        _this.validateMessage = errors ? errors[0].message : '';
        callback(_this.validateMessage, invalidFields);
        _this.FormContext && _this.FormContext.$emit && _this.FormContext.$emit('validate', _this.prop, !errors, _this.validateMessage || null);
      });
    },
    getRules: function getRules() {
      var formRules = this.FormContext.rules;
      var selfRules = this.rules;
      var requiredRule = this.required !== undefined ? { required: !!this.required, trigger: 'change' } : [];
      var prop = getPropByPath(formRules, this.prop || '');
      formRules = formRules ? prop.o[this.prop || ''] || prop.v : [];
      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    getFilteredRule: function getFilteredRule(trigger) {
      var rules = this.getRules();
      return rules.filter(function (rule) {
        if (!rule.trigger || trigger === '') return true;
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1;
        } else {
          return rule.trigger === trigger;
        }
      }).map(function (rule) {
        return _extends({}, rule);
      });
    },
    onFieldBlur: function onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange: function onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate('change');
    },
    clearValidate: function clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    },
    resetField: function resetField() {
      var _this2 = this;

      this.validateState = '';
      this.validateMessage = '';
      var model = this.FormContext.model || {};
      var value = this.fieldValue;
      var path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }
      var prop = getPropByPath(model, path, true);
      this.validateDisabled = true;
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        prop.o[prop.k] = this.initialValue;
      }
      // reset validateDisabled after onFieldChange triggered
      this.$nextTick(function () {
        _this2.validateDisabled = false;
      });
    }
  },
  render: function render() {
    var _this3 = this;

    var h = arguments[0];
    var $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;

    var props = getOptionProps(this);
    var label = getComponentFromProp(this, 'label');
    var extra = getComponentFromProp(this, 'extra');
    var help = getComponentFromProp(this, 'help');
    var formProps = {
      props: _extends({}, props, {
        label: label,
        extra: extra,
        validateStatus: this.validateState,
        help: this.validateMessage || help,
        required: this.isRequired || props.required
      })
    };
    var children = filterEmpty($scopedSlots['default'] ? $scopedSlots['default']() : $slots['default']);
    var firstChildren = children[0];
    if (this.prop && this.autoLink && isValidElement(firstChildren)) {
      var originalEvents = getEvents(firstChildren);
      var originalBlur = originalEvents.blur;
      var originalChange = originalEvents.change;
      firstChildren = cloneElement(firstChildren, {
        on: {
          blur: function blur() {
            originalBlur && originalBlur.apply(undefined, arguments);
            _this3.onFieldBlur();
          },
          change: function change() {
            if (Array.isArray(originalChange)) {
              for (var i = 0, l = originalChange.length; i < l; i++) {
                originalChange[i].apply(originalChange, arguments);
              }
            } else if (originalChange) {
              originalChange.apply(undefined, arguments);
            }
            _this3.onFieldChange();
          }
        }
      });
    }
    return h(
      FormItem,
      formProps,
      [firstChildren, children.slice(1)]
    );
  }
};