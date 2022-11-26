import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { ColProps } from '../grid/Col';
import Vue from 'vue';
import isRegExp from 'lodash/isRegExp';
import warning from '../_util/warning';
import createDOMForm from '../vc-form/src/createDOMForm';
import createFormField from '../vc-form/src/createFormField';
import FormItem from './FormItem';
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants';
import { initDefaultProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

export var FormCreateOption = {
  onFieldsChange: PropTypes.func,
  onValuesChange: PropTypes.func,
  mapPropsToFields: PropTypes.func,
  validateMessages: PropTypes.any,
  withRef: PropTypes.bool,
  name: PropTypes.string
};

// function create
export var WrappedFormUtils = {
  /** 获取一组输入控件的值，如不传入参数，则获取全部组件的值 */
  getFieldsValue: PropTypes.func,
  /** 获取一个输入控件的值*/
  getFieldValue: PropTypes.func,
  /** 设置一组输入控件的值*/
  setFieldsValue: PropTypes.func,
  /** 设置一组输入控件的值*/
  setFields: PropTypes.func,
  /** 校验并获取一组输入域的值与 Error */
  validateFields: PropTypes.func,
  // validateFields(fieldNames: Array<string>, options: Object, callback: ValidateCallback): void;
  // validateFields(fieldNames: Array<string>, callback: ValidateCallback): void;
  // validateFields(options: Object, callback: ValidateCallback): void;
  // validateFields(callback: ValidateCallback): void;
  // validateFields(): void;
  /** 与 `validateFields` 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围 */
  validateFieldsAndScroll: PropTypes.func,
  // validateFieldsAndScroll(fieldNames?: Array<string>, options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(fieldNames?: Array<string>, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(options?: Object, callback?: ValidateCallback): void;
  // validateFieldsAndScroll(callback?: ValidateCallback): void;
  // validateFieldsAndScroll(): void;
  /** 获取某个输入控件的 Error */
  getFieldError: PropTypes.func,
  getFieldsError: PropTypes.func,
  /** 判断一个输入控件是否在校验状态*/
  isFieldValidating: PropTypes.func,
  isFieldTouched: PropTypes.func,
  isFieldsTouched: PropTypes.func,
  /** 重置一组输入控件的值与状态，如不传入参数，则重置所有组件 */
  resetFields: PropTypes.func,

  getFieldDecorator: PropTypes.func
};

export var FormProps = {
  layout: PropTypes.oneOf(['horizontal', 'inline', 'vertical']),
  labelCol: PropTypes.shape(ColProps).loose,
  wrapperCol: PropTypes.shape(ColProps).loose,
  colon: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  form: PropTypes.object,
  // onSubmit: React.FormEventHandler<any>;
  prefixCls: PropTypes.string,
  hideRequiredMark: PropTypes.bool,
  autoFormCreate: PropTypes.func,
  options: PropTypes.object,
  selfUpdate: PropTypes.bool
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

// export type ValidateCallback = (errors: any, values: any) => void;

// export type GetFieldDecoratorOptions = {
//   /** 子节点的值的属性，如 Checkbox 的是 'checked' */
//   valuePropName?: string;
//   /** 子节点的初始值，类型、可选值均由子节点决定 */
//   initialValue?: any;
//   /** 收集子节点的值的时机 */
//   trigger?: string;
//   /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
//   getValueFromEvent?: (...args: any[]) => any;
//   /** Get the component props according to field value. */
//   getValueProps?: (value: any) => any;
//   /** 校验子节点值的时机 */
//   validateTrigger?: string | string[];
//   /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
//   rules?: ValidationRule[];
//   /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
//   exclusive?: boolean;
//   /** Normalize value to form component */
//   normalize?: (value: any, prevValue: any, allValues: any) => any;
//   /** Whether stop validate on first rule of error for this field.  */
//   validateFirst?: boolean;
//   /** 是否一直保留子节点的信息 */
//   preserve?: boolean;
// };

var Form = {
  name: 'AForm',
  props: initDefaultProps(FormProps, {
    layout: 'horizontal',
    hideRequiredMark: false,
    colon: true
  }),
  Item: FormItem,
  createFormField: createFormField,
  create: function create() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return createDOMForm(_extends({
      fieldNameProp: 'id'
    }, options, {
      fieldMetaProp: FIELD_META_PROP,
      fieldDataProp: FIELD_DATA_PROP
    }));
  },
  createForm: function createForm(context) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var V = Base.Vue || Vue;
    return new V(Form.create(_extends({}, options, { templateContext: context }))());
  },
  created: function created() {
    this.formItemContexts = new Map();
  },
  provide: function provide() {
    var _this = this;

    return {
      FormContext: this,
      // https://github.com/vueComponent/ant-design-vue/issues/446
      collectFormItemContext: this.form && this.form.templateContext ? function (c) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'add';

        var formItemContexts = _this.formItemContexts;
        var number = formItemContexts.get(c) || 0;
        if (type === 'delete') {
          if (number <= 1) {
            formItemContexts['delete'](c);
          } else {
            formItemContexts.set(c, number - 1);
          }
        } else {
          if (c !== _this.form.templateContext) {
            formItemContexts.set(c, number + 1);
          }
        }
      } : function () {}
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  watch: {
    form: function form() {
      this.$forceUpdate();
    }
  },
  computed: {
    vertical: function vertical() {
      return this.layout === 'vertical';
    }
  },
  beforeUpdate: function beforeUpdate() {
    this.formItemContexts.forEach(function (number, c) {
      if (c.$forceUpdate) {
        c.$forceUpdate();
      }
    });
  },
  updated: function updated() {
    if (this.form && this.form.cleanUpUselessFields) {
      this.form.cleanUpUselessFields();
    }
  },

  methods: {
    onSubmit: function onSubmit(e) {
      if (!getListeners(this).submit) {
        e.preventDefault();
      } else {
        this.$emit('submit', e);
      }
    }
  },

  render: function render() {
    var _classNames,
        _this2 = this;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        hideRequiredMark = this.hideRequiredMark,
        layout = this.layout,
        onSubmit = this.onSubmit,
        $slots = this.$slots,
        autoFormCreate = this.autoFormCreate,
        _options = this.options,
        options = _options === undefined ? {} : _options;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('form', customizePrefixCls);

    var formClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-horizontal', layout === 'horizontal'), _defineProperty(_classNames, prefixCls + '-vertical', layout === 'vertical'), _defineProperty(_classNames, prefixCls + '-inline', layout === 'inline'), _defineProperty(_classNames, prefixCls + '-hide-required-mark', hideRequiredMark), _classNames));
    if (autoFormCreate) {
      warning(false, 'Form', '`autoFormCreate` is deprecated. please use `form` instead.');
      var DomForm = this.DomForm || createDOMForm(_extends({
        fieldNameProp: 'id'
      }, options, {
        fieldMetaProp: FIELD_META_PROP,
        fieldDataProp: FIELD_DATA_PROP,
        templateContext: this.$vnode.context
      }))({
        provide: function provide() {
          return {
            decoratorFormProps: this.$props
          };
        },
        data: function data() {
          return {
            children: $slots['default'],
            formClassName: formClassName,
            submit: onSubmit
          };
        },
        created: function created() {
          autoFormCreate(this.form);
        },
        render: function render() {
          var h = arguments[0];
          var children = this.children,
              formClassName = this.formClassName,
              submit = this.submit;

          return h(
            'form',
            {
              on: {
                'submit': submit
              },
              'class': formClassName },
            [children]
          );
        }
      });
      if (this.domForm) {
        this.domForm.children = $slots['default'];
        this.domForm.submit = onSubmit;
        this.domForm.formClassName = formClassName;
      }
      this.DomForm = DomForm;

      return h(DomForm, {
        attrs: {
          wrappedComponentRef: function wrappedComponentRef(inst) {
            _this2.domForm = inst;
          }
        }
      });
    }
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