'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_STYLE = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.toTitle = toTitle;
exports.getValuePropValue = getValuePropValue;
exports.getPropValue = getPropValue;
exports.isMultiple = isMultiple;
exports.isCombobox = isCombobox;
exports.isMultipleOrTags = isMultipleOrTags;
exports.isMultipleOrTagsOrCombobox = isMultipleOrTagsOrCombobox;
exports.isSingleMode = isSingleMode;
exports.toArray = toArray;
exports.getMapKey = getMapKey;
exports.preventDefaultEvent = preventDefaultEvent;
exports.findIndexInValueBySingleValue = findIndexInValueBySingleValue;
exports.getLabelFromPropsValue = getLabelFromPropsValue;
exports.getSelectKeys = getSelectKeys;
exports.findFirstMenuItem = findFirstMenuItem;
exports.includesSeparators = includesSeparators;
exports.splitBySeparators = splitBySeparators;
exports.defaultFilterFn = defaultFilterFn;
exports.validateOptionValue = validateOptionValue;
exports.saveRef = saveRef;
exports.generateUUID = generateUUID;

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function toTitle(title) {
  if (typeof title === 'string') {
    return title.trim();
  }
  return '';
}
function getValuePropValue(child) {
  if (!child) {
    return null;
  }
  var props = (0, _propsUtil.getPropsData)(child);
  if ('value' in props) {
    return props.value;
  }
  if ((0, _propsUtil.getKey)(child) !== undefined) {
    return (0, _propsUtil.getKey)(child);
  }
  if ((0, _propsUtil.getSlotOptions)(child).isSelectOptGroup) {
    var label = (0, _propsUtil.getComponentFromProp)(child, 'label');
    if (label) {
      return label;
    }
  }
  throw new Error('Need at least a key or a value or a label (only for OptGroup) for ' + child);
}

function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  if (prop === 'children') {
    var newChild = child.$slots ? (0, _vnode.cloneVNodes)(child.$slots['default'], true) : (0, _vnode.cloneVNodes)(child.componentOptions.children, true);
    if (newChild.length === 1 && !newChild[0].tag) {
      return newChild[0].text;
    }
    return newChild;
  }
  var data = (0, _propsUtil.getPropsData)(child);
  if (prop in data) {
    return data[prop];
  } else {
    return (0, _propsUtil.getAttrs)(child)[prop];
  }
}

function isMultiple(props) {
  return props.multiple;
}

function isCombobox(props) {
  return props.combobox;
}

function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

function getMapKey(value) {
  return (typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) + '-' + value;
}

function preventDefaultEvent(e) {
  e.preventDefault();
}

function findIndexInValueBySingleValue(value, singleValue) {
  var index = -1;
  if (value) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === singleValue) {
        index = i;
        break;
      }
    }
  }
  return index;
}

function getLabelFromPropsValue(value, key) {
  var label = void 0;
  value = toArray(value);
  if (value) {
    for (var i = 0; i < value.length; i++) {
      if (value[i].key === key) {
        label = value[i].label;
        break;
      }
    }
  }
  return label;
}

function getSelectKeys(menuItems, value) {
  if (value === null || value === undefined) {
    return [];
  }
  var selectedKeys = [];
  menuItems.forEach(function (item) {
    if ((0, _propsUtil.getSlotOptions)(item).isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(item.componentOptions.children, value));
    } else {
      var itemValue = getValuePropValue(item);
      var itemKey = item.key;
      if (findIndexInValueBySingleValue(value, itemValue) !== -1 && itemKey !== undefined) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}

var UNSELECTABLE_STYLE = exports.UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

var UNSELECTABLE_ATTRIBUTE = exports.UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'on'
};

function findFirstMenuItem(children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var props = (0, _propsUtil.getPropsData)(child);
    if ((0, _propsUtil.getSlotOptions)(child).isMenuItemGroup) {
      var found = findFirstMenuItem(child.componentOptions.children);
      if (found) {
        return found;
      }
    } else if (!(props.disabled || props.disabled === '')) {
      return child;
    }
  }
  return null;
}

function includesSeparators(str, separators) {
  for (var i = 0; i < separators.length; ++i) {
    if (str.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

function splitBySeparators(str, separators) {
  var reg = new RegExp('[' + separators.join() + ']');
  return str.split(reg).filter(function (token) {
    return token;
  });
}

function defaultFilterFn(input, child) {
  var props = (0, _propsUtil.getPropsData)(child);
  if (props.disabled) {
    return false;
  }
  var value = getPropValue(child, this.optionFilterProp);
  if (value.length && value[0].text) {
    value = value[0].text;
  } else {
    value = String(value);
  }
  return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
}

function validateOptionValue(value, props) {
  if (isSingleMode(props) || isMultiple(props)) {
    return;
  }
  if (typeof value !== 'string') {
    throw new Error('Invalid `value` of type `' + (typeof value === 'undefined' ? 'undefined' : (0, _typeof3['default'])(value)) + '` supplied to Option, ' + 'expected `string` when `tags/combobox` is `true`.');
  }
}

function saveRef(instance, name) {
  return function (node) {
    instance[name] = node;
  };
}

function generateUUID() {
  if (process.env.NODE_ENV === 'test') {
    return 'test-uuid';
  }
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
}