const assign = require('@antv/util/lib/mix');
const isString = require('@antv/util/lib/type/is-string');
const {
  registerTransform
} = require('../data-set');
const tagCloud = require('../util/tag-cloud');
const {
  getFields
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  fields: [ 'text', 'value' ], // fields to keep
  font: () => 'serif',
  padding: 1,
  size: [ 500, 500 ],
  spiral: 'archimedean', // 'archimedean' || 'rectangular' || {function}
  // timeInterval: Infinity // max execute time
  timeInterval: 500 // max execute time
  // imageMask: '', // instance of Image, must be loaded
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const layout = tagCloud();
  [
    'font',
    'fontSize',
    'padding',
    'rotate',
    'size',
    'spiral',
    'timeInterval'
  ].forEach(key => {
    if (options[key]) {
      layout[key](options[key]);
    }
  });
  const fields = getFields(options);
  const [ text, value ] = fields;
  if (!isString(text) || !isString(value)) {
    throw new TypeError('Invalid fields: must be an array with 2 strings (e.g. [ "text", "value" ])!');
  }
  const words = dataView.rows.map(row => {
    row.text = row[text];
    row.value = row[value];
    return row;
  });
  layout.words(words);
  if (options.imageMask) {
    layout.createMask(options.imageMask);
  }
  const result = layout.start();
  const tags = result._tags;
  const bounds = result._bounds;
  tags.forEach(tag => {
    tag.x += options.size[0] / 2;
    tag.y += options.size[1] / 2;
  });
  const [ w, h ] = options.size;
  const hasImage = result.hasImage;
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
