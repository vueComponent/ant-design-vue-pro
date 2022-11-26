'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _BreadcrumbItem = require('./BreadcrumbItem');

var _BreadcrumbItem2 = _interopRequireDefault(_BreadcrumbItem);

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Route = _vueTypes2['default'].shape({
  path: _vueTypes2['default'].string,
  breadcrumbName: _vueTypes2['default'].string,
  children: _vueTypes2['default'].array
}).loose;

var BreadcrumbProps = {
  prefixCls: _vueTypes2['default'].string,
  routes: _vueTypes2['default'].arrayOf(Route),
  params: _vueTypes2['default'].any,
  separator: _vueTypes2['default'].any,
  itemRender: _vueTypes2['default'].func
};

function getBreadcrumbName(route, params) {
  if (!route.breadcrumbName) {
    return null;
  }
  var paramsKeys = Object.keys(params).join('|');
  var name = route.breadcrumbName.replace(new RegExp(':(' + paramsKeys + ')', 'g'), function (replacement, key) {
    return params[key] || replacement;
  });
  return name;
}

exports['default'] = {
  name: 'ABreadcrumb',
  props: BreadcrumbProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    defaultItemRender: function defaultItemRender(_ref) {
      var route = _ref.route,
          params = _ref.params,
          routes = _ref.routes,
          paths = _ref.paths;
      var h = this.$createElement;

      var isLastItem = routes.indexOf(route) === routes.length - 1;
      var name = getBreadcrumbName(route, params);
      return isLastItem ? h('span', [name]) : h(
        'a',
        {
          attrs: { href: '#/' + paths.join('/') }
        },
        [name]
      );
    },
    getPath: function getPath(path, params) {
      path = (path || '').replace(/^\//, '');
      Object.keys(params).forEach(function (key) {
        path = path.replace(':' + key, params[key]);
      });
      return path;
    },
    addChildPath: function addChildPath(paths, childPath, params) {
      var originalPaths = [].concat((0, _toConsumableArray3['default'])(paths));
      var path = this.getPath(childPath, params);
      if (path) {
        originalPaths.push(path);
      }
      return originalPaths;
    },
    genForRoutes: function genForRoutes(_ref2) {
      var _this = this;

      var _ref2$routes = _ref2.routes,
          routes = _ref2$routes === undefined ? [] : _ref2$routes,
          _ref2$params = _ref2.params,
          params = _ref2$params === undefined ? {} : _ref2$params,
          separator = _ref2.separator,
          _ref2$itemRender = _ref2.itemRender,
          itemRender = _ref2$itemRender === undefined ? this.defaultItemRender : _ref2$itemRender;
      var h = this.$createElement;

      var paths = [];
      return routes.map(function (route) {
        var path = _this.getPath(route.path, params);

        if (path) {
          paths.push(path);
        }
        // generated overlay by route.children
        var overlay = null;
        if (route.children && route.children.length) {
          overlay = h(_menu2['default'], [route.children.map(function (child) {
            return h(
              _menu2['default'].Item,
              { key: child.path || child.breadcrumbName },
              [itemRender({
                route: child,
                params: params,
                routes: routes,
                paths: _this.addChildPath(paths, child.path, params),
                h: _this.$createElement
              })]
            );
          })]);
        }

        return h(
          _BreadcrumbItem2['default'],
          {
            attrs: {
              overlay: overlay,
              separator: separator
            },
            key: path || route.breadcrumbName
          },
          [itemRender({ route: route, params: params, routes: routes, paths: paths, h: _this.$createElement })]
        );
      });
    }
  },
  render: function render() {
    var h = arguments[0];

    var crumbs = void 0;
    var customizePrefixCls = this.prefixCls,
        routes = this.routes,
        _params = this.params,
        params = _params === undefined ? {} : _params,
        $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    var separator = (0, _propsUtil.getComponentFromProp)(this, 'separator');
    var itemRender = this.itemRender || $scopedSlots.itemRender || this.defaultItemRender;
    if (routes && routes.length > 0) {
      // generated by route
      crumbs = this.genForRoutes({
        routes: routes,
        params: params,
        separator: separator,
        itemRender: itemRender
      });
    } else if (children.length) {
      crumbs = children.map(function (element, index) {
        (0, _warning2['default'])((0, _propsUtil.getSlotOptions)(element).__ANT_BREADCRUMB_ITEM || (0, _propsUtil.getSlotOptions)(element).__ANT_BREADCRUMB_SEPARATOR, 'Breadcrumb', "Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children");
        return (0, _vnode.cloneElement)(element, {
          props: { separator: separator },
          key: index
        });
      });
    }
    return h(
      'div',
      { 'class': prefixCls },
      [crumbs]
    );
  }
};