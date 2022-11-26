'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRule = exports.FormProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Col = require('../grid/Col');

var _isRegExp = require('lodash/isRegExp');

var _isRegExp2 = _interopRequireDefault(_isRegExp);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _FormItem = require('./FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FormProps = exports.FormProps = {
  layout: _vueTypes2['default'].oneOf(['horizontal', 'inline', 'vertical']),
  labelCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  wrapperCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  colon: _vueTypes2['default'].bool,
  labelAlign: _vueTypes2['default'].oneOf(['left', 'right']),
  prefixCls: _vueTypes2['default'].string,
  hideRequiredMark: _vueTypes2['default'].bool,
  model: _vueTypes2['default'].object,
  rules: _vueTypes2['default'].object,
  validateMessages: _vueTypes2['default'].any,
  validateOnRuleChange: _vueTypes2['default'].bool
};

var ValidationRule = exports.ValidationRule = {
  /** validation error message */
  message: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func]),
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type: _vueTypes2['default'].string,
  /** indicates whether field is required */
  required: _vueTypes2['default'].boolean,
  /** treat required fields that only contain whitespace as errors */
  whitespace: _vueTypes2['default'].boolean,
  /** validate the exact length of a field */
  len: _vueTypes2['default'].number,
  /** validate the min length of a field */
  min: _vueTypes2['default'].number,
  /** validate the max length of a field */
  max: _vueTypes2['default'].number,
  /** validate the value from a list of possible values */
  'enum': _vueTypes2['default'].oneOfType([String, _vueTypes2['default'].arrayOf(String)]),
  /** validate from a regular expression */
  pattern: _vueTypes2['default'].custom(_isRegExp2['default']),
  /** transform a value before validation */
  transform: _vueTypes2['default'].func,
  /** custom validate function (Note: callback must be called) */
  validator: _vueTypes2['default'].func
};

var Form = {
  name: 'AFormModel',
  props: (0, _propsUtil.initDefaultProps)(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
    validateOnRuleChange: false
  }),
  Item: _FormItem2['default'],
  created: function created() {
    this.fields = [];
  },
  provide: function provide() {
    return {
      FormContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  watch: {
    rules: function rules() {
      if (this.validateOnRuleChange) {
        this.validate(function () {});
      }
    }
  },
  computed: {
    vertical: function vertical() {
      return this.layout === 'vertical';
    }
  },
  methods: {
    addField: function addField(field) {
      if (field) {
        this.fields.push(field);
      }
    },
    removeField: function removeField(field) {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    },
    onSubmit: function onSubmit(e) {
      if (!(0, _propsUtil.getListeners)(this).submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    },
    resetFields: function resetFields() {
      if (!this.model) {
        (0, _warning2['default'])(false, 'FormModel', 'model is required for resetFields to work.');
        return;
      }
      this.fields.forEach(function (field) {
        field.resetField();
      });
    },
    clearValidate: function clearValidate() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var fields = props.length ? typeof props === 'string' ? this.fields.filter(function (field) {
        return props === field.prop;
      }) : this.fields.filter(function (field) {
        return props.indexOf(field.prop) > -1;
      }) : this.fields;
      fields.forEach(function (field) {
        field.clearValidate();
      });
    },
    validate: function validate(callback) {
      var _this = this;

      if (!this.model) {
        (0, _warning2['default'])(false, 'FormModel', 'model is required for resetFields to work.');
        return;
      }
      var promise = void 0;
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise(function (resolve, reject) {
          callback = function callback(valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }
      var valid = true;
      var count = 0;
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      var invalidFields = {};
      this.fields.forEach(function (field) {
        field.validate('', function (message, field) {
          if (message) {
            valid = false;
          }
          invalidFields = (0, _extends3['default'])({}, invalidFields, field);
          if (typeof callback === 'function' && ++count === _this.fields.length) {
            callback(valid, invalidFields);
          }
        });
      });
      if (promise) {
        return promise;
      }
    },
    validateField: function validateField(props, cb) {
      props = [].concat(props);
      var fields = this.fields.filter(function (field) {
        return props.indexOf(field.prop) !== -1;
      });
      if (!fields.length) {
        (0, _warning2['default'])(false, 'FormModel', 'please pass correct props!');
        return;
      }
      fields.forEach(function (field) {
        field.validate('', cb);
      });
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        hideRequiredMark = this.hideRequiredMark,
        layout = this.layout,
        onSubmit = this.onSubmit,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('form', customizePrefixCls);

    var formClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-horizontal', layout === 'horizontal'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-vertical', layout === 'vertical'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-inline', layout === 'inline'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-hide-required-mark', hideRequiredMark), _classNames));
    return h(
      'form',
      {
        on: {
          'submit': onSubmit
        },
        'class': formClassName },
      [$slots['default']]
    );
  }
};

exports['default'] = Form;