import _typeof from 'babel-runtime/helpers/typeof';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import warning from 'warning';
import omit from 'omit.js';
import { convertDataToTree as vcConvertDataToTree, convertTreeToEntities as vcConvertTreeToEntities, conductCheck as rcConductCheck } from '../../vc-tree/src/util';
import { hasClass } from '../../vc-util/Dom/class';
import { SHOW_CHILD, SHOW_PARENT } from './strategies';
import { getSlots, getPropsData, isEmptyElement } from '../../_util/props-util';

var warnDeprecatedLabel = false;

// =================== DOM =====================
export function findPopupContainer(node, prefixClass) {
  var current = node;
  while (current) {
    if (hasClass(current, prefixClass)) {
      return current;
    }
    current = current.parentNode;
  }

  return null;
}

// =================== MISC ====================
export function toTitle(title) {
  if (typeof title === 'string') {
    return title;
  }
  return null;
}

export function toArray(data) {
  if (data === undefined || data === null) return [];

  return Array.isArray(data) ? data : [data];
}

export function createRef() {
  var func = function setRef(node) {
    func.current = node;
  };
  return func;
}

// =============== Legacy ===============
export var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

export var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

/**
 * Convert position list to hierarchy structure.
 * This is little hack since use '-' to split the position.
 */
export function flatToHierarchy(positionList) {
  if (!positionList.length) {
    return [];
  }

  var entrances = {};

  // Prepare the position map
  var posMap = {};
  var parsedList = positionList.slice().map(function (entity) {
    var clone = _extends({}, entity, {
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

export function resetAriaId() {
  ariaId = 0;
}

export function generateAriaId(prefix) {
  ariaId += 1;
  return prefix + '_' + ariaId;
}

export function isLabelInValue(props) {
  var treeCheckable = props.treeCheckable,
      treeCheckStrictly = props.treeCheckStrictly,
      labelInValue = props.labelInValue;

  if (treeCheckable && treeCheckStrictly) {
    return true;
  }
  return labelInValue || false;
}

// =================== Tree ====================
export function parseSimpleTreeData(treeData, _ref) {
  var id = _ref.id,
      pId = _ref.pId,
      rootPId = _ref.rootPId;

  var keyNodes = {};
  var rootNodeList = [];

  // Fill in the map
  var nodeList = treeData.map(function (node) {
    var clone = _extends({}, node);
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
export function isPosRelated(pos1, pos2) {
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
export function cleanEntity(_ref2) {
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
export function getFilterTree(h, treeNodes, searchValue, filterFunc, valueEntities, Component) {
  if (!searchValue) {
    return null;
  }

  function mapFilteredNodeToData(node) {
    if (!node || isEmptyElement(node)) return null;

    var match = false;
    if (filterFunc(searchValue, node)) {
      match = true;
    }
    var children = getSlots(node)['default'];
    children = ((typeof children === 'function' ? children() : children) || []).map(mapFilteredNodeToData).filter(function (n) {
      return n;
    });
    if (children.length || match) {
      return h(
        Component,
        _mergeJSXProps([node.data, { key: valueEntities[getPropsData(node).value].key }]),
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
export function formatInternalValue(value, props) {
  var valueList = toArray(value);

  // Parse label in value
  if (isLabelInValue(props)) {
    return valueList.map(function (val) {
      if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object' || !val) {
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

export function getLabel(wrappedValue, entity, treeNodeLabelProp) {
  if (wrappedValue.label) {
    return wrappedValue.label;
  }

  if (entity) {
    var props = getPropsData(entity.node);
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
export function formatSelectorValue(valueList, props, valueEntities) {
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

    if (showCheckedStrategy === SHOW_PARENT) {
      // Only get the parent checked value
      return hierarchyList.map(function (_ref4) {
        var node = _ref4.node;

        var value = getPropsData(node).value;
        return {
          label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
          value: value
        };
      });
    }
    if (showCheckedStrategy === SHOW_CHILD) {
      // Only get the children checked value
      var targetValueList = [];

      // Find the leaf children
      var traverse = function traverse(_ref5) {
        var node = _ref5.node,
            children = _ref5.children;

        var value = getPropsData(node).value;
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
    props: omit(props, ['on', 'key', 'class', 'className', 'style']),
    on: on,
    'class': cls || props.className,
    style: style,
    key: key
  };
  // Warning user not to use deprecated label prop.
  if (label && !title) {
    if (!warnDeprecatedLabel) {
      warning(false, "'label' in treeData is deprecated. Please use 'title' instead.");
      warnDeprecatedLabel = true;
    }

    p.props.title = label;
  }

  return p;
}

export function convertDataToTree(h, treeData) {
  return vcConvertDataToTree(h, treeData, { processProps: processProps });
}

/**
 * Use `rc-tree` convertTreeToEntities for entities calculation.
 * We have additional entities of `valueEntities`
 */
function initWrapper(wrapper) {
  return _extends({}, wrapper, {
    valueEntities: {}
  });
}

function processEntity(entity, wrapper) {
  var value = getPropsData(entity.node).value;
  entity.value = value;

  // This should be empty, or will get error message.
  var currentEntity = wrapper.valueEntities[value];
  if (currentEntity) {
    warning(false, 'Conflict! value of node \'' + entity.key + '\' (' + value + ') has already used by node \'' + currentEntity.key + '\'.');
  }
  wrapper.valueEntities[value] = entity;
}

export function convertTreeToEntities(treeNodes) {
  return vcConvertTreeToEntities(treeNodes, {
    initWrapper: initWrapper,
    processEntity: processEntity
  });
}

/**
 * https://github.com/ant-design/ant-design/issues/13328
 * We need calculate the half check key when searchValue is set.
 */
// TODO: This logic may better move to rc-tree
export function getHalfCheckedKeys(valueList, valueEntities) {
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

export var conductCheck = rcConductCheck;