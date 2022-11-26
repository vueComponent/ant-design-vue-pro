'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelProps = exports.collapseProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var collapseProps = function collapseProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]))]),
    defaultActiveKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]))]),
    accordion: _vueTypes2['default'].bool,
    destroyInactivePanel: _vueTypes2['default'].bool,
    bordered: _vueTypes2['default'].bool,
    expandIcon: _vueTypes2['default'].func,
    openAnimation: _vueTypes2['default'].object,
    expandIconPosition: _vueTypes2['default'].oneOf(['left', 'right'])
  };
};

var panelProps = function panelProps() {
  return {
    openAnimation: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    header: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].node]),
    headerClass: _vueTypes2['default'].string,
    showArrow: _vueTypes2['default'].bool,
    isActive: _vueTypes2['default'].bool,
    destroyInactivePanel: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    accordion: _vueTypes2['default'].bool,
    forceRender: _vueTypes2['default'].bool,
    expandIcon: _vueTypes2['default'].func,
    extra: _vueTypes2['default'].any,
    panelKey: _vueTypes2['default'].any
  };
};

exports.collapseProps = collapseProps;
exports.panelProps = panelProps;