// extra APIs
require('./api/geo');

require('./api/hierarchy');

require('./api/partition');

require('./api/statistics'); // connectors


require('./connector/default');

require('./connector/dsv');

require('./connector/geo-graticule');

require('./connector/geojson');

require('./connector/graph');

require('./connector/hexjson');

require('./connector/hierarchy');

require('./connector/topojson'); // transforms
// static


require('./transform/default');

require('./transform/filter');

require('./transform/fold');

require('./transform/map');

require('./transform/partition');

require('./transform/percent');

require('./transform/pick');

require('./transform/proportion');

require('./transform/rename');

require('./transform/reverse');

require('./transform/sort');

require('./transform/sort-by');

require('./transform/subset'); // imputation


require('./transform/fill-rows');

require('./transform/impute'); // statistics


require('./transform/aggregate'); // regression


require('./transform/regression'); // KDE


require('./transform/kde'); // binning


require('./transform/bin/hexagon');

require('./transform/bin/histogram');

require('./transform/bin/quantile');

require('./transform/bin/rectangle'); // geo


require('./transform/geo/centroid');

require('./transform/geo/projection');

require('./transform/geo/region'); // diagram


require('./transform/diagram/arc');

require('./transform/diagram/dagre');

require('./transform/diagram/sankey');

require('./transform/diagram/voronoi'); // hierarchy


require('./transform/hierarchy/cluster');

require('./transform/hierarchy/compact-box');

require('./transform/hierarchy/dendrogram');

require('./transform/hierarchy/indented');

require('./transform/hierarchy/pack');

require('./transform/hierarchy/partition');

require('./transform/hierarchy/tree');

require('./transform/hierarchy/treemap'); // tag cloud


require('./transform/tag-cloud'); // waffle


require('./transform/waffle'); // kernel smoothing


require('./transform/kernel-smooth/density');

require('./transform/kernel-smooth/regression');

module.exports = require('./data-set');