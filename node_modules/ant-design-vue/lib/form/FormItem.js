'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormItemProps = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _Row = require('../grid/Row');

var _Row2 = _interopRequireDefault(_Row);

var _Col = require('../grid/Col');

var _Col2 = _interopRequireDefault(_Col);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _constants = require('./constants');

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function intersperseSpace(list) {
  return list.reduce(function (current, item) {
    return [].concat((0, _toConsumableArray3['default'])(current), [' ', item]);
  }, []).slice(1);
}
var FormItemProps = exports.FormItemProps = {
  id: _vueTypes2['default'].string,
  htmlFor: _vueTypes2['default'].string,
  prefixCls: _vueTypes2['default'].string,
  label: _vueTypes2['default'].any,
  labelCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  wrapperCol: _vueTypes2['default'].shape(_Col.ColProps).loose,
  help: _vueTypes2['default'].any,
  extra: _vueTypes2['default'].any,
  validateStatus: _vueTypes2['default'].oneOf(['', 'success', 'warning', 'error', 'validating']),
  hasFeedback: _vueTypes2['default'].bool,
  required: _vueTypes2['default'].bool,
  colon: _vueTypes2['default'].bool,
  fieldDecoratorId: _vueTypes2['default'].string,
  fieldDecoratorOptions: _vueTypes2['default'].object,
  selfUpdate: _vueTypes2['default'].bool,
  labelAlign: _vueTypes2['default'].oneOf(['left', 'right'])
};
function comeFromSlot() {
  var vnodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var itemVnode = arguments[1];

  var isSlot = false;
  for (var i = 0, len = vnodes.length; i < len; i++) {
    var vnode = vnodes[i];
    if (vnode && (vnode === itemVnode || vnode.$vnode === itemVnode)) {
      isSlot = true;
    } else {
      var componentOptions = vnode.componentOptions || vnode.$vnode && vnode.$vnode.componentOptions;
      var children = componentOptions ? componentOptions.children : vnode.$children;
      isSlot = comeFromSlot(children, itemVnode);
    }
    if (isSlot) {
      break;
    }
  }
  return isSlot;
}

exports['default'] = {
  name: 'AFormItem',
  __ANT_FORM_ITEM: true,
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(FormItemProps, {
    hasFeedback: false
  }),
  provide: function provide() {
    return {
      isFormItemChildren: true
    };
  },

  inject: {
    isFormItemChildren: { 'default': false },
    FormContext: { 'default': function _default() {
        return {};
      } },
    decoratorFormProps: { 'default': function _default() {
        return {};
      } },
    collectFormItemContext: { 'default': function _default() {
        return noop;
      } },
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return { helpShow: false };
  },

  computed: {
    itemSelfUpdate: function itemSelfUpdate() {
      return !!(this.selfUpdate === undefined ? this.FormContext.selfUpdate : this.selfUpdate);
    }
  },
  created: function created() {
    this.collectContext();
  },
  beforeUpdate: function beforeUpdate() {
    if (process.env.NODE_ENV !== 'production') {
      this.collectContext();
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.collectFormItemContext(this.$vnode && this.$vnode.context, 'delete');
  },
  mounted: function mounted() {
    var _$props = this.$props,
        help = _$props.help,
        validateStatus = _$props.validateStatus;

    (0, _warning2['default'])(this.getControls(this.slotDefault, true).length <= 1 || help !== undefined || validateStatus !== undefined, 'Form.Item', 'Cannot generate `validateStatus` and `help` automatically, ' + 'while there are more than one `getFieldDecorator` in it.');
    (0, _warning2['default'])(!this.fieldDecoratorId, 'Form.Item', '`fieldDecoratorId` is deprecated. please use `v-decorator={id, options}` instead.');
  },

  methods: {
    collectContext: function collectContext() {
      if (this.FormContext.form && this.FormContext.form.templateContext) {
        var templateContext = this.FormContext.form.templateContext;

        var vnodes = Object.values(templateContext.$slots || {}).reduce(function (a, b) {
          return [].concat((0, _toConsumableArray3['default'])(a), (0, _toConsumableArray3['default'])(b));
        }, []);
        var isSlot = comeFromSlot(vnodes, this.$vnode);
        (0, _warning2['default'])(!isSlot, 'You can not set FormItem from slot, please use slot-scope instead slot');
        var isSlotScope = false;
        // 进一步判断是否是通过slot-scope传递
        if (!isSlot && this.$vnode.context !== templateContext) {
          isSlotScope = comeFromSlot(this.$vnode.context.$children, templateContext.$vnode);
        }
        if (!isSlotScope && !isSlot) {
          this.collectFormItemContext(this.$vnode.context);
        }
      }
    },
    getHelpMessage: function getHelpMessage() {
      var help = (0, _propsUtil.getComponentFromProp)(this, 'help');
      var onlyControl = this.getOnlyControl();
      if (help === undefined && onlyControl) {
        var errors = this.getField().errors;
        if (errors) {
          return intersperseSpace(errors.map(function (e, index) {
            var node = null;
            if ((0, _propsUtil.isValidElement)(e)) {
              node = e;
            } else if ((0, _propsUtil.isValidElement)(e.message)) {
              node = e.message;
            }
            return node ? (0, _vnode.cloneElement)(node, { key: index }) : e.message;
          }));
        } else {
          return '';
        }
      }

      return help;
    },
    getControls: function getControls() {
      var childrenArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var recursively = arguments[1];

      var controls = [];
      for (var i = 0; i < childrenArray.length; i++) {
        if (!recursively && controls.length > 0) {
          break;
        }

        var child = childrenArray[i];
        if (!child.tag && child.text.trim() === '') {
          continue;
        }

        if ((0, _propsUtil.getSlotOptions)(child).__ANT_FORM_ITEM) {
          continue;
        }
        var children = (0, _propsUtil.getAllChildren)(child);
        var attrs = child.data && child.data.attrs || {};
        if (_constants.FIELD_META_PROP in attrs) {
          // And means FIELD_DATA_PROP in child.props, too.
          controls.push(child);
        } else if (children) {
          controls = controls.concat(this.getControls(children, recursively));
        }
      }
      return controls;
    },
    getOnlyControl: function getOnlyControl() {
      var child = this.getControls(this.slotDefault, false)[0];
      return child !== undefined ? child : null;
    },
    getChildAttr: function getChildAttr(prop) {
      var child = this.getOnlyControl();
      var data = {};
      if (!child) {
        return undefined;
      }
      if (child.data) {
        data = child.data;
      } else if (child.$vnode && child.$vnode.data) {
        data = child.$vnode.data;
      }
      return data[prop] || data.attrs[prop];
    },
    getId: function getId() {
      return this.getChildAttr('id');
    },
    getMeta: function getMeta() {
      return this.getChildAttr(_constants.FIELD_META_PROP);
    },
    getField: function getField() {
      return this.getChildAttr(_constants.FIELD_DATA_PROP);
    },
    getValidateStatus: function getValidateStatus() {
      var onlyControl = this.getOnlyControl();
      if (!onlyControl) {
        return '';
      }
      var field = this.getField();
      if (field.validating) {
        return 'validating';
      }
      if (field.errors) {
        return 'error';
      }
      var fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        return 'success';
      }
      return '';
    },


    // Resolve duplicated ids bug between different forms
    // https://github.com/ant-design/ant-design/issues/7351
    onLabelClick: function onLabelClick() {
      var id = this.id || this.getId();
      if (!id) {
        return;
      }
      var formItemNode = this.$el;
      var control = formItemNode.querySelector('[id="' + id + '"]');
      if (control && control.focus) {
        control.focus();
      }
    },
    onHelpAnimEnd: function onHelpAnimEnd(_key, helpShow) {
      this.helpShow = helpShow;
      if (!helpShow) {
        this.$forceUpdate();
      }
    },
    isRequired: function isRequired() {
      var required = this.required;

      if (required !== undefined) {
        return required;
      }
      if (this.getOnlyControl()) {
        var meta = this.getMeta() || {};
        var validate = meta.validate || [];

        return validate.filter(function (item) {
          return !!item.rules;
        }).some(function (item) {
          return item.rules.some(function (rule) {
            return rule.required;
          });
        });
      }
      return false;
    },
    renderHelp: function renderHelp(prefixCls) {
      var _this = this;

      var h = this.$createElement;

      var help = this.getHelpMessage();
      var children = help ? h(
        'div',
        { 'class': prefixCls + '-explain', key: 'help' },
        [help]
      ) : null;
      if (children) {
        this.helpShow = !!children;
      }
      var transitionProps = (0, _getTransitionProps2['default'])('show-help', {
        afterEnter: function afterEnter() {
          return _this.onHelpAnimEnd('help', true);
        },
        afterLeave: function afterLeave() {
          return _this.onHelpAnimEnd('help', false);
        }
      });
      return h(
        'transition',
        (0, _babelHelperVueJsxMergeProps2['default'])([transitionProps, { key: 'help' }]),
        [children]
      );
    },
    renderExtra: function renderExtra(prefixCls) {
      var h = this.$createElement;

      var extra = (0, _propsUtil.getComponentFromProp)(this, 'extra');
      return extra ? h(
        'div',
        { 'class': prefixCls + '-extra' },
        [extra]
      ) : null;
    },
    renderValidateWrapper: function renderValidateWrapper(prefixCls, c1, c2, c3) {
      var h = this.$createElement;

      var props = this.$props;
      var onlyControl = this.getOnlyControl;
      var validateStatus = props.validateStatus === undefined && onlyControl ? this.getValidateStatus() : props.validateStatus;

      var classes = prefixCls + '-item-control';
      if (validateStatus) {
        classes = (0, _classnames2['default'])(prefixCls + '-item-control', {
          'has-feedback': validateStatus && props.hasFeedback,
          'has-success': validateStatus === 'success',
          'has-warning': validateStatus === 'warning',
          'has-error': validateStatus === 'error',
          'is-validating': validateStatus === 'validating'
        });
      }
      var iconType = '';
      switch (validateStatus) {
        case 'success':
          iconType = 'check-circle';
          break;
        case 'warning':
          iconType = 'exclamation-circle';
          break;
        case 'error':
          iconType = 'close-circle';
          break;
        case 'validating':
          iconType = 'loading';
          break;
        default:
          iconType = '';
          break;
      }
      var icon = props.hasFeedback && iconType ? h(
        'span',
        { 'class': prefixCls + '-item-children-icon' },
        [h(_icon2['default'], {
          attrs: { type: iconType, theme: iconType === 'loading' ? 'outlined' : 'filled' }
        })]
      ) : null;
      return h(
        'div',
        { 'class': classes },
        [h(
          'span',
          { 'class': prefixCls + '-item-children' },
          [c1, icon]
        ), c2, c3]
      );
    },
    renderWrapper: function renderWrapper(prefixCls, children) {
      var h = this.$createElement;

      var _ref = this.isFormItemChildren ? {} : this.FormContext,
          contextWrapperCol = _ref.wrapperCol;

      var wrapperCol = this.wrapperCol;

      var mergedWrapperCol = wrapperCol || contextWrapperCol || {};
      var style = mergedWrapperCol.style,
          id = mergedWrapperCol.id,
          on = mergedWrapperCol.on,
          restProps = (0, _objectWithoutProperties3['default'])(mergedWrapperCol, ['style', 'id', 'on']);

      var className = (0, _classnames2['default'])(prefixCls + '-item-control-wrapper', mergedWrapperCol['class']);
      var colProps = {
        props: restProps,
        'class': className,
        key: 'wrapper',
        style: style,
        id: id,
        on: on
      };
      return h(
        _Col2['default'],
        colProps,
        [children]
      );
    },
    renderLabel: function renderLabel(prefixCls) {
      var _classNames;

      var h = this.$createElement;
      var _FormContext = this.FormContext,
          vertical = _FormContext.vertical,
          contextLabelAlign = _FormContext.labelAlign,
          contextLabelCol = _FormContext.labelCol,
          contextColon = _FormContext.colon;
      var labelAlign = this.labelAlign,
          labelCol = this.labelCol,
          colon = this.colon,
          id = this.id,
          htmlFor = this.htmlFor;

      var label = (0, _propsUtil.getComponentFromProp)(this, 'label');
      var required = this.isRequired();
      var mergedLabelCol = labelCol || contextLabelCol || {};

      var mergedLabelAlign = labelAlign || contextLabelAlign;
      var labelClsBasic = prefixCls + '-item-label';
      var labelColClassName = (0, _classnames2['default'])(labelClsBasic, mergedLabelAlign === 'left' && labelClsBasic + '-left', mergedLabelCol['class']);
      var labelColClass = mergedLabelCol['class'],
          labelColStyle = mergedLabelCol.style,
          labelColId = mergedLabelCol.id,
          on = mergedLabelCol.on,
          restProps = (0, _objectWithoutProperties3['default'])(mergedLabelCol, ['class', 'style', 'id', 'on']);

      var labelChildren = label;
      // Keep label is original where there should have no colon
      var computedColon = colon === true || contextColon !== false && colon !== false;
      var haveColon = computedColon && !vertical;
      // Remove duplicated user input colon
      if (haveColon && typeof label === 'string' && label.trim() !== '') {
        labelChildren = label.replace(/[：:]\s*$/, '');
      }

      var labelClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-item-required', required), (0, _defineProperty3['default'])(_classNames, prefixCls + '-item-no-colon', !computedColon), _classNames));
      var colProps = {
        props: restProps,
        'class': labelColClassName,
        key: 'label',
        style: labelColStyle,
        id: labelColId,
        on: on
      };

      return label ? h(
        _Col2['default'],
        colProps,
        [h(
          'label',
          {
            attrs: {
              'for': htmlFor || id || this.getId(),

              title: typeof label === 'string' ? label : ''
            },
            'class': labelClassName, on: {
              'click': this.onLabelClick
            }
          },
          [labelChildren]
        )]
      ) : null;
    },
    renderChildren: function renderChildren(prefixCls) {
      return [this.renderLabel(prefixCls), this.renderWrapper(prefixCls, this.renderValidateWrapper(prefixCls, this.slotDefault, this.renderHelp(prefixCls), this.renderExtra(prefixCls)))];
    },
    renderFormItem: function renderFormItem() {
      var _itemClassName;

      var h = this.$createElement;
      var customizePrefixCls = this.$props.prefixCls;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('form', customizePrefixCls);
      var children = this.renderChildren(prefixCls);
      var itemClassName = (_itemClassName = {}, (0, _defineProperty3['default'])(_itemClassName, prefixCls + '-item', true), (0, _defineProperty3['default'])(_itemClassName, prefixCls + '-item-with-help', this.helpShow), _itemClassName);

      return h(
        _Row2['default'],
        { 'class': (0, _classnames2['default'])(itemClassName), key: 'row' },
        [children]
      );
    },
    decoratorOption: function decoratorOption(vnode) {
      if (vnode.data && vnode.data.directives) {
        var directive = (0, _find2['default'])(vnode.data.directives, ['name', 'decorator']);
        (0, _warning2['default'])(!directive || directive && Array.isArray(directive.value), 'Form', 'Invalid directive: type check failed for directive "decorator". Expected Array, got ' + (0, _typeof3['default'])(directive ? directive.value : directive) + '. At ' + vnode.tag + '.');
        return directive ? directive.value : null;
      } else {
        return null;
      }
    },
    decoratorChildren: function decoratorChildren(vnodes) {
      var FormContext = this.FormContext;

      var getFieldDecorator = FormContext.form.getFieldDecorator;
      for (var i = 0, len = vnodes.length; i < len; i++) {
        var vnode = vnodes[i];
        if ((0, _propsUtil.getSlotOptions)(vnode).__ANT_FORM_ITEM) {
          break;
        }
        if (vnode.children) {
          vnode.children = this.decoratorChildren((0, _vnode.cloneVNodes)(vnode.children));
        } else if (vnode.componentOptions && vnode.componentOptions.children) {
          vnode.componentOptions.children = this.decoratorChildren((0, _vnode.cloneVNodes)(vnode.componentOptions.children));
        }
        var option = this.decoratorOption(vnode);
        if (option && option[0]) {
          vnodes[i] = getFieldDecorator(option[0], option[1], this)(vnode);
        }
      }
      return vnodes;
    }
  },

  render: function render() {
    var $slots = this.$slots,
        decoratorFormProps = this.decoratorFormProps,
        fieldDecoratorId = this.fieldDecoratorId,
        _fieldDecoratorOption = this.fieldDecoratorOptions,
        fieldDecoratorOptions = _fieldDecoratorOption === undefined ? {} : _fieldDecoratorOption,
        FormContext = this.FormContext;

    var child = (0, _propsUtil.filterEmpty)($slots['default'] || []);
    if (decoratorFormProps.form && fieldDecoratorId && child.length) {
      var getFieldDecorator = decoratorFormProps.form.getFieldDecorator;
      child[0] = getFieldDecorator(fieldDecoratorId, fieldDecoratorOptions, this)(child[0]);
      (0, _warning2['default'])(!(child.length > 1), 'Form', '`autoFormCreate` just `decorator` then first children. but you can use JSX to support multiple children');
      this.slotDefault = child;
    } else if (FormContext.form) {
      child = (0, _vnode.cloneVNodes)(child);
      this.slotDefault = this.decoratorChildren(child);
    } else {
      this.slotDefault = child;
    }
    return this.renderFormItem();
  }
};