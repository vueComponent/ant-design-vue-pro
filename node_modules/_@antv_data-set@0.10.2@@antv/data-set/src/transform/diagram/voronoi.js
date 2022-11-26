const assign = require('@antv/util/lib/mix');
const d3Voronoi = require('d3-voronoi');
const isArray = require('@antv/util/lib/type/is-array');
const {
  registerTransform
} = require('../../data-set');
const {
  getFields
} = require('../../util/option-parser');

const DEFAULT_OPTIONS = {
  // fields: [ 'x', 'y' ] // field x and field y, required
  // extend: [[x0, y0], [x1, y1]], // optional
  // size: [width, height], // optional
  as: [ '_x', '_y' ]
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: must be an array with two strings!');
  }
  const xField = as[0];
  const yField = as[1];

  const fields = getFields(options);
  if (!isArray(fields) && fields.length !== 2) {
    throw new TypeError('Invalid fields: must be an array with two strings!');
  }
  const x = fields[0];
  const y = fields[1];

  const rows = dataView.rows;
  const data = rows.map(row => [ row[x], row[y] ]);
  const voronoi = d3Voronoi.voronoi();
  if (options.extend) {
    voronoi.extent(options.extend);
  }
  if (options.size) {
    voronoi.size(options.size);
  }
  const polygons = voronoi(data).polygons();
  rows.forEach((row, i) => {
    const polygon = polygons[i].filter(point => !!point); // some points are null
    row[xField] = polygon.map(point => point[0]);
    row[yField] = polygon.map(point => point[1]);
  });
}

registerTransform('diagram.voronoi', transform);
registerTransform('voronoi', transform);
