import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import { filterEmpty, parseStyleText } from './props-util';
import classNames from 'classnames';

export function cloneVNode(vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var data = vnode.data;

  var listeners = {};
  if (componentOptions && componentOptions.listeners) {
    listeners = _extends({}, componentOptions.listeners);
  }

  var on = {};
  if (data && data.on) {
    on = _extends({}, data.on);
  }

  var cloned = new vnode.constructor(vnode.tag, data ? _extends({}, data, { on: on }) : data, vnode.children, vnode.text, vnode.elm, vnode.context, componentOptions ? _extends({}, componentOptions, { listeners: listeners }) : componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned;
}

export function cloneVNodes(vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res;
}

export function cloneElement(n) {
  var nodeProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deep = arguments[2];

  var ele = n;
  if (Array.isArray(n)) {
    ele = filterEmpty(n)[0];
  }
  if (!ele) {
    return null;
  }
  var node = cloneVNode(ele, deep);
  // // 函数式组件不支持clone  https://github.com/vueComponent/ant-design-vue/pull/1947
  // warning(
  //   !(node.fnOptions && node.fnOptions.functional),
  //   `can not use cloneElement for functional component (${node.fnOptions && node.fnOptions.name})`,
  // );
  var _nodeProps$props = nodeProps.props,
      props = _nodeProps$props === undefined ? {} : _nodeProps$props,
      key = nodeProps.key,
      _nodeProps$on = nodeProps.on,
      on = _nodeProps$on === undefined ? {} : _nodeProps$on,
      _nodeProps$nativeOn = nodeProps.nativeOn,
      nativeOn = _nodeProps$nativeOn === undefined ? {} : _nodeProps$nativeOn,
      children = nodeProps.children,
      _nodeProps$directives = nodeProps.directives,
      directives = _nodeProps$directives === undefined ? [] : _nodeProps$directives;

  var data = node.data || {};
  var cls = {};
  var style = {};
  var _nodeProps$attrs = nodeProps.attrs,
      attrs = _nodeProps$attrs === undefined ? {} : _nodeProps$attrs,
      ref = nodeProps.ref,
      _nodeProps$domProps = nodeProps.domProps,
      domProps = _nodeProps$domProps === undefined ? {} : _nodeProps$domProps,
      _nodeProps$style = nodeProps.style,
      tempStyle = _nodeProps$style === undefined ? {} : _nodeProps$style,
      _nodeProps$class = nodeProps['class'],
      tempCls = _nodeProps$class === undefined ? {} : _nodeProps$class,
      _nodeProps$scopedSlot = nodeProps.scopedSlots,
      scopedSlots = _nodeProps$scopedSlot === undefined ? {} : _nodeProps$scopedSlot;


  if (typeof data.style === 'string') {
    style = parseStyleText(data.style);
  } else {
    style = _extends({}, data.style, style);
  }
  if (typeof tempStyle === 'string') {
    style = _extends({}, style, parseStyleText(style));
  } else {
    style = _extends({}, style, tempStyle);
  }

  if (typeof data['class'] === 'string' && data['class'].trim() !== '') {
    data['class'].split(' ').forEach(function (c) {
      cls[c.trim()] = true;
    });
  } else if (Array.isArray(data['class'])) {
    classNames(data['class']).split(' ').forEach(function (c) {
      cls[c.trim()] = true;
    });
  } else {
    cls = _extends({}, data['class'], cls);
  }
  if (typeof tempCls === 'string' && tempCls.trim() !== '') {
    tempCls.split(' ').forEach(function (c) {
      cls[c.trim()] = true;
    });
  } else {
    cls = _extends({}, cls, tempCls);
  }
  node.data = _extends({}, data, {
    style: style,
    attrs: _extends({}, data.attrs, attrs),
    'class': cls,
    domProps: _extends({}, data.domProps, domProps),
    scopedSlots: _extends({}, data.scopedSlots, scopedSlots),
    directives: [].concat(_toConsumableArray(data.directives || []), _toConsumableArray(directives))
  });

  if (node.componentOptions) {
    node.componentOptions.propsData = node.componentOptions.propsData || {};
    node.componentOptions.listeners = node.componentOptions.listeners || {};
    node.componentOptions.propsData = _extends({}, node.componentOptions.propsData, props);
    node.componentOptions.listeners = _extends({}, node.componentOptions.listeners, on);
    if (children) {
      node.componentOptions.children = children;
    }
  } else {
    if (children) {
      node.children = children;
    }
    node.data.on = _extends({}, node.data.on || {}, on);
  }
  node.data.on = _extends({}, node.data.on || {}, nativeOn);

  if (key !== undefined) {
    node.key = key;
    node.data.key = key;
  }
  if (typeof ref === 'string') {
    node.data.ref = ref;
  }
  return node;
}