const Util = require('../util');
const CatHtml = require('./cat-html');
const {
  FONT_FAMILY
} = require('../const');

const DomUtil = Util.DomUtil;
const LIST_CLASS = 'g2-legend-list';
const SLIP_CLASS = 'g2-slip';
const CARET_UP_CLASS = 'g2-caret-up';
const CARET_DOWN_CLASS = 'g2-caret-down';
const ENABLED_CARET_COLOR = 'rgba(0,0,0,0.65)';
const DISABLED_CARET_COLOR = 'rgba(0,0,0,0.25)';

function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

class CatPageHtml extends CatHtml {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * type标识
       * @type {String}
       */
      type: 'category-page-legend',
      /**
       * html 容器
       * @type {DOM}
       */
      container: null,
      /**
       * 向上 / 下翻页图标的样式
       * @type {ATTRS}
       */
      caretStyle: {
        fill: 'rgba(0,0,0,0.65)'
      },
      /**
       * 页码文字的样式
       * @type {ATTRS}
       */
      pageNumStyle: {
        display: 'inline-block',
        fontSize: '12px',
        fontFamily: FONT_FAMILY,
        cursor: 'default'
      },
      /**
       * 翻页块 DOM 的样式
       * @type {ATTRS}
       */
      slipDomStyle: {
        width: 'auto',
        height: 'auto',
        position: 'absolute'
      },
      /**
       * 翻页块 DOM
       * @type {String}
       */
      slipTpl:
      '<div class="' + SLIP_CLASS + '" >' +
      '<svg viewBox="64 64 896 896" class="g2-caret-up" data-icon="left" style = "display:inline-block;vertical-align:middle;" width="1em" height="1em" aria-hidden="true">' +
      '<path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>' +
      '</svg>' +
      '<p class="cur-pagenum" style = "display:inline-block;vertical-align:middle;">1</p>' +
      '<p class="next-pagenum" style = "display:inline-block;vertical-align:middle;"">/2</p>' +
      '<svg viewBox="64 64 896 896" class="g2-caret-down" data-icon="right" style = "display:inline-block;vertical-align:middle;" width="1em" height="1em" aria-hidden="true">' +
      '<path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>' +
      '</svg>' +
      '</div>',
      /**
       * 翻页块的宽度，用于设置翻页块相对于 legend 的位置
       * @type {Number}
       */
      slipWidth: 65,
      /**
       * legend 内容超出容器的处理方式
       * @type {String}
       */
      legendOverflow: 'unset'
    });
  }

  render() {
    super._renderHTML();
    this._renderFlipPage();
  }

  _renderFlipPage() {
    const legendWrapper = this.get('legendWrapper');
    // ul
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);

    const position = this.get('position');
    const layout = this.get('layout');
    const isVertical = position === 'right' || position === 'left' || layout === 'vertical';
    const itemDisplay = isVertical ? 'block' : 'inline-block';
    const legengWrapperHeight = legendWrapper.offsetHeight;

    // 翻页
    if (legendWrapper.scrollHeight > legengWrapperHeight) {
      // append a slip div
      const slipTpl = this.get('slipTpl');
      const slipDom = DomUtil.createDom(slipTpl);
      const caretUpDom = findNodeByClass(slipDom, CARET_UP_CLASS);
      const caretDownDom = findNodeByClass(slipDom, CARET_DOWN_CLASS);
      DomUtil.modifyCSS(caretUpDom, this.get('caretStyle'));
      DomUtil.modifyCSS(caretUpDom, { fill: 'rgba(0,0,0,0.25)' });
      DomUtil.modifyCSS(caretDownDom, this.get('caretStyle'));
      const curPageNumDom = findNodeByClass(slipDom, 'cur-pagenum');
      const totalPageNumDom = findNodeByClass(slipDom, 'next-pagenum');
      const pageNumStyle = this.get('pageNumStyle');
      DomUtil.modifyCSS(curPageNumDom, Util.mix({}, pageNumStyle, { paddingLeft: '10px' }));
      DomUtil.modifyCSS(totalPageNumDom, Util.mix({}, pageNumStyle, { opacity: 0.3, paddingRight: '10px' }));

      // layout at the center-bottom of the legendWrapper
      DomUtil.modifyCSS(slipDom, Util.mix({}, this.get('slipDomStyle'), isVertical ? {
        top: legengWrapperHeight + 'px'
      } : {
        right: 0,
        top: '50%',
        // 横向布局的时候，分页在右侧居中对齐
        transform: 'translate(0, -50%)'
      }));

      legendWrapper.style.overflow = this.get('legendOverflow');
      legendWrapper.appendChild(slipDom);

      if (!isVertical) {
        const legendListMaxWidth = Math.max(legendWrapper.offsetWidth - 10 - slipDom.offsetWidth, 0);
        // 横向布局的时候更新list的宽度
        DomUtil.modifyCSS(itemListDom, { maxWidth: `${legendListMaxWidth}px` });
      }

      const li = itemListDom.childNodes;
      let curHeight = 0;
      // find the total page number
      let pages = 1;
      let blockLi = [];
      for (let i = 0; i < li.length; i++) {
        li[i].style.display = itemDisplay;
        curHeight = li[i].offsetTop + li[i].offsetHeight;
        if (curHeight > legengWrapperHeight) {
          pages++;
          blockLi.forEach(bl => {
            bl.style.display = 'none';
          });
          blockLi = [];
        }
        blockLi.push(li[i]);
      }
      totalPageNumDom.innerText = ('/' + pages);
      // initialize the page
      li.forEach(l => {
        l.style.display = itemDisplay;
        curHeight = l.offsetTop + l.offsetHeight;
        if (curHeight > legengWrapperHeight) {
          l.style.display = 'none';
        }
      });
      // 上翻事件
      caretUpDom.addEventListener('click', () => {
        // it is the 1st page
        if (li[0].style.display === itemDisplay) return;
        // otherwise
        let firstDisplayItemIdx = -1;
        li.forEach((l, i) => {
          if (l.style.display === itemDisplay) {
            firstDisplayItemIdx = firstDisplayItemIdx === -1 ? i : firstDisplayItemIdx;
            l.style.display = 'none';
          }
        });
        for (let i = firstDisplayItemIdx - 1; i >= 0; i--) {
          li[i].style.display = itemDisplay;
          curHeight = li[firstDisplayItemIdx - 1].offsetTop + li[firstDisplayItemIdx - 1].offsetHeight;
          li[i].style.display = 'none';
          if (curHeight <= legengWrapperHeight) {
            li[i].style.display = itemDisplay;
          } else break;
        }
        // change the page number
        const currentPage = Number.parseInt(curPageNumDom.innerText, 10) - 1;
        if (currentPage === 1) {
          caretUpDom.style.fill = DISABLED_CARET_COLOR;
        } else {
          caretUpDom.style.fill = ENABLED_CARET_COLOR;
        }
        caretDownDom.style.fill = ENABLED_CARET_COLOR;
        curPageNumDom.innerText = currentPage;
      });

      // 下翻事件
      caretDownDom.addEventListener('click', () => {
        // it is the last page
        if (li[li.length - 1].style.display === itemDisplay) return;
        // otherwise
        let lastDisplayItemIdx = -1;
        li.forEach((l, i) => {
          if (l.style.display === itemDisplay) {
            lastDisplayItemIdx = i;
            l.style.display = 'none';
          }
        });
        for (let i = lastDisplayItemIdx + 1; i < li.length; i++) {
          li[i].style.display = itemDisplay;
          curHeight = li[i].offsetTop + li[i].offsetHeight;
          li[i].style.display = 'none';
          if (curHeight <= legengWrapperHeight) li[i].style.display = itemDisplay;
          else break;
        }
        // change the page number
        const currentPage = Number.parseInt(curPageNumDom.innerText, 10) + 1;
        if (currentPage === pages) {
          caretDownDom.style.fill = DISABLED_CARET_COLOR;
        } else {
          caretDownDom.style.fill = ENABLED_CARET_COLOR;
        }
        caretUpDom.style.fill = ENABLED_CARET_COLOR;
        curPageNumDom.innerText = currentPage;
      });
      this.set('slipDom', slipDom);
    }
  }
  destroy() {

    const slipDom = this.get('slipDom');
    if (slipDom && slipDom.parentNode) {
      slipDom.parentNode.removeChild(slipDom);
    }
    super.destroy();
  }
}

module.exports = CatPageHtml;
