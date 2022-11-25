# g2-brush

![](https://img.shields.io/badge/language-javascript-red.svg)
![](https://img.shields.io/badge/license-MIT-000000.svg)

[![npm package](https://img.shields.io/npm/v/@antv/g2-brush.svg)](https://www.npmjs.com/package/@antv/g2-brush)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/g2-brush.svg)](https://npmjs.org/package/@antv/g2-brush)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/antvis/g2-brush.svg)](http://isitmaintained.com/project/antvis/g2-brush "Percentage of issues still open")


## Install

```bash
$ npm install @antv/g2-brush
```

or use cdn:

```html
<script src="https://gw.alipayobjects.com/os/antv/assets/g2-brush/0.0.1/g2-brush.js"></script>
```

## Usage

First of all, the brush instance must be created after the chart be rendered.

```js
import Brush from '@antv/g2-brush';
// ...
chart.render();

new Brush({
  canvas: chart.get('canvas'), // must be set
  chart, // if you want to filter data by default, please set the chart
  type: 'X', // set the brush type, default value is 'XY'
});
```

### Example

online demos: [https://antvis.github.io/g2-brush/demos/#](https://antvis.github.io/g2-brush/demos/#)

![](https://gw.alipayobjects.com/zos/rmsportal/HRkzmAbHDcJYweUxDAlC.gif)

```js
$.getJSON('./data/top2000.json', data => {
  const ds = new DataSet();
  const dv = ds.createView('test')
    .source(data)
    .transform({
      as: [ 'count' ],
      groupBy: [ 'release' ],
      operations: [ 'count' ],
      type: 'aggregate'
    });

  const chart = new G2.Chart({
    container: 'canvas',
    forceFit: true,
    height: window.innerHeight
  });
  chart.source(dv);
  chart.scale({
    count: {
      alias: 'top2000 唱片总量'
    },
    release: {
      tickInterval: 5,
      alias: '唱片发行年份'
    }
  });
  chart.interval()
    .position('release*count')
    .color('#e50000');

  chart.render();

  new Brush({
    canvas: chart.get('canvas'),
    chart,
    type: 'X',
    onBrushstart() {
      chart.hideTooltip();
    },
    onBrushmove() {
      chart.hideTooltip();
    }
  });
  chart.on('plotdblclick', () => {
    chart.get('options').filters = {};
    chart.repaint();
  });
});
```

## API

[API DOCS](https://github.com/antvis/g2-brush/blob/master/docs/brush.md)

## Development

```bash
$ npm install

$ npm run dev
```

## How to Contribute

Please let us know how can we help. Do check out [issues](https://github.com/antvis/g2-brush/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](https://github.com/antvis/g2-brush/blob/master/CONTRIBUTING.md).
