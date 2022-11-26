'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormItemProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Col = require('../grid/Col');

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _FormItem = require('../form/FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
var FormItemProps = exports.FormItemProps = {
  id: _vueTypes2['default'].string,
  htmlFor: _vueTypes2['default'].string,
  prefixCls: _vueTypes2['default'].string,
  label: _vueTypes2['default'].any,
  help: _vueTypes2['default'].any,
  extra: _vueTypes2['default'].any,
  labelCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  wrapperCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  hasFeedback: _vueTypes2['default'].bool,
  colon: _vueTypes2['default'].bool,
  labelAlign: _vueTypes2['default'].oneOf(['left', 'right']),
  prop: _vueTypes2['default'].string,
  rules: _vueTypes2['default'].oneOfType([Array, Object]),
  autoLink: _vueTypes2['default'].bool,
  required: _vueTypes2['default'].bool,
  validateStatus: _vueTypes2['default'].oneOf(['', 'success', 'warning', 'error', 'validating'])
};

exports['default'] = {
  name: 'AFormModelItem',
  __ANT_NEW_FORM_ITEM: true,
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(FormItemProps, {
    hasFeedback: false,
    autoLink: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      this.initialValue = (0, _cloneDeep2['default'])(this.fieldValue);
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
      var validator = new _asyncValidator2['default'](descriptor);
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
        return (0, _extends3['default'])({}, rule);
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

    var props = (0, _propsUtil.getOptionProps)(this);
    var label = (0, _propsUtil.getComponentFromProp)(this, 'label');
    var extra = (0, _propsUtil.getComponentFromProp)(this, 'extra');
    var help = (0, _propsUtil.getComponentFromProp)(this, 'help');
    var formProps = {
      props: (0, _extends3['default'])({}, props, {
        label: label,
        extra: extra,
        validateStatus: this.validateState,
        help: this.validateMessage || help,
        required: this.isRequired || props.required
      })
    };
    var children = (0, _propsUtil.filterEmpty)($scopedSlots['default'] ? $scopedSlots['default']() : $slots['default']);
    var firstChildren = children[0];
    if (this.prop && this.autoLink && (0, _propsUtil.isValidElement)(firstChildren)) {
      var originalEvents = (0, _propsUtil.getEvents)(firstChildren);
      var originalBlur = originalEvents.blur;
      var originalChange = originalEvents.change;
      firstChildren = (0, _vnode.cloneElement)(firstChildren, {
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
      _FormItem2['default'],
      formProps,
      [firstChildren, children.slice(1)]
    );
  }
};