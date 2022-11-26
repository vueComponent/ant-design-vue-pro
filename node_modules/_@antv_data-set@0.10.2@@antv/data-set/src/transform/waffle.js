const assign = require('@antv/util/lib/mix');
const each = require('@antv/util/lib/each');
const forIn = require('@antv/util/lib/each');
const keys = require('@antv/util/lib/object/keys');
const map = require('@antv/util/lib/map');
const pick = require('@antv/util/lib/pick');
const {
  sum
} = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  fields: [ 'name', 'value' ], // fields
  rows: 5,
  size: [ 1, 1 ],
  scale: 1,
  groupBy: [],
  maxCount: 1000,
  gapRatio: 0.1,
  as: [ 'x', 'y' ]
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  const [ nameField, valueField ] = fields;
  const [ asX, asY ] = options.as;
  const groupBy = options.groupBy;
  const groups = partition(dataView.rows, groupBy);
  const groupKeys = keys(groups);
  const [ width, height ] = options.size;
  const maxCount = options.maxCount;
  const groupCount = groupKeys.length;
  const partHeight = height / groupCount;
  const rows = options.rows;
  const gapRatio = options.gapRatio;
  const result = [];
  let scale = options.scale;
  let currentGroupIndex = 0;
  let wStep = 0;

  // getting suitable scale and width step
  forIn(groups, group => {
    const totalValue = sum(map(group, row => row[valueField]));
    let cols = Math.ceil(totalValue * scale / rows);
    if (totalValue * scale > maxCount) {
      scale = maxCount / totalValue;
      cols = Math.ceil(totalValue * scale / rows);
    }
    wStep = width / cols;
  });

  // distributing values into grid
  forIn(groups, group => {
    const heightRange = [ currentGroupIndex * partHeight, (currentGroupIndex + 1) * partHeight ];
    const h = heightRange[1] - heightRange[0];
    const hStep = h * (1 - gapRatio) / rows;
    let currentCol = 0;
    let currentRow = 0;
    each(group, row => {
      const value = row[valueField];
      const count = Math.round(value * scale);
      for (let i = 0; i < count; i++) {
        if (currentRow === rows) {
          currentRow = 0;
          currentCol++;
        }
        const resultRow = pick(row, [ nameField, valueField ].concat(groupBy));
        resultRow[asX] = currentCol * wStep + wStep / 2;
        resultRow[asY] = currentRow * hStep + hStep / 2 + heightRange[0];
        resultRow._wStep = wStep;
        resultRow._hStep = hStep;
        currentRow++;
        result.push(resultRow);
      }
    });
    currentGroupIndex += 1;
  });

  dataView.rows = result;
}

registerTransform('waffle', transform);

