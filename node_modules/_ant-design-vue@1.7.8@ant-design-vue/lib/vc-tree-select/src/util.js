'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conductCheck = exports.UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_STYLE = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.findPopupContainer = findPopupContainer;
exports.toTitle = toTitle;
exports.toArray = toArray;
exports.createRef = createRef;
exports.flatToHierarchy = flatToHierarchy;
exports.resetAriaId = resetAriaId;
exports.generateAriaId = generateAriaId;
exports.isLabelInValue = isLabelInValue;
exports.parseSimpleTreeData = parseSimpleTreeData;
exports.isPosRelated = isPosRelated;
exports.cleanEntity = cleanEntity;
exports.getFilterTree = getFilterTree;
exports.formatInternalValue = formatInternalValue;
exports.getLabel = getLabel;
exports.formatSelectorValue = formatSelectorValue;
exports.convertDataToTree = convertDataToTree;
exports.convertTreeToEntities = convertTreeToEntities;
exports.getHalfCheckedKeys = getHalfCheckedKeys;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _util = require('../../vc-tree/src/util');

var _class = require('../../vc-util/Dom/class');

var _strategies = require('./strategies');

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var warnDeprecatedLabel = false;

// =================== DOM =====================
function findPopupContainer(node, prefixClass) {
  var current = node;
  while (current) {
    if ((0, _class.hasClass)(current, prefixClass)) {
      return current;
    }
    current = current.parentNode;
  }

  return null;
}

// =================== MISC ====================
function toTitle(title) {
  if (typeof title === 'string') {
    return title;
  }
  return null;
}

function toArray(data) {
  if (data === undefined || data === null) return [];

  return Array.isArray(data) ? data : [data];
}

function createRef() {
  var func = function setRef(node) {
    func.current = node;
  };
  return func;
}

// =============== Legacy ===============
var UNSELECTABLE_STYLE = exports.UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

var UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

/**
 * Convert position list to hierarchy structure.
 * This is little hack since use '-' to split the position.
 */
function flatToHierarchy(positionList) {
  if (!positionList.length) {
    return [];
  }

  var entrances = {};

  // Prepare the position map
  var posMap = {};
  var parsedList = positionList.slice().map(function (entity) {
    var clone = (0, _extends3['default'])({}, entity, {
      fields: entity.pos.split('-')
    });
    delete clone.children;
    return clone;
  });

  parsedList.forEach(function (entity) {
    posMap[entity.pos] = entity;
  });

  parsedList.sort(function (a, b) {
    return a.fields.length - b.fields.length;
  });

  // Create the hierarchy
  parsedList.forEach(function (entity) {
    var parentPos = entity.fields.slice(0, -1).join('-');
    var parentEntity = posMap[parentPos];

    if (!parentEntity) {
      entrances[entity.pos] = entity;
    } else {
      parentEntity.children = parentEntity.children || [];
      parentEntity.children.push(entity);
    }

    // Some time position list provide `key`, we don't need it
    delete entity.key;
    delete entity.fields;
  });

  return Object.keys(entrances).map(function (key) {
    return entrances[key];
  });
}

// =============== Accessibility ===============
var ariaId = 0;

function resetAriaId() {
  ariaId = 0;
}

function generateAriaId(prefix) {
  ariaId += 1;
  return prefix + '_' + ariaId;
}

function isLabelInValue(props) {
  var treeCheckable = props.treeCheckable,
      treeCheckStrictly = props.treeCheckStrictly,
      labelInValue = props.labelInValue;

  if (treeCheckable && treeCheckStrictly) {
    return true;
  }
  return labelInValue || false;
}

// =================== Tree ====================
function parseSimpleTreeData(treeData, _ref) {
  var id = _ref.id,
      pId = _ref.pId,
      rootPId = _ref.rootPId;

  var keyNodes = {};
  var rootNodeList = [];

  // Fill in the map
  var nodeList = treeData.map(function (node) {
    var clone = (0, _extends3['default'])({}, node);
    var key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach(function (node) {
    var parentKey = node[pId];
    var parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || !parent && rootPId === null) {
      rootNodeList.push(node);
    }
  });

  return rootNodeList;
}

/**
 * Detect if position has relation.
 * e.g. 1-2 related with 1-2-3
 * e.g. 1-3-2 related with 1
 * e.g. 1-2 not related with 1-21
 */
function isPosRelated(pos1, pos2) {
  var fields1 = pos1.split('-');
  var fields2 = pos2.split('-');

  var minLen = Math.min(fields1.length, fields2.length);
  for (var i = 0; i < minLen; i += 1) {
    if (fields1[i] !== fields2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * This function is only used on treeNode check (none treeCheckStrictly but has searchInput).
 * We convert entity to { node, pos, children } format.
 * This is legacy bug but we still need to do with it.
 * @param entity
 */
function cleanEntity(_ref2) {
  var node = _ref2.node,
      pos = _ref2.pos,
      children = _ref2.children;

  var instance = {
    node: node,
    pos: pos
  };

  if (children) {
    instance.children = children.map(cleanEntity);
  }

  return instance;
}

/**
 * Get a filtered TreeNode list by provided treeNodes.
 * [Legacy] Since `Tree` use `key` as map but `key` will changed by React,
 * we have to convert `treeNodes > data > treeNodes` to keep the key.
 * Such performance hungry!
 */
function getFilterTree(h, treeNodes, searchValue, filterFunc, valueEntities, Component) {
  if (!searchValue) {
    return null;
  }

  function mapFilteredNodeToData(node) {
    if (!node || (0, _propsUtil.isEmptyElement)(node)) return null;

    var match = false;
    if (filterFunc(searchValue, node)) {
      match = true;
    }
    var children = (0, _propsUtil.getSlots)(node)['default'];
    children = ((typeof children === 'function' ? children() : children) || []).map(mapFilteredNodeToData).filter(function (n) {
      return n;
    });
    if (children.length || match) {
      return h(
        Component,
        (0, _babelHelperVueJsxMergeProps2['default'])([node.data, { key: valueEntities[(0, _propsUtil.getPropsData)(node).value].key }]),
        [children]
      );
    }

    return null;
  }
  return treeNodes.map(mapFilteredNodeToData).filter(function (node) {
    return node;
  });
}

// =================== Value ===================
/**
 * Convert value to array format to make logic simplify.
 */
function formatInternalValue(value, props) {
  var valueList = toArray(value);

  // Parse label in value
  if (isLabelInValue(props)) {
    return valueList.map(function (val) {
      if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3['default'])(val)) !== 'object' || !val) {
        return {
          value: '',
          label: ''
        };
      }

      return val;
    });
  }

  return valueList.map(function (val) {
    return {
      value: val
    };
  });
}

function getLabel(wrappedValue, entity, treeNodeLabelProp) {
  if (wrappedValue.label) {
    return wrappedValue.label;
  }

  if (entity) {
    var props = (0, _propsUtil.getPropsData)(entity.node);
    if (Object.keys(props).length) {
      return props[treeNodeLabelProp];
    }
  }

  // Since value without entity will be in missValueList.
  // This code will never reached, but we still need this in case.
  return wrappedValue.value;
}

/**
 * Convert internal state `valueList` to user needed value list.
 * This will return an array list. You need check if is not multiple when return.
 *
 * `allCheckedNodes` is used for `treeCheckStrictly`
 */
function formatSelectorValue(valueList, props, valueEntities) {
  var treeNodeLabelProp = props.treeNodeLabelProp,
      treeCheckable = props.treeCheckable,
      treeCheckStrictly = props.treeCheckStrictly,
      showCheckedStrategy = props.showCheckedStrategy;

  // Will hide some value if `showCheckedStrategy` is set

  if (treeCheckable && !treeCheckStrictly) {
    var values = {};
    valueList.forEach(function (wrappedValue) {
      values[wrappedValue.value] = wrappedValue;
    });
    var hierarchyList = flatToHierarchy(valueList.map(function (_ref3) {
      var value = _ref3.value;
      return valueEntities[value];
    }));

    if (showCheckedStrategy === _strategies.SHOW_PARENT) {
      // Only get the parent checked value
      return hierarchyList.map(function (_ref4) {
        var node = _ref4.node;

        var value = (0, _propsUtil.getPropsData)(node).value;
        return {
          label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
          value: value
        };
      });
    }
    if (showCheckedStrategy === _strategies.SHOW_CHILD) {
      // Only get the children checked value
      var targetValueList = [];

      // Find the leaf children
      var traverse = function traverse(_ref5) {
        var node = _ref5.node,
            children = _ref5.children;

        var value = (0, _propsUtil.getPropsData)(node).value;
        if (!children || children.length === 0) {
          targetValueList.push({
            label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
            value: value
          });
          return;
        }

        children.forEach(function (entity) {
          traverse(entity);
        });
      };

      hierarchyList.forEach(function (entity) {
        traverse(entity);
      });

      return targetValueList;
    }
  }

  return valueList.map(function (wrappedValue) {
    return {
      label: getLabel(wrappedValue, valueEntities[wrappedValue.value], treeNodeLabelProp),
      value: wrappedValue.value
    };
  });
}

/**
 * Use `rc-tree` convertDataToTree to convert treeData to TreeNodes.
 * This will change the label to title value
 */
function processProps(props) {
  var title = props.title,
      label = props.label,
      value = props.value,
      cls = props['class'],
      style = props.style,
      _props$on = props.on,
      on = _props$on === undefined ? {} : _props$on;

  var key = props.key;
  if (!key && (key === undefined || key === null)) {
    key = value;
  }
  var p = {
    props: (0, _omit2['default'])(props, ['on', 'key', 'class', 'className', 'style']),
    on: on,
    'class': cls || props.className,
    style: style,
    key: key
  };
  // Warning user not to use deprecated label prop.
  if (label && !title) {
    if (!warnDeprecatedLabel) {
      (0, _warning2['default'])(false, "'label' in treeData is deprecated. Please use 'title' instead.");
      warnDeprecatedLabel = true;
    }

    p.props.title = label;
  }

  return p;
}

function convertDataToTree(h, treeData) {
  return (0, _util.convertDataToTree)(h, treeData, { processProps: processProps });
}

/**
 * Use `rc-tree` convertTreeToEntities for entities calculation.
 * We have additional entities of `valueEntities`
 */
function initWrapper(wrapper) {
  return (0, _extends3['default'])({}, wrapper, {
    valueEntities: {}
  });
}

function processEntity(entity, wrapper) {
  var value = (0, _propsUtil.getPropsData)(entity.node).value;
  entity.value = value;

  // This should be empty, or will get error message.
  var currentEntity = wrapper.valueEntities[value];
  if (currentEntity) {
    (0, _warning2['default'])(false, 'Conflict! value of node \'' + entity.key + '\' (' + value + ') has already used by node \'' + currentEntity.key + '\'.');
  }
  wrapper.valueEntities[value] = entity;
}

function convertTreeToEntities(treeNodes) {
  return (0, _util.convertTreeToEntities)(treeNodes, {
    initWrapper: initWrapper,
    processEntity: processEntity
  });
}

/**
 * https://github.com/ant-design/ant-design/issues/13328
 * We need calculate the half check key when searchValue is set.
 */
// TODO: This logic may better move to rc-tree
function getHalfCheckedKeys(valueList, valueEntities) {
  var values = {};

  // Fill checked keys
  valueList.forEach(function (_ref6) {
    var value = _ref6.value;

    values[value] = false;
  });

  // Fill half checked keys
  valueList.forEach(function (_ref7) {
    var value = _ref7.value;

    var current = valueEntities[value];

    while (current && current.parent) {
      var parentValue = current.parent.value;
      if (parentValue in values) break;
      values[parentValue] = true;

      current = current.parent;
    }
  });

  // Get half keys
  return Object.keys(values).filter(function (value) {
    return values[value];
  }).map(function (value) {
    return valueEntities[value].key;
  });
}

var conductCheck = exports.conductCheck = _util.conductCheck;