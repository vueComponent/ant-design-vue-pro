import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { ColProps } from '../grid/Col';
import isRegExp from 'lodash/isRegExp';
import warning from '../_util/warning';
import FormItem from './FormItem';
import { initDefaultProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var FormProps = {
  layout: PropTypes.oneOf(['horizontal', 'inline', 'vertical']),
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  colon: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  prefixCls: PropTypes.string,
  hideRequiredMark: PropTypes.bool,
  model: PropTypes.object,
  rules: PropTypes.object,
  validateMessages: PropTypes.any,
  validateOnRuleChange: PropTypes.bool
};

export var ValidationRule = {
  /** validation error message */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type: PropTypes.string,
  /** indicates whether field is required */
  required: PropTypes.boolean,
  /** treat required fields that only contain whitespace as errors */
  whitespace: PropTypes.boolean,
  /** validate the exact length of a field */
  len: PropTypes.number,
  /** validate the min length of a field */
  min: PropTypes.number,
  /** validate the max length of a field */
  max: PropTypes.number,
  /** validate the value from a list of possible values */
  'enum': PropTypes.oneOfType([String, PropTypes.arrayOf(String)]),
  /** validate from a regular expression */
  pattern: PropTypes.custom(isRegExp),
  /** transform a value before validation */
  transform: PropTypes.func,
  /** custom validate function (Note: callback must be called) */
  validator: PropTypes.func
};

var Form = {
  name: 'AFormModel',
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true,
    validateOnRuleChange: false
  }),
  Item: FormItem,
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
        return ConfigConsumerProps;
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
      if (!getListeners(this).submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    },
    resetFields: function resetFields() {
      if (!this.model) {
        warning(false, 'FormModel', 'model is required for resetFields to work.');
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
        warning(false, 'FormModel', 'model is required for resetFields to work.');
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
          invalidFields = _extends({}, invalidFields, field);
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
        warning(false, 'FormModel', 'please pass correct props!');
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

    var formClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-horizontal', layout === 'horizontal'), _defineProperty(_classNames, prefixCls + '-vertical', layout === 'vertical'), _defineProperty(_classNames, prefixCls + '-inline', layout === 'inline'), _defineProperty(_classNames, prefixCls + '-hide-required-mark', hideRequiredMark), _classNames));
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

export default Form;