function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export var waterMarkProps = {
  /** ClassName 前缀 */
  prefixCls: {
    type: String,
    "default": 'ant-pro'
  },

  /** 水印样式 */
  markStyle: [String, Object],

  /** 水印类名 */
  markClassName: String,

  /** 水印之间的水平间距 */
  gapX: Number,

  /** 水印之间的垂直间距 */
  gapY: Number,

  /** 追加的水印元素的z-index */
  zIndex: Number,

  /** 水印的宽度 */
  width: Number,

  /** 水印的高度 */
  height: Number,

  /** 水印在canvas 画布上绘制的垂直偏移量，正常情况下，水印绘制在中间位置, 即 offsetTop = gapY / 2 */
  offsetTop: Number,
  // 水印图片距离绘制 canvas 单元的顶部距离

  /** 水印在canvas 画布上绘制的水平偏移量, 正常情况下，水印绘制在中间位置, 即 offsetTop = gapX / 2 */
  offsetLeft: Number,

  /** 水印绘制时，旋转的角度，单位 ° */
  rotate: Number,

  /** 高清印图片源, 为了高清屏幕显示，建议使用 2倍或3倍图，优先使用图片渲染水印。 */
  image: String,

  /** 水印文字内容 */
  content: String,

  /** 文字颜色 */
  fontColor: String,

  /** 文字样式 */
  fontStyle: String,

  /** 文字族 */
  fontFamily: String,

  /** 文字粗细 */
  fontWeight: [String, Number],

  /** 文字大小 */
  fontSize: [String, Number]
};
/**
 * 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
 *
 * @param context
 * @see api 有些废弃了，其实类型 CanvasRenderingContext2D
 */
// @typescript-eslint/no-explicit-any

var getPixelRatio = function getPixelRatio(context) {
  if (!context) {
    return 1;
  }

  var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
};

var WaterMark = {
  name: 'WaterMark',
  props: waterMarkProps,
  data: function data() {
    return {
      base64Url: ''
    };
  },
  render: function render(h) {
    var _this = this;

    var markStyle = this.markStyle,
        markClassName = this.markClassName,
        _this$zIndex = this.zIndex,
        zIndex = _this$zIndex === void 0 ? 9 : _this$zIndex,
        _this$gapX = this.gapX,
        gapX = _this$gapX === void 0 ? 212 : _this$gapX,
        _this$gapY = this.gapY,
        gapY = _this$gapY === void 0 ? 222 : _this$gapY,
        _this$width = this.width,
        width = _this$width === void 0 ? 120 : _this$width,
        _this$height = this.height,
        height = _this$height === void 0 ? 64 : _this$height,
        _this$rotate = this.rotate,
        rotate = _this$rotate === void 0 ? -22 : _this$rotate,
        image = this.image,
        _this$content = this.content,
        content = _this$content === void 0 ? 'Pro Layout' : _this$content,
        offsetLeft = this.offsetLeft,
        offsetTop = this.offsetTop,
        _this$fontStyle = this.fontStyle,
        fontStyle = _this$fontStyle === void 0 ? 'normal' : _this$fontStyle,
        _this$fontWeight = this.fontWeight,
        fontWeight = _this$fontWeight === void 0 ? 'normal' : _this$fontWeight,
        _this$fontColor = this.fontColor,
        fontColor = _this$fontColor === void 0 ? 'rgba(0,0,0,.15)' : _this$fontColor,
        _this$fontSize = this.fontSize,
        fontSize = _this$fontSize === void 0 ? 16 : _this$fontSize,
        _this$fontFamily = this.fontFamily,
        fontFamily = _this$fontFamily === void 0 ? 'sans-serif' : _this$fontFamily,
        customizePrefixCls = this.prefixCls;
    var prefixCls = "".concat(customizePrefixCls, "-watermark");
    var wrapperCls = "".concat(prefixCls, "-wrapper");
    var waterMakrCls = [prefixCls, markClassName];
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var ratio = getPixelRatio(ctx);
    var canvasWidth = "".concat((gapX + width) * ratio, "px");
    var canvasHeight = "".concat((gapY + height) * ratio, "px");
    var canvasOffsetLeft = offsetLeft || gapX / 2;
    var canvasOffsetTop = offsetTop || gapY / 2;
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);

    if (ctx) {
      // 旋转字符 rotate
      ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio);
      ctx.rotate(Math.PI / 180 * Number(rotate));
      var markWidth = width * ratio;
      var markHeight = height * ratio;

      if (image) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = image;

        img.onload = function () {
          ctx.drawImage(img, 0, 0, markWidth, markHeight);
          _this.base64Url = canvas.toDataURL();
        };
      } else if (content) {
        var markSize = Number(fontSize) * ratio;
        ctx.font = "".concat(fontStyle, " normal ").concat(fontWeight, " ").concat(markSize, "px/").concat(markHeight, "px ").concat(fontFamily);
        ctx.fillStyle = fontColor;
        ctx.fillText(content, 0, 0);
        this.base64Url = canvas.toDataURL();
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('当前环境不支持Canvas');
    }

    return h("div", {
      style: _objectSpread({
        position: 'relative'
      }, this.$attrs.style),
      "class": wrapperCls
    }, [this.$slots["default"], h("div", {
      "class": waterMakrCls,
      style: _objectSpread({
        zIndex: zIndex,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundSize: "".concat(gapX + width, "px"),
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
        backgroundImage: "url('".concat(this.base64Url, "')")
      }, markStyle)
    })]);
  }
};
export default WaterMark;