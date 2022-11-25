'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeforeSelectionText = getBeforeSelectionText;
exports.getLastMeasureIndex = getLastMeasureIndex;
exports.replaceWithMeasure = replaceWithMeasure;
exports.setInputSelection = setInputSelection;
exports.validateSearch = validateSearch;
exports.filterOption = filterOption;
/**
 * Cut input selection into 2 part and return text before selection start
 */
function getBeforeSelectionText(input) {
  var selectionStart = input.selectionStart;

  return input.value.slice(0, selectionStart);
}

function lower(char) {
  return (char || '').toLowerCase();
}

/**
 * Find the last match prefix index
 */
function getLastMeasureIndex(text) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return prefixList.reduce(function (lastMatch, prefixStr) {
    var lastIndex = text.lastIndexOf(prefixStr);
    if (lastIndex > lastMatch.location) {
      return {
        location: lastIndex,
        prefix: prefixStr
      };
    }
    return lastMatch;
  }, { location: -1, prefix: '' });
}

function reduceText(text, targetText, split) {
  var firstChar = text[0];
  if (!firstChar || firstChar === split) {
    return text;
  }

  // Reuse rest text as it can
  var restText = text;
  var targetTextLen = targetText.length;
  for (var i = 0; i < targetTextLen; i += 1) {
    if (lower(restText[i]) !== lower(targetText[i])) {
      restText = restText.slice(i);
      break;
    } else if (i === targetTextLen - 1) {
      restText = restText.slice(targetTextLen);
    }
  }

  return restText;
}

/**
 * Paint targetText into current text:
 *  text: little@litest
 *  targetText: light
 *  => little @light test
 */
function replaceWithMeasure(text, measureConfig) {
  var measureLocation = measureConfig.measureLocation,
      prefix = measureConfig.prefix,
      targetText = measureConfig.targetText,
      selectionStart = measureConfig.selectionStart,
      split = measureConfig.split;

  // Before text will append one space if have other text

  var beforeMeasureText = text.slice(0, measureLocation);
  if (beforeMeasureText[beforeMeasureText.length - split.length] === split) {
    beforeMeasureText = beforeMeasureText.slice(0, beforeMeasureText.length - split.length);
  }
  if (beforeMeasureText) {
    beforeMeasureText = '' + beforeMeasureText + split;
  }

  // Cut duplicate string with current targetText
  var restText = reduceText(text.slice(selectionStart), targetText.slice(selectionStart - measureLocation - prefix.length), split);
  if (restText.slice(0, split.length) === split) {
    restText = restText.slice(split.length);
  }

  var connectedStartText = '' + beforeMeasureText + prefix + targetText + split;

  return {
    text: '' + connectedStartText + restText,
    selectionLocation: connectedStartText.length
  };
}

function setInputSelection(input, location) {
  input.setSelectionRange(location, location);

  /**
   * Reset caret into view.
   * Since this function always called by user control, it's safe to focus element.
   */
  input.blur();
  input.focus();
}

function validateSearch() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var split = props.split;

  return !split || text.indexOf(split) === -1;
}

function filterOption() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$value = _ref.value,
      value = _ref$value === undefined ? '' : _ref$value;

  var lowerCase = input.toLowerCase();
  return value.toLowerCase().indexOf(lowerCase) !== -1;
}