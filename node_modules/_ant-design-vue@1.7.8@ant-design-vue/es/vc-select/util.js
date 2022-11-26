import _typeof from 'babel-runtime/helpers/typeof';
import { getPropsData, getSlotOptions, getKey, getAttrs, getComponentFromProp } from '../_util/props-util';
import { cloneVNodes } from '../_util/vnode';

export function toTitle(title) {
  if (typeof title === 'string') {
    return title.trim();
  }
  return '';
}
export function getValuePropValue(child) {
  if (!child) {
    return null;
  }
  var props = getPropsData(child);
  if ('value' in props) {
    return props.value;
  }
  if (getKey(child) !== undefined) {
    return getKey(child);
  }
  if (getSlotOptions(child).isSelectOptGroup) {
    var label = getComponentFromProp(child, 'label');
    if (label) {
      return label;
    }
  }
  throw new Error('Need at least a key or a value or a label (only for OptGroup) for ' + child);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  if (prop === 'children') {
    var newChild = child.$slots ? cloneVNodes(child.$slots['default'], true) : cloneVNodes(child.componentOptions.children, true);
    if (newChild.length === 1 && !newChild[0].tag) {
      return newChild[0].text;
    }
    return newChild;
  }
  var data = getPropsData(child);
  if (prop in data) {
    return data[prop];
  } else {
    return getAttrs(child)[prop];
  }
}

export function isMultiple(props) {
  return props.multiple;
}

export function isCombobox(props) {
  return props.combobox;
}

export function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export function getMapKey(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '-' + value;
}

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export function findIndexInValueBySingleValue(value, singleValue) {
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

export function getLabelFromPropsValue(value, key) {
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

export function getSelectKeys(menuItems, value) {
  if (value === null || value === undefined) {
    return [];
  }
  var selectedKeys = [];
  menuItems.forEach(function (item) {
    if (getSlotOptions(item).isMenuItemGroup) {
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

export var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

export var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'on'
};

export function findFirstMenuItem(children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var props = getPropsData(child);
    if (getSlotOptions(child).isMenuItemGroup) {
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

export function includesSeparators(str, separators) {
  for (var i = 0; i < separators.length; ++i) {
    if (str.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

export function splitBySeparators(str, separators) {
  var reg = new RegExp('[' + separators.join() + ']');
  return str.split(reg).filter(function (token) {
    return token;
  });
}

export function defaultFilterFn(input, child) {
  var props = getPropsData(child);
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

export function validateOptionValue(value, props) {
  if (isSingleMode(props) || isMultiple(props)) {
    return;
  }
  if (typeof value !== 'string') {
    throw new Error('Invalid `value` of type `' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + '` supplied to Option, ' + 'expected `string` when `tags/combobox` is `true`.');
  }
}

export function saveRef(instance, name) {
  return function (node) {
    instance[name] = node;
  };
}

export function generateUUID() {
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