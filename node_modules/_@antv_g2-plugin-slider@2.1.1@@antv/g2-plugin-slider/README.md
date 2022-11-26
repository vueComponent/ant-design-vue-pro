# g2-plugin-slider 

[![npm package](https://img.shields.io/npm/v/@antv/g2-plugin-slider.svg)](https://www.npmjs.com/package/@antv/g2-plugin-slider)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/g2-plugin-slider.svg)](https://npmjs.org/package/@antv/g2-plugin-slider)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/antvis/g2-plugin-slider.svg)](http://isitmaintained.com/project/antvis/g2-plugin-slider "Percentage of issues still open")

A datazoom slider plugin for G2.

## Install

**首先**，你先要确保 [G2](https://github.com/antvis/g2) 已经加载。

如果你使用 npm，直接 `npm i @antv/g2-plugin-slider`。否则，直接下载[最新脚本](http://unpkg.alipay.com/@antv/g2-plugin-slider)。

```javascript
import G2 from '@antv/g2';
import Slider from '@antv/g2-plugin-slider';

const slider = new Slider({
  
});
```


```html
<script src="http://unpkg.alipay.com/@antv/g2@3.0.0-rc5.14"></script>
<script src="http://unpkg.alipay.com/@antv/g2-plugin-slider@1.0.0-rc.1"></script>

<script>
const slider = new Slider({

});  
</script>
```

## API Reference

### Create an instance

```js
new Slider({
  container: {string} | {HTMLElement},
  width?: {number} | {string},
  height?: {number},
  padding?: {object} | {number} | {array},
  xAxis: {string},
  yAxis: {string},
  start: {string} | {number},
  end: {string} | {number},
  startRadio?: {number},
  endRadio?: {number},
  minSpan: {number},
  maxSpan: {number},
  data: {array} | {dataview},
  fillerStyle?: {object},
  backgroundStyle?: {object},
  textStyle?: {object},
  handleStyle?: {object},
  backgroundChart?: {object}
});
```

- `container`

(string | HTMLElement)

对应 slider 的 DOM 容器，可以传入该 DOM 的 id 或者直接传入容器的 html 节点对象。

- `width`

(string | number)

设置 slider 组件的宽度，默认为 `auto`，表示自适应容器的宽度。

- `height`

(number)

设置 slider 组件的高度，默认为 26，单位为 'px'。

- `padding`

设置 slider 组件所在画布 canvas 的内边距，用于与图表对齐（默认图表的 canvas 容器也是带了内边距），默认值同 G2 默认主题的 padding 相同，[ 20, 20, 95, 80 ]。

- `xAxis`

(string)

**必须声明**，我们的 Slider 是带有背景图表的滑动条组件，该字段用于声明该背景图表的横轴映射字段，同时该字段也是数据过滤字段。

- `yAxis`

(string)

**必须声明**，我们的 Slider 是带有背景图表的滑动条组件，该字段用于声明该背景图表的纵轴轴映射字段。

- `data`

(array | dataview)

**必须声明**，数据源。

- `startRadio`

(number)

声明滑动条起始滑块的位置对应的范围边界值，值介于 [0, 1]。

注意：`startRadio` 和 `start` 同时声明时，以 `startRadio` 为准。

- `endRadio`

(number)

声明滑动条结束滑块的位置对应的范围边界值，值介于 [0, 1]。

注意：`endRadio` 和 `end` 同时声明时，以 `endRadio` 为准。


- `start`

(number | string)

声明滑动条起始滑块的位置对应的数据值，默认为最小值。

- `end`

(number | string)

声明滑动条结束滑块的位置对应的数据值，默认为最大值。

- `minSpan`

(number)

筛选的最小范围限制，必须对应原始数据的范围，如果是时间，请使用时间戳。

- `maxSpan`

(number)

筛选的最大范围限制，必须对应原始数据的范围，如果是时间，请使用时间戳。

- `scales`

(object)

用于对 `xAxis` 和 `yAxis` 字段进行[列定义](/zh-cn/g2/3.x/tutorial/how-to-scale.htm)，用于同操作的图表中对应的列定义相同。

示例代码：

  ```js
  scales: {
    [`${xAxis}`]: {
      type: 'time',
      mask: 'MM-DD'
    }
  }
  ```

- `onChange`

(function)

当滑动条滑块发生变化时，触发该回调函数，主要用于更新 ds 的状态量。该回调函数会提供一个参数，该参数是一个对象，包含如下属性：

  ```js
  onChange: (obj) => {
    const { startValue, endValue, startText, endText, startRadio, endRadio } = obj;
  }
  ```

  * `startValue` 起点滑块当前对应的原始数据值，如果是 `time` 或者 `timeCat` 类型是，该值为时间戳，请注意。
  * `endValue` 终点滑块当前对应的原始数据值，如果是 `time` 或者 `timeCat` 类型是，该值为时间戳，请注意。
  * `startText` 起点滑块当前的显示文本值
  * `endText` 终点滑块当前的显示文本值
  * `startRadio` 起点滑块当前对应的范围边界值，值介于 [0, 1]
  * `endRadio` 终点滑块当前对应的范围边界值，值介于 [0, 1]

> 说明1：之所以区分 text 和 value，是因为大部分情况下用户会对数值进行格式化，所以在设置状态量和更新状态量时，需要保证前后数值类型的一致。
> 说明2：若数据并非有序排列，则可以通过 `[startRadio, endRadio]` 获取到滑块起点和终点选中的范围

- `fillerStyle`

(object)

选中区域的样式配置，默认配置如下：

  ```js
  {
    fill: '#BDCCED',
    fillOpacity: 0.3
  }
  ```

图中红框框选区域： <img src="https://gw.alipayobjects.com/zos/rmsportal/iYFxRgDjRSiCyVPFozik.png" style="width: 59%;">

- `backgroundStyle`

(object)

slider 整体背景样式。

- `textStyle`

(object)

slider 辅助文本字体样式配置。

- `handleStyle`

(object)

slider 滑块的样式配置，可配置的属性如下：

  ```js
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/QXtfhORGlDuRvLXFzpsQ.png', // 可以使图片地址也可以是 data urls
    width: 5,
    height: 26
  }
  ```

- `backgroundChart`

(object)

slider 滑块的背景图表配置，可配置其图表类型以及颜色：

  ```js
  {
    type: [ 'area' ], // 图表的类型，可以是字符串也可是是数组
    color: '#CCD6EC'
  }
  ```

### Functions

- `slider.render()`

`slider.render()` 渲染组件，即将其绘制到页面上。

- `slider.changeData()`

`slider.changeData(data)` 更新数据源。

- `slider.repaint()`

`slider.repaint()` 重绘。

- `slider.destroy()`

`slider.destroy()` 销毁。
