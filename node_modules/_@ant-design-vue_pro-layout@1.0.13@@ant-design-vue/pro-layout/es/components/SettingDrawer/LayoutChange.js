function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import PropTypes from 'ant-design-vue/es/_util/vue-types';
import 'ant-design-vue/es/tooltip/style';
import Tooltip from 'ant-design-vue/es/tooltip';
import 'ant-design-vue/es/list/style';
import List from 'ant-design-vue/es/list';
import 'ant-design-vue/es/select/style';
import Select from 'ant-design-vue/es/select';
import 'ant-design-vue/es/switch/style';
import Switch from 'ant-design-vue/es/switch';
export var renderLayoutSettingItem = function renderLayoutSettingItem(h, item) {
  var action = _objectSpread({}, item.action);

  return h(Tooltip, {
    attrs: {
      title: item.disabled ? item.disabledReason : '',
      placement: "left"
    }
  }, [h(List.Item, {
    attrs: {
      actions: [action]
    }
  }, [h("span", {
    style: {
      opacity: item.disabled ? 0.5 : 1
    }
  }, [item.title])])]);
};
export var LayoutSettingProps = {
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu']),
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
};
export default {
  props: LayoutSettingProps,
  inject: ['locale'],
  render: function render(h) {
    var _this = this;

    var i18n = this.$props.i18nRender || this.locale;
    var contentWidth = this.contentWidth,
        fixedHeader = this.fixedHeader,
        layout = this.layout,
        fixSiderbar = this.fixSiderbar;

    var handleChange = function handleChange(type, value) {
      _this.$emit('change', {
        type: type,
        value: value
      });
    };

    return h(List, {
      attrs: {
        split: false,
        dataSource: [{
          title: i18n('app.setting.content-width'),
          action: h(Select, {
            attrs: {
              value: contentWidth,
              size: "small"
            },
            on: {
              "select": function select(value) {
                return handleChange('contentWidth', value);
              }
            },
            style: {
              width: '80px'
            }
          }, [layout === 'sidemenu' ? null : h(Select.Option, {
            attrs: {
              value: "Fixed"
            }
          }, [i18n('app.setting.content-width.fixed')]), h(Select.Option, {
            attrs: {
              value: "Fluid"
            }
          }, [i18n('app.setting.content-width.fluid')])])
        }, {
          title: i18n('app.setting.fixedheader'),
          action: h(Switch, {
            attrs: {
              size: "small",
              checked: !!fixedHeader
            },
            on: {
              "change": function change(checked) {
                return handleChange('fixedHeader', checked);
              }
            }
          })
        }, {
          title: i18n('app.setting.fixedsidebar'),
          disabled: layout === 'topmenu',
          disabledReason: i18n('app.setting.fixedsidebar.hint'),
          action: h(Switch, {
            attrs: {
              size: "small",
              disabled: layout === 'topmenu',
              checked: !!fixSiderbar
            },
            on: {
              "change": function change(checked) {
                return handleChange('fixSiderbar', checked);
              }
            }
          })
        }],
        renderItem: function renderItem(item, index) {
          return renderLayoutSettingItem(h, item);
        }
      }
    });
  }
};