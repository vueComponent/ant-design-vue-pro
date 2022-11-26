const Util = require('../util');
const Category = require('./category');
const {
  FONT_FAMILY
} = require('../const');
const DomUtil = Util.DomUtil;
const Group = Util.Group;

const CONTAINER_CLASS = 'g2-legend';
const TITLE_CLASS = 'g2-legend-title';
const LIST_CLASS = 'g2-legend-list';
const ITEM_CLASS = 'g2-legend-list-item';
const TEXT_CLASS = 'g2-legend-text';
const MARKER_CLASS = 'g2-legend-marker';

// find a dom node from the chidren of the node with className.
function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

function getParentNode(node, className) {
  let nodeClass = node.className;
  if (Util.isNil(nodeClass)) {
    return node;
  }
  nodeClass = nodeClass.split(' ');
  if (nodeClass.indexOf(className) > -1) {
    return node;
  }

  if (node.parentNode) {
    if (node.parentNode.className === CONTAINER_CLASS) {
      return node.parentNode;
    }
    return getParentNode(node.parentNode, className);
  }

  return null;
}
function findItem(items, refer) {
  let rst = null;
  const value = (refer instanceof Group) ? refer.get('value') : refer;
  Util.each(items, item => {
    if (item.value === value) {
      rst = item;
      return false;
    }
  });
  return rst;
}

class CatHtml extends Category {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * type 标识
       * @type {String}
       */
      type: 'category-legend',
      /**
       * html 容器
       * @type {DOM}
       */
      container: null,
      /**
       * 使用html时的外层模板
       * @type {String}
       */
      containerTpl: '<div class="' + CONTAINER_CLASS + '">' +
        '<h4 class="' + TITLE_CLASS + '"></h4>' +
        '<ul class="' + LIST_CLASS + '"></ul>' +
        '</div>',
      /**
       * html 模板
       * @type {String|Function}
       */
      itemTpl: '<li class="' + ITEM_CLASS + ' item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
      '<i class="' + MARKER_CLASS + '" style="background-color:{color};"></i>' +
      '<span class="' + TEXT_CLASS + '">{value}</span></li>',
      /**
       * html style
       * @type {Attrs}
       */
      legendStyle: {},
      /**
       * 图例文字样式
       * @type {ATTRS}
       */
      textStyle: {
        fill: '#333',
        fontSize: 12,
        textAlign: 'middle',
        textBaseline: 'top',
        fontFamily: FONT_FAMILY
      },
      /**
       * 当文本太长时是否进行缩略
       * @type {Boolean}
       */
      abridgeText: false,
      /**
       * abridgeText 为 true 时，鼠标放置在 item 上时显示全称的悬浮 div 的 html 模板
       * @type {String}
       */
      tipTpl: '<div class="textTip"></div>',
      /**
       * abridgeText 为 true 时，鼠标放置在 item 上时显示全称的悬浮 div 的样式
       * @type {Attrs}
       */
      tipStyle: {
        display: 'none',
        fontSize: '12px',
        backgroundColor: '#fff',
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        padding: '3px',
        boxShadow: '2px 2px 5px #888'
      },
      /**
       * useHtml 为 true 时生效，用于自动定位
       * @type {[type]}
       */
      autoPosition: true
    });
  }

  _init() {
    return;
  }

  beforeRender() {
    return;
  }

  render() {
    this._renderHTML();
  }

  // user interaction
  _bindEvents() {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    if (this.get('hoverable')) {
      itemListDom.onmousemove = ev => this._onMousemove(ev);
      itemListDom.onmouseout = ev => this._onMouseleave(ev);
    }
    if (this.get('clickable')) {
      itemListDom.onclick = ev => this._onClick(ev);
    }
  }

  // mouse move listener of an item
  // when mouse over an item, reduce the opacity of the other items.
  _onMousemove(ev) {
    const items = this.get('items');
    const target = ev.target;
    let targetClass = target.className;
    targetClass = targetClass.split(' ');
    if (targetClass.indexOf(CONTAINER_CLASS) > -1 || targetClass.indexOf(LIST_CLASS) > -1) {
      return;
    }
    const parentDom = getParentNode(target, ITEM_CLASS);
    const hoveredItem = findItem(items, parentDom.getAttribute('data-value'));

    if (hoveredItem) {
      // change the opacity of other items
      this.deactivate();
      this.activate(parentDom.getAttribute('data-value'));
      this.emit('itemhover', {
        item: hoveredItem,
        currentTarget: parentDom,
        checked: hoveredItem.checked
      });
    } else if (!hoveredItem) {
      // restore the opacity of all the items
      this.deactivate();
      this.emit('itemunhover', ev);
    }
    return;
  }

  // mouse leave listener of an item
  _onMouseleave(ev) {
    // restore the opacity of all the items when mouse leave
    this.deactivate();
    this.emit('itemunhover', ev);
    return;
  }

  // the click listener of an item
  _onClick(ev) {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const unCheckedColor = this.get('unCheckColor');
    const items = this.get('items');
    const mode = this.get('selectedMode');
    const childNodes = itemListDom.childNodes;

    const target = ev.target;
    let targetClass = target.className;
    targetClass = targetClass.split(' ');
    if (targetClass.indexOf(CONTAINER_CLASS) > -1 || targetClass.indexOf(LIST_CLASS) > -1) {
      return;
    }
    const parentDom = getParentNode(target, ITEM_CLASS);
    const textDom = findNodeByClass(parentDom, TEXT_CLASS);
    const markerDom = findNodeByClass(parentDom, MARKER_CLASS);
    const clickedItem = findItem(items, parentDom.getAttribute('data-value'));

    if (!clickedItem) {
      return;
    }
    const domClass = parentDom.className;
    const originColor = parentDom.getAttribute('data-color');
    if (mode === 'single') { // 单选模式
      // update checked status
      clickedItem.checked = true;
      // 其他图例项全部置灰
      Util.each(childNodes, child => {
        if (child !== parentDom) {
          const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
          childMarkerDom.style.backgroundColor = unCheckedColor;
          child.className = child.className.replace('checked', 'unChecked');
          child.style.color = unCheckedColor;
          const childItem = findItem(items, child.getAttribute('data-value'));
          childItem.checked = false;
        } else {
          if (textDom) {
            textDom.style.color = this.get('textStyle').fill;
          }
          if (markerDom) {
            markerDom.style.backgroundColor = originColor;
          }
          parentDom.className = domClass.replace('unChecked', 'checked');
        }
      });
    } else { // 混合模式
      const clickedItemChecked = (domClass.indexOf('checked') !== -1);// domClass.includes('checked');
      let count = 0;
      Util.each(childNodes, child => {
        if (child.className.indexOf('checked') !== -1) { // .includes('checked')
          count++;
        }
      });
      if (!this.get('allowAllCanceled') && clickedItemChecked && count === 1) {
        this.emit('clicklastitem', {
          item: clickedItem,
          currentTarget: parentDom,
          checked: (mode === 'single') ? true : clickedItem.checked
        });
        return;
      }
      // 在判断最后一个图例后再更新checked状态，防止点击最后一个图例item时图例样式没有变化但是checked状态改变了 fix #422
      clickedItem.checked = !clickedItem.checked;
      if (clickedItemChecked) {
        if (markerDom) {
          markerDom.style.backgroundColor = unCheckedColor;
        }
        parentDom.className = domClass.replace('checked', 'unChecked');
        parentDom.style.color = unCheckedColor;
      } else {
        if (markerDom) {
          markerDom.style.backgroundColor = originColor;
        }
        parentDom.className = domClass.replace('unChecked', 'checked');
        parentDom.style.color = this.get('textStyle').fill;
      }
    }

    this.emit('itemclick', {
      item: clickedItem,
      currentTarget: parentDom,
      checked: (mode === 'single') ? true : clickedItem.checked
    });
    return;
  }

  // activate an item by reduce the opacity of other items.
  // it is reserved for bi-direction interaction between charts / graph and legend
  activate(value) {
    const self = this;
    const items = self.get('items');
    const item = findItem(items, value);

    const legendWrapper = self.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    childNodes.forEach(child => {
      const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
      const childItem = findItem(items, child.getAttribute('data-value'));
      if (this.get('highlight')) {
        if (childItem === item && childItem.checked) {
          childMarkerDom.style.border = '1px solid #333';
          return;
        }
      } else {
        if (childItem === item) {
          childMarkerDom.style.opacity = self.get('activeOpacity');
        } else {
          if (childItem.checked) childMarkerDom.style.opacity = self.get('inactiveOpacity');
        }
      }
      // if (childItem !== item && childItem.checked) {
      //   if (this.get('highlight')) {
      //     childMarkerDom.style.border = '1px solid #fff';
      //   } else childMarkerDom.style.opacity = 0.5;
      // } else {
      //   if (this.get('highlight')) {
      //     childMarkerDom.style.border = '1px solid #333';
      //   } else childMarkerDom.style.opacity = 1;
      // }
    });
    return;
  }

  // restore the opacity of items
  // it is reserved for bi-direction interaction between charts / graph and legend
  deactivate() {
    const self = this;
    const legendWrapper = self.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;
    childNodes.forEach(child => {
      const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
      if (this.get('highlight')) {
        childMarkerDom.style.border = '1px solid #fff';
      } else {
        childMarkerDom.style.opacity = self.get('inactiveOpacity');
      }
    });
    return;
  }

  _renderHTML() {
    // const canvas = this.get('canvas');
    let container = this.get('container');
    // const outterNode = container.parentNode;
    const title = this.get('title');
    const containerTpl = this.get('containerTpl');
    const legendWrapper = DomUtil.createDom(containerTpl);
    const titleDom = findNodeByClass(legendWrapper, TITLE_CLASS);
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS); // ul
    const unCheckedColor = this.get('unCheckColor');
    const LEGEND_STYLE = Util.deepMix({}, {
      CONTAINER_CLASS: {
        height: 'auto',
        width: 'auto',
        position: 'absolute',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: FONT_FAMILY,
        lineHeight: '20px',
        color: '#8C8C8C'
      },
      TITLE_CLASS: {
        marginBottom: this.get('titleGap') + 'px',
        fontSize: '12px',
        color: '#333', // 默认样式
        textBaseline: 'middle',
        fontFamily: FONT_FAMILY
      },
      LIST_CLASS: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        textAlign: 'center'
      },
      LIST_ITEM_CLASS: {
        cursor: 'pointer',
        marginBottom: '5px',
        marginRight: '24px'
      },
      MARKER_CLASS: {
        width: '9px',
        height: '9px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '4px',
        verticalAlign: 'middle'
      }
    }, this.get('legendStyle'));

    // fix：IE 9 兼容问题，先加入 legendWrapper
    // let container = this.get('container');
    if ((/^\#/.test(container)) || ((typeof container === 'string') && container.constructor === String)) { // 如果传入 dom 节点的 id
      const id = container.replace('#', '');
      container = document.getElementById(id);
      container.appendChild(legendWrapper);
    } else {
      const position = this.get('position');
      let rangeStyle = {};
      if (position === 'left' || position === 'right') {
        rangeStyle = {
          maxHeight: (this.get('maxLength') || container.offsetHeight) + 'px'
        };
      } else {
        rangeStyle = {
          maxWidth: (this.get('maxLength') || container.offsetWidth) + 'px'
        };
      }

      DomUtil.modifyCSS(legendWrapper, Util.mix({}, LEGEND_STYLE.CONTAINER_CLASS, rangeStyle, this.get(CONTAINER_CLASS)));
      container.appendChild(legendWrapper);
    }

    DomUtil.modifyCSS(itemListDom, Util.mix({}, LEGEND_STYLE.LIST_CLASS, this.get(LIST_CLASS)));

    // render title
    if (titleDom) {
      if (title && title.text) {
        titleDom.innerHTML = title.text;
        DomUtil.modifyCSS(titleDom, Util.mix({}, LEGEND_STYLE.TITLE_CLASS, this.get(TITLE_CLASS), title));
      } else {
        legendWrapper.removeChild(titleDom);
      }
    }

    // 开始渲染图例项
    const items = this.get('items');
    const itemTpl = this.get('itemTpl');

    const position = this.get('position');
    const layout = this.get('layout');
    const itemDisplay = ((position === 'right' || position === 'left') || layout === 'vertical') ? 'block' : 'inline-block';
    const itemStyle = Util.mix({}, LEGEND_STYLE.LIST_ITEM_CLASS, {
      display: itemDisplay
    }, this.get(ITEM_CLASS));
    const markerStyle = Util.mix({}, LEGEND_STYLE.MARKER_CLASS, this.get(MARKER_CLASS));
    Util.each(items, (item, index) => {
      const checked = item.checked;
      const value = this._formatItemValue(item.value);
      const markerColor = item.marker.fill || item.marker.stroke;
      const color = checked ? markerColor : unCheckedColor;
      let domStr;
      if (Util.isFunction(itemTpl)) {
        domStr = itemTpl(value, color, checked, index);
      } else {
        domStr = itemTpl;
      }

      const itemDiv = Util.substitute(domStr, Util.mix({}, item, {
        index,
        checked: checked ? 'checked' : 'unChecked',
        value,
        color,
        originColor: markerColor,
        // @2018-07-09 by blue.lb 修复如果legend值中存在双引号"时, 导致的无法点击触发legend正常操作bug
        originValue: item.value.replace(/\"/g, '&quot;')
      }));
      // li
      const itemDom = DomUtil.createDom(itemDiv);
      itemDom.style.color = this.get('textStyle').fill;
      const markerDom = findNodeByClass(itemDom, MARKER_CLASS);
      const textDom = findNodeByClass(itemDom, TEXT_CLASS);
      DomUtil.modifyCSS(itemDom, itemStyle);
      markerDom && DomUtil.modifyCSS(markerDom, markerStyle);
      // textDom && DomUtil.modifyCSS(textDom, this.get('textStyle'));

      if (!checked) {
        itemDom.style.color = unCheckedColor;
        if (markerDom) {
          markerDom.style.backgroundColor = unCheckedColor;
        }
      }
      itemListDom.appendChild(itemDom);

      // abridge the text if the width of the text exceeds the width of the item
      if (this.get('abridgeText')) {
        let text = value;
        // const itemWidth = parseFloat(this.get(ITEM_CLASS).width.substr(0, this.get(ITEM_CLASS).width.length - 2));
        const itemWidth = itemDom.offsetWidth;
        let fs = this.get('textStyle').fontSize;
        if (isNaN(fs)) {
          // 6.5pt = 6.5 * 1/72 * 96 = 8.6px
          if (fs.indexOf('pt') !== -1) fs = parseFloat(fs.substr(0, fs.length - 2)) * 1 / 72 * 96;
          else if (fs.indexOf('px') !== -1) fs = parseFloat(fs.substr(0, fs.length - 2));
        }
        const textWidth = fs * text.length;
        const letterNum = Math.floor(itemWidth / fs);
        if (itemWidth < 2 * fs) { // unable to contain '...'
          text = '';
        } else if (itemWidth < textWidth) { // replace the tail as '...
          if (letterNum > 1) text = text.substr(0, letterNum - 1) + '...';
        }
        textDom.innerText = text;

        // show the text tip while mouse hovering an item
        itemDom.addEventListener('mouseover', () => {
          const tipDom = findNodeByClass(legendWrapper.parentNode, 'textTip');
          tipDom.style.display = 'block';
          tipDom.style.left = itemDom.offsetLeft + itemDom.offsetWidth + 'px';
          tipDom.style.top = itemDom.offsetTop + 15 + 'px';
          tipDom.innerText = value;
        });
        // hide the text tip while mouse leave the item
        itemDom.addEventListener('mouseout', () => {
          const tipDom = findNodeByClass(legendWrapper.parentNode, 'textTip');
          tipDom.style.display = 'none';
        });
      }
    });

    // append the tip div as a brother node of legend dom
    if (this.get('abridgeText')) {
      const tipTpl = this.get('tipTpl');
      const tipDom = DomUtil.createDom(tipTpl);
      const tipDomStyle = this.get('tipStyle');
      DomUtil.modifyCSS(tipDom, tipDomStyle);
      legendWrapper.parentNode.appendChild(tipDom);
      // hide the tip while mouse entering the tip dom
      tipDom.addEventListener('mouseover', () => {
        tipDom.style.display = 'none';
      });
    }

    this.set('legendWrapper', legendWrapper);
  }

  _adjustPositionOffset() {
    const autoPosition = this.get('autoPosition');
    // @2018-12-29 by maplor. if autoPosition is false, don't set inline-style
    if (autoPosition === false) {
      return;
    }
    const position = this.get('position');
    const offset = this.get('offset');
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    if (offsetX) offset[0] = offsetX;
    if (offsetY) offset[1] = offsetY;
    const legendWrapper = this.get('legendWrapper');
    legendWrapper.style.left = position[0] + 'px';
    legendWrapper.style.top = position[1] + 'px';
    legendWrapper.style.marginLeft = offset[0] + 'px';
    legendWrapper.style.marginTop = offset[1] + 'px';
  }


  getWidth() {
    return DomUtil.getOuterWidth(this.get('legendWrapper'));
  }

  getHeight() {
    return DomUtil.getOuterHeight(this.get('legendWrapper'));
  }

  move(x, y) {
    if (!(/^\#/.test(this.get('container')))) {
      DomUtil.modifyCSS(this.get('legendWrapper'), {
        left: x + 'px',
        top: y + 'px'
      });
      this.set('x', x);
      this.set('y', y);
    } else {
      super.move(x, y);
    }
  }

  destroy() {
    const legendWrapper = this.get('legendWrapper');
    if (legendWrapper && legendWrapper.parentNode) {
      legendWrapper.parentNode.removeChild(legendWrapper);
    }
    super.destroy();
  }
}

module.exports = CatHtml;
