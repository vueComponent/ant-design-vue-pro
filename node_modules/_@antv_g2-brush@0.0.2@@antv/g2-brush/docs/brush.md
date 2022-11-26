# API

First of all, the brush instance must be created after the chart be rendered.


```js
import Brush from '@antv/brush';

const brush = new Brush({
  // properties
});
```

## Properties

- `canvas` 

An instance of G.Canvas. **Must be set**. If use it for G2 chart, just get it by `chart.get('canvas')`.

```js
canvas: chart.get('canvas')
```

- `chart`

An instance of G2.Chart. Set the brush target, then after brush action end, 
data will be automatically filtered when the `filter` property is true.

- `type` 

String. Set the brush type, default is **'XY'**, also you can set **'X'**, **'Y'**, **'POLYGON'**. Case insensitive.

- `style`

Object. It's for setting the brush style. Default value is: 

```js
{
  fill: '#C5D4EB',
  opacity: 0.3,
  lineWidth: 1,
  stroke: '#82A6DD'
}
```

- `inPlot`

Boolean. Decide if the selection range is limited to the drawing area. Default value is true.

- `filter`

Boolean. Decide if automatically filter the data, default value is decided by `dragable` value，!dragable. But still set by the user. 
 
- `dragable`

Boolean. Set whether the shape can be dragged, default is `false`, then `filter` is true.

- `xField`

String. Set the selected x-axis field name, used to get the scale instance of the x-axis. Optional.

- `yField`

String. Set the selected y-axis field name, used to get the scale instance of the y-axis. Optional.

- `onBrushstart`

Function. [examples](https://antvis.github.io/g2-brush/demos/#/highlight)

```js
onBrushstart(ev) {
  // at the begining of the selection, you can define some properties, like chart xScale etc.
  const me = this; // On behalf of the object itself
  me.chart = chart;
}
```

- `onBrushmove`

Function. [examples](https://antvis.github.io/g2-brush/demos/#/highlight)

```js
onBrushmove(ev) {
  // during selection
  const { data, shapes, x, y, ...others } = ev;
}
```

- `onBrushend`

Function. [examples]()

```js
onBrushend(ev) {
  // selection stoped
  const { data, shapes, x, y, ...others } = ev;
}
```

- `onDragstart`

Function. Only `dragable` is true.

```js
onDragstart(ev) {
  // at the begining of the drag, you can define some properties, like chart xScale etc.
}
```

- `onDragmove`

Function. Only `dragable` is true.

[examples](https://antvis.github.io/g2-brush/demos/#/highlight)

```js
onDragmove(ev) {
  // during drag
  const { data, shapes, x, y, ...others } = ev;
}
```

- `onDragend`

Function. Only `dragable` is true.

[examples](https://antvis.github.io/g2-brush/demos/#/highlight)

```js
onDragend(ev) {
  // drag stoped
  const { data, shapes, x, y, ...others } = ev;
}
```

## Function

- `setType(type)`

used for change brush type, see [examples](https://antvis.github.io/g2-brush/demos/#/highlight).
