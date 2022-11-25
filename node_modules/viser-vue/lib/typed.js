"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var props = ['dataKey', 'position', 'title', 'tick', 'subTick', 'grid', 'labels', 'line', 'tickLine', 'subTickCount', 'subTickLine', 'useHtml', 'id', 'container', 'height', 'width', 'animate', 'forceFit', 'background', 'plotBackground', 'padding', 'theme', 'renderer', 'filter', 'type', 'direction', 'radius', 'innerRadius', 'startAngle', 'endAngle', 'rotate', 'type', 'fields', 'rowField', 'colField', 'colValue', 'rowValue', 'colIndex', 'rowIndex', 'showTitle', 'autoSetAxis', 'padding', 'colTitle', 'rowTitle', 'eachView', 'cols', 'rows', 'padding', 'line', 'lineSmooth', 'transpose', 'views', 'type', 'position', 'autoRotate', 'vStyle', 'content', 'offsetX', 'offsetY', 'top', 'zIndex', 'start', 'end', 'lineStyle', 'line', 'text', 'src', 'width', 'heigth', 'alignX', 'alignY', 'html', 'color', 'apply', 'lineLength', 'direction', 'display', 'dataKey', 'show', 'position', 'title', 'titleGap', 'custom', 'offset', 'offsetX', 'offsetY', 'items', 'itemGap', 'itemsGroup', 'itemMarginBottom', 'itemWidth', 'unCheckColor', 'background', 'allowAllCanceled', 'itemFormatter', 'marker', 'textStyle', 'clickable', 'hoverable', 'selectedMode', 'onHover', 'onClick', 'reversed', 'layout', 'backPadding', 'useHtml', 'autoWrap', 'autoPosition', 'container', 'containerTpl', 'itemTpl', 'legendMarker', 'legendListItem', 'legendTitle', 'legendList', 'legendStyle', 'slidable', 'attachLast', 'flipPage', 'name', 'reactive', 'sizeType', 'isSegment', 'defaultClickHandlerEnabled', 'data', 'viewId', 'scale', 'forceFit', 'quickType', 'position', 'gemo', 'adjust', 'color', 'shape', 'size', 'opacity', 'label', 'tooltip', 'vStyle', 'select', 'active', 'animate', 'x', 'y', 'items', 'show', 'triggerOn', 'showTitle', 'title', 'crosshairs', 'offset', 'inPlot', 'follow', 'shared', 'enterable', 'position', 'hideMarkers', 'containerTpl', 'itemTpl', 'g2Tooltip', 'g2TooltipTitle', 'g2TooltipList', 'g2TooltipListItem', 'g2TooltipMarker', 'onShow', 'onHide', 'onChange', 'defaultPoint', 'timeStamp', 'plotRange', 'htmlContent', 'useHtml', 'type', 'pie', 'sector', 'line', 'smoothLine', 'dashLine', 'area', 'stackArea', 'smoothArea', 'bar', 'stackBar', 'dodgeBar', 'interval', 'stackInterval', 'dodgeInterval', 'point', 'funnel', 'pyramid', 'schema', 'box', 'candle', 'polygon', 'contour', 'heatmap', 'edge', 'sankey', 'errorBar', 'jitterPoint', 'venn', 'canvas', 'startPoint', 'brushing', 'dragging', 'brushShape', 'container', 'polygonPath', 'type', 'dragable', 'dragoffX', 'dragoffY', 'inPlot', 'xField', 'yField', 'filter', 'onBrushstart', 'onBrushmove', 'onBrushend', 'onDragstart', 'onDragmove', 'onDragend', 'container', 'xAxis', 'yAxis', 'data', 'width', 'height', 'padding', 'start', 'end', 'minSpan', 'maxSpan', 'scales', 'fillerStyle', 'backgroundStyle', 'textStyle', 'handleStyle', 'backgroundChart', 'onChange', 'start', 'end', 'onMouseEnter', 'onMouseDown', 'onMouseMove', 'onMouseLeave', 'onMouseUp', 'onClick', 'onDblClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onPlotEnter', 'onPlotMove', 'onPlotLeave', 'onPlotClick', 'onPlotDblClick', 'onTitleMouseDown', 'onTitleMouseMove', 'onTitleMouseLeave', 'onTitleMouseUp', 'onTitleClick', 'onTitleDblClick', 'onTitleTouchStart', 'onTitleTouchMove', 'onTitleTouchEnd', 'onItemMouseDown', 'onItemMouseMove', 'onItemMouseLeave', 'onItemMouseUp', 'onItemClick', 'onItemDblClick', 'onItemTouchStart', 'onItemTouchMove', 'onItemTouchEnd', 'onMarkerMouseDown', 'onMarkerMouseMove', 'onMarkerMouseLeave', 'onMarkerMouseUp', 'onMarkerClick', 'onMarkerDblClick', 'onMarkerTouchStart', 'onMarkerTouchMove', 'onMarkerTouchEnd', 'onTextMouseDown', 'onTextMouseMove', 'onTextMouseLeave', 'onTextMouseUp', 'onTextClick', 'onTextDblClick', 'onTextTouchStart', 'onTextTouchMove', 'onTextTouchEnd', 'onLabelMouseDown', 'onLabelMouseMove', 'onLabelMouseLeave', 'onLabelMouseUp', 'onLabelClick', 'onLabelDblClick', 'onLabelTouchStart', 'onLabelTouchMove', 'onLabelTouchEnd', 'onTicksMouseDown', 'onTicksMouseMove', 'onTicksMouseLeave', 'onTicksMouseUp', 'onTicksClick', 'onTicksDblClick', 'onTicksTouchStart', 'onTicksTouchMove', 'onTicksTouchEnd', 'onLineMouseDown', 'onLineMouseMove', 'onLineMouseLeave', 'onLineMouseUp', 'onLineClick', 'onLineDblClick', 'onLineTouchStart', 'onLineTouchMove', 'onLineTouchEnd', 'onGridMouseDown', 'onGridMouseMove', 'onGridMouseLeave', 'onGridMouseUp', 'onGridClick', 'onGridDblClick', 'onGridTouchStart', 'onGridTouchMove', 'onGridTouchEnd', 'onGuideRegionClick'];

function unique(array) {
  var res = [];

  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];

    if (res.indexOf(current) === -1) {
      res.push(current);
    }
  }

  return res;
}

function changeObj(array) {
  var uniqueProps = unique(array);
  var propsObject = {};

  for (var _i = 0, uniqueProps_1 = uniqueProps; _i < uniqueProps_1.length; _i++) {
    var res = uniqueProps_1[_i];
    propsObject[res] = null;
  }

  return propsObject;
}

var _default = changeObj(props);

exports.default = _default;