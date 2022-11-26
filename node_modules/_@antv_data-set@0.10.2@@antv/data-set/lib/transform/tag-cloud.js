var assign = require('@antv/util/lib/mix');

var isString = require('@antv/util/lib/type/is-string');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var tagCloud = require('../util/tag-cloud');

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

var DEFAULT_OPTIONS = {
  fields: ['text', 'value'],
  // fields to keep
  font: function font() {
    return 'serif';
  },
  padding: 1,
  size: [500, 500],
  spiral: 'archimedean',
  // 'archimedean' || 'rectangular' || {function}
  // timeInterval: Infinity // max execute time
  timeInterval: 500 // max execute time
  // imageMask: '', // instance of Image, must be loaded

};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var layout = tagCloud();
  ['font', 'fontSize', 'padding', 'rotate', 'size', 'spiral', 'timeInterval'].forEach(function (key) {
    if (options[key]) {
      layout[key](options[key]);
    }
  });
  var fields = getFields(options);
  var text = fields[0],
      value = fields[1];

  if (!isString(text) || !isString(value)) {
    throw new TypeError('Invalid fields: must be an array with 2 strings (e.g. [ "text", "value" ])!');
  }

  var words = dataView.rows.map(function (row) {
    row.text = row[text];
    row.value = row[value];
    return row;
  });
  layout.words(words);

  if (options.imageMask) {
    layout.createMask(options.imageMask);
  }

  var result = layout.start();
  var tags = result._tags;
  var bounds = result._bounds;
  tags.forEach(function (tag) {
    tag.x += options.size[0] / 2;
    tag.y += options.size[1] / 2;
  });
  var _options$size = options.size,
      w = _options$size[0],
      h = _options$size[1];
  var hasImage = result.hasImage;
  tags.push({
    text: '',
    value: 0,
    x: hasImage ? 0 : bounds[0].x,
    y: hasImage ? 0 : bounds[0].y,
    opacity: 0
  });
  tags.push({
    text: '',
    value: 0,
    x: hasImage ? w : bounds[1].x,
    y: hasImage ? h : bounds[1].y,
    opacity: 0
  });
  dataView.rows = tags;
  dataView._tagCloud = result;
}

registerTransform('tag-cloud', transform);
registerTransform('word-cloud', transform);