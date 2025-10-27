<!-- 
 * qiun-data-charts 秋云高性能跨全端图表组件
 * Copyright (c) 2021 QIUN® 秋云 https://www.ucharts.cn All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * 复制使用请保留本段注释，感谢支持开源！
 * 为方便更多开发者使用，如有更好的建议请提交码云 Pull Requests ！
 *
 * uCharts®官方网站
 * https://www.uCharts.cn
 * 
 * 开源地址:
 * https://gitee.com/uCharts/uCharts
 * 
 * uni-app插件市场地址：
 * http://ext.dcloud.net.cn/plugin?id=271
 * 
 -->
<template>
  <div class="chartsview" :id="'ChartBoxId'+cid">
    <div v-if="mixinDatacomLoading">
      <!-- 自定义加载状态，请改这里 -->
      <qiun-loading :loadingType="loadingType" />
    </div>
    <div v-if="mixinDatacomErrorMessage && errorShow" @tap="reloading">
      <!-- 自定义错误提示，请改这里 -->
      <qiun-error :errorMessage="errorMessage" />
    </div>
    <div :id="'UC'+cid">
      <canvas
        :id="cid"
        :canvasId="cid"
        :width="cWidth*pixel"
        :height="cHeight*pixel"
        :style="{width:cWidth*pixel+'px',height:cHeight*pixel+'px', transform: 'scale('+(1/pixel)+')'}"
        :disable-scroll="disableScroll"
        v-on:tap="tap"
        v-on:click="tap"
        v-on:mousemove="mouseMove"
        v-on:mousedown="mouseDown"
        v-on:mouseup="mouseUp"
        v-on:touchstart="touchStart"
        v-on:touchmove="touchMove"
        v-on:touchend="touchEnd"
        v-show="showchart"
      />
    </div>
  </div>
</template>

<script>
import uCharts from './u-charts.js';
import cfu from './config-ucharts.js';
import qiunLoading from './qiun-loading.vue';
import qiunError from './qiun-error.vue';

function deepCloneAssign(origin = {}, ...args) {
  for (let i in args) {
    for (let key in args[i]) {
      if (args[i].hasOwnProperty(key)) {
        origin[key] = args[i][key] && typeof args[i][key] === 'object' ? deepCloneAssign(Array.isArray(args[i][key]) ? [] : {}, origin[key], args[i][key]) : args[i][key];
      }
    }
  }
  return origin;
}

function formatterAssign(args,formatter) {
  for (let key in args) {
    if(args.hasOwnProperty(key) && args[key] !== null && typeof args[key] === 'object'){
      formatterAssign(args[key],formatter)
    }else if(key === 'format' && typeof args[key] === 'string'){
      args['formatter'] = formatter[args[key]] ? formatter[args[key]] : undefined;
    }
  }
  return args;
}

function debounce(fn, wait) {
  let timer = false;
  return function() {
    clearTimeout(timer);
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer = false;
      fn.apply(this, arguments);
    }, wait);
  };
}

var rootdom = {top:0,left:0};
var lastMoveTime = null;

export default {
  name: 'qiun-vue-ucharts',
  components: {
    qiunLoading,qiunError
  },
  props: {
    type: {
      type: String,
      default: null
    },
    canvasId: {
      type: String,
      default: 'uchartsid'
    },
    canvas2d: {
      type: Boolean,
      default: false
    },
    background: {
      type: String,
      default: 'rgba(0,0,0,0)'
    },
    animation: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default() {
        return {
          categories: [],
          series: []
        };
      }
    },
    localdata:{
      type: Array,
      default() {
        return [];
      }
    },
    opts: {
      type: Object,
      default() {
        return {};
      }
    },
    loadingType: {
      type: Number,
      default: 2
    },
    errorShow: {
      type: Boolean,
      default: true
    },
    errorReload: {
      type: Boolean,
      default: true
    },
    errorMessage: {
      type: String,
      default: null
    },
    inScrollView: {
      type: Boolean,
      default: false
    },
    reshow: {
      type: Boolean,
      default: false
    },
    reload: {
      type: Boolean,
      default: false
    },
    disableScroll: {
      type: Boolean,
      default: false
    },
    optsWatch: {
      type: Boolean,
      default: true
    },
    onzoom: {
      type: Boolean,
      default: false
    },
    ontap: {
      type: Boolean,
      default: true
    },
    ontouch: {
      type: Boolean,
      default: false
    },
    onmouse: {
      type: Boolean,
      default: true
    },
    onmovetip: {
      type: Boolean,
      default: false
    },
    tooltipShow: {
      type: Boolean,
      default: true
    },
    tooltipFormat: {
      type: String,
      default: undefined
    },
    tooltipCustom: {
      type: Object,
      default: undefined
    },
    pageScrollTop: {
      type: Number,
      default: 0
    },
    tapLegend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      resizeObserver: null,
      cid: 'uchartsid',
      type2d: true,
      cWidth: 375,
      cHeight: 250,
      showchart: false,
      mixinDatacomErrorMessage:null,
      mixinDatacomLoading:true,
      pixel: 1,
      drawData:{},
      lastDrawTime:null,
    };
  },
  created(){
    this.cid = this.canvasId
    if (this.canvasId == 'uchartsid' || this.canvasId == '') {
      let t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      let len = t.length
      let id = ''
      for (let i = 0; i < 32; i++) {
        id += t.charAt(Math.floor(Math.random() * len))
      }
      this.cid = id
    }
    const pixel = window.devicePixelRatio || 1;
    this.pixel = pixel;
  },
  mounted() {
    this.$nextTick(()=>{
      this.beforeInit();
    })
    const time = 500;
    const _this = this;
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.getElementById('ChartBoxId'+this.cid);
    this.resizeObserver = new ResizeObserver(debounce(function(res) {
      if (_this.mixinDatacomLoading == true) {
        return;
      }
      let errmsg = _this.mixinDatacomErrorMessage;
      if (errmsg !== null && errmsg !== 'null' && errmsg !== '') {
        return;
      }
      _this.resizeHandler();
    }, time))
    this.resizeObserver.observe(element)
  },
  beforeDestroy() {
    delete cfu.option[this.cid]
    delete cfu.instance[this.cid]
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null
    }
  },
  watch: {
    chartDataProps: {
      handler(val, oldval) {
        if (typeof val === 'object') {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            this._clearChart();
            if (val.series && val.series.length > 0) {
              this.beforeInit();
            }else{
              this.mixinDatacomLoading = true;
              this.showchart = false;
              this.mixinDatacomErrorMessage = null;
            }
          }
        } else {
          this.mixinDatacomLoading = false;
          this._clearChart();
          this.showchart = false;
          this.mixinDatacomErrorMessage = '参数错误：chartData数据类型错误';
        }
      },
      immediate: false,
      deep: true
    },
    localdata:{
      handler(val, oldval) {
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          if (val.length > 0) {
            this.beforeInit();
          }else{
            this.mixinDatacomLoading = true;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = null;
          }
        }
      },
      immediate: false,
      deep: true
    },
    optsProps: {
      handler(val, oldval) {
        if (typeof val === 'object') {
          if (JSON.stringify(val) !== JSON.stringify(oldval) && this.optsWatch == true) {
            this.checkData(this.drawData);
          }
        } else {
          this.mixinDatacomLoading = false;
          this._clearChart();
          this.showchart = false;
          this.mixinDatacomErrorMessage = '参数错误：opts数据类型错误';
        }
      },
      immediate: false,
      deep: true
    },
    reshow(val, oldval) {
      if (val === true && this.mixinDatacomLoading === false) {
        setTimeout(() => {
          this.mixinDatacomErrorMessage = null;
          this.checkData(this.drawData);
        }, 200);
      }
    },
    reload(val, oldval) {
      if (val === true) {
        this.showchart = false;
        this.mixinDatacomErrorMessage = null;
        this.reloading();
      }
    },
    mixinDatacomErrorMessage(val, oldval) {
      if (val) {
        this.emitMsg({name: 'error', params: {type:"error", errorShow: this.errorShow, msg: val, id: this.cid}});
        if(this.errorShow){
          console.log('[秋云图表组件]' + val);
        }
      }
    },
    errorMessage(val, oldval) {
      if (val && this.errorShow && val !== null && val !== 'null' && val !== '') {
        this.showchart = false;
        this.mixinDatacomLoading = false;
        this.mixinDatacomErrorMessage = val;
      } else {
        this.showchart = false;
        this.mixinDatacomErrorMessage = null;
        this.reloading();
      }
    }
  },
  computed: {
    optsProps() {
      return JSON.parse(JSON.stringify(this.opts));
    },
    chartDataProps() {
      return JSON.parse(JSON.stringify(this.chartData));
    },
  },
  methods: {
    beforeInit(){
      this.mixinDatacomErrorMessage = null;
      if (typeof this.chartData === 'object' && this.chartData != null && this.chartData.series !== undefined && this.chartData.series.length > 0) {
        //拷贝一下chartData，为了opts变更后统一数据来源
        this.drawData = deepCloneAssign({}, this.chartData);
        this.mixinDatacomLoading = false;
        this.showchart = true;
        this.checkData(this.chartData);
      }else if(this.localdata.length>0){
        this.mixinDatacomLoading = false;
        this.showchart = true;
        this.localdataInit(this.localdata);
      }else{
        this.mixinDatacomLoading = true;
      }
    },
    localdataInit(resdata){
      //替换enum类型为正确的描述
      let needCategories = false;
      let tmpData = {categories:[], series:[]}
      let tmpcategories = []
      let tmpseries = [];
      //拼接categories
      needCategories = cfu.categories.includes(this.type)
      if(needCategories === true){
        //如果props中的chartData带有categories，则优先使用chartData的categories
        if(this.chartData && this.chartData.categories && this.chartData.categories.length>0){
          tmpcategories = this.chartData.categories
        }else{
          let tempckey = {};
          resdata.map(function(item, index) {
            if (item.text != undefined && !tempckey[item.text]) {
              tmpcategories.push(item.text)
              tempckey[item.text] = true
            }
          });
        }
        tmpData.categories = tmpcategories
      }
      //拼接series
      let tempskey = {};
      resdata.map(function(item, index) {
        if (item.group != undefined && !tempskey[item.group]) {
          tmpseries.push({ name: item.group, data: [] });
          tempskey[item.group] = true;
        }
      });
      //如果没有获取到分组名称(可能是带categories的数据，也可能是不带的饼图类)
      if (tmpseries.length == 0) {
        tmpseries = [{ name: '默认分组', data: [] }];
        //如果是需要categories的图表类型
        if(needCategories === true){
          for (let j = 0; j < tmpcategories.length; j++) {
            let seriesdata = 0;
            for (let i = 0; i < resdata.length; i++) {
              if (resdata[i].text == tmpcategories[j]) {
                seriesdata = resdata[i].value;
              }
            }
            tmpseries[0].data.push(seriesdata);
          }
        //如果是饼图类的图表类型
        }else{
          for (let i = 0; i < resdata.length; i++) {
            tmpseries[0].data.push({"name": resdata[i].text,"value": resdata[i].value});
          }
        }
      //如果有分组名
      } else {
        for (let k = 0; k < tmpseries.length; k++) {
          //如果有categories
          if (tmpcategories.length > 0) {
            for (let j = 0; j < tmpcategories.length; j++) {
              let seriesdata = 0;
              for (let i = 0; i < resdata.length; i++) {
                if (tmpseries[k].name == resdata[i].group && resdata[i].text == tmpcategories[j]) {
                  seriesdata = resdata[i].value;
                }
              }
              tmpseries[k].data.push(seriesdata);
            }
          //如果传了group而没有传text，即没有categories（正常情况下这种数据是不符合数据要求规范的）
          } else {
            for (let i = 0; i < resdata.length; i++) {
              if (tmpseries[k].name == resdata[i].group) {
                tmpseries[k].data.push(resdata[i].value);
              }
            }
          }
        }
      }
      tmpData.series = tmpseries
      //拷贝一下chartData，为了opts变更后统一数据来源
      this.drawData = deepCloneAssign({}, tmpData);
      this.checkData(tmpData)
    },
    reloading() {
      if(this.errorReload === false){
        return;
      }
      this.showchart = false;
      this.mixinDatacomErrorMessage = null;
      this.beforeInit();
    },
    checkData(anyData) {
      let cid = this.cid
      //复位opts
      if (this.type && cfu.type.includes(this.type)) {
        cfu.option[cid] = deepCloneAssign({}, cfu[this.type], this.opts);
        cfu.option[cid].canvasId = cid;
      } else {
        this.mixinDatacomLoading = false;
        this.showchart = false;
        this.mixinDatacomErrorMessage = '参数错误：props参数中type类型不正确';
      }
      //挂载categories和series
      let newData = deepCloneAssign({}, anyData);
      if (newData.series !== undefined && newData.series.length > 0) {
        this.mixinDatacomErrorMessage = null;
        cfu.option[cid].categories = newData.categories;
        cfu.option[cid].series = newData.series;
        this.$nextTick(()=>{
          this.init()
        })
      }
    },
    resizeHandler() {
      //渲染防抖
      let currTime = Date.now();
      let lastDrawTime = this.lastDrawTime?this.lastDrawTime:currTime-3000;
      let duration = currTime - lastDrawTime;
      if (duration < 1000) return;
      let chartdom = document.getElementById('ChartBoxId'+this.cid).getBoundingClientRect();
      this.showchart = true;
      if (chartdom.width > 0 && chartdom.height > 0) {
        if (chartdom.width !== this.cWidth || chartdom.height !== this.cHeight) {
          this.checkData(this.drawData)
        }
      }
    },
    _clearChart() {
      let cid = this.cid
      if (cfu.option[cid] && cfu.option[cid].context) {
        const ctx = cfu.option[cid].context;
        if(typeof ctx === "object" && !!!cfu.option[cid].update){
          ctx.clearRect(0, 0, this.cWidth*this.pixel, this.cHeight*this.pixel);
          ctx.draw();
        }
      }
    },
    init() {
      let cid = this.cid
      let chartdom = document.getElementById('ChartBoxId'+this.cid).getBoundingClientRect();
      if (chartdom.width > 0 && chartdom.height > 0) {
        this.mixinDatacomLoading = false;
        this.showchart = true;
        this.lastDrawTime = Date.now();
        this.cWidth = chartdom.width;
        this.cHeight = chartdom.height;
        cfu.option[cid].background = this.background == 'rgba(0,0,0,0)' ? '#FFFFFF' : this.background;
        cfu.option[cid].canvas2d = this.type2d;
        cfu.option[cid].pixelRatio = this.pixel;
        cfu.option[cid].animation = this.animation;
        cfu.option[cid].width = chartdom.width * this.pixel;
        cfu.option[cid].height = chartdom.height * this.pixel;
        cfu.option[cid].onzoom = this.onzoom;
        cfu.option[cid].ontap = this.ontap;
        cfu.option[cid].ontouch = this.ontouch;
        cfu.option[cid].onmouse = this.openmouse;
        cfu.option[cid].onmovetip = this.onmovetip;
        cfu.option[cid].tooltipShow = this.tooltipShow;
        cfu.option[cid].tooltipFormat = this.tooltipFormat;
        cfu.option[cid].tooltipCustom = this.tooltipCustom;
        cfu.option[cid].inScrollView = this.inScrollView;
        cfu.option[cid].lastDrawTime = this.lastDrawTime;
        cfu.option[cid].tapLegend = this.tapLegend;
        cfu.option[cid] = formatterAssign(cfu.option[cid],cfu.formatter)
        this.mixinDatacomErrorMessage = null;
        this.mixinDatacomLoading = false;
        this.showchart = true;
        cfu.option[cid].context = document.getElementById(cid).getContext("2d");
        if(cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true){
          this._updataUChart(cid)
        }else{
          setTimeout(()=>{
            cfu.option[cid].context.restore();
            cfu.option[cid].context.save();
            this._newChart(cid)
          },100)
        }
      } else {
        this.mixinDatacomLoading = false;
        this.showchart = false;
        if (this.reshow == true) {
          this.mixinDatacomErrorMessage = '布局错误：未获取到父元素宽高尺寸！canvas-id:' + cid;
        }
      }
    },
    getImage(){
      const canvas = document.getElementById(this.cid);
      this.emitMsg({name: 'getImage', params: {type:"getImage", base64: canvas.toDataURL('image/png')}});
    },
    _newChart(cid) {
      if (this.mixinDatacomLoading == true) {
        return;
      }
      this.showchart = true;
      cfu.instance[cid] = new uCharts(cfu.option[cid]);
      cfu.instance[cid].addEventListener('renderComplete', () => {
        this.emitMsg({name: 'complete', params: {type:"complete", complete: true, id: cid, opts: cfu.instance[cid].opts}});
        cfu.instance[cid].delEventListener('renderComplete')
      });
      cfu.instance[cid].addEventListener('scrollLeft', () => {
        this.emitMsg({name: 'scrollLeft', params: {type:"scrollLeft", scrollLeft: true, id: cid, opts: cfu.instance[cid].opts}});
      });
      cfu.instance[cid].addEventListener('scrollRight', () => {
        this.emitMsg({name: 'scrollRight', params: {type:"scrollRight", scrollRight: true, id: cid, opts: cfu.instance[cid].opts}});
      });
    },
    _updataUChart(cid) {
      cfu.instance[cid].updateData(cfu.option[cid])
    },
    tooltipDefault(item, category, index, opts) {
      if (category) {
        let data = item.data
        if(typeof item.data === "object"){
          data = item.data.value
        }
        return category + ' ' + item.name + ':' + data;
      } else {
        if (item.properties && item.properties.name) {
          return item.properties.name ;
        } else {
          return item.name + ':' + item.data;
        }
      }
    },
    showTooltip(e,cid) {
      let tc = cfu.option[cid].tooltipCustom
      if (tc && tc !== undefined && tc !== null) {
        let offset = undefined;
        if (tc.x >= 0 && tc.y >= 0) {
          offset = { x: tc.x, y: tc.y + 10 };
        }
        cfu.instance[cid].showToolTip(e, {
          index: tc.index,
          offset: offset,
          textList: tc.textList,
          formatter: (item, category, index, opts) => {
            if (typeof cfu.option[cid].tooltipFormat === 'string' && cfu.formatter[cfu.option[cid].tooltipFormat]) {
              return cfu.formatter[cfu.option[cid].tooltipFormat](item, category, index, opts);
            } else {
              return this.tooltipDefault(item, category, index, opts);
            }
          }
        });
      } else {
        cfu.instance[cid].showToolTip(e, {
          formatter: (item, category, index, opts) => {
            if (typeof cfu.option[cid].tooltipFormat === 'string' && cfu.formatter[cfu.option[cid].tooltipFormat]) {
              return cfu.formatter[cfu.option[cid].tooltipFormat](item, category, index, opts);
            } else {
              return this.tooltipDefault(item, category, index, opts);
            }
          }
        });
      }
    },
    tap(e) {
      let cid = this.cid
      let ontap = this.ontap
      let tooltipShow = this.tooltipShow
      let tapLegend = this.tapLegend
      if(ontap == false) return;
      let currentIndex=null
      let legendIndex=null
      let rchartdom = document.getElementById('UC'+cid).getBoundingClientRect()
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      // e.changedTouches = [];
      // e.changedTouches.unshift(tmpe)
      currentIndex=cfu.instance[cid].getCurrentDataIndex(e)
      legendIndex=cfu.instance[cid].getLegendDataIndex(e)
      if(tapLegend === true){
        cfu.instance[cid].touchLegend(e);
      }
      if(tooltipShow==true){
        this.showTooltip(e,cid)
      }
      this.emitMsg({name:"getIndex",params:{type:"getIndex",event:tmpe,currentIndex:currentIndex,legendIndex:legendIndex,id:cid, opts: cfu.instance[cid].opts}})
    },
    touchStart(e) {
      let cid = this.cid
      let ontouch = this.ontouch
      if(ontouch == false) return;
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      // e.changedTouches = [];
      // e.changedTouches.unshift(tmpe)
      if(cfu.option[cid].enableScroll === true && e.touches.length == 1){
        cfu.instance[cid].scrollStart(e);
      }
      this.emitMsg({name:"getTouchStart",params:{type:"touchStart",event:e.changedTouches[0],id:cid, opts: cfu.instance[cid].opts}})
    },
    touchMove(e) {
      let cid = this.cid
      let ontouch = this.ontouch
      if(ontouch == false) return;
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      // e.changedTouches = [];
      // e.changedTouches.unshift(tmpe)
      if(cfu.option[cid].enableScroll === true && e.changedTouches.length == 1){
        cfu.instance[cid].scroll(e);
      }
      if(cfu.option[cid].ontap === true && cfu.option[cid].enableScroll === false && this.onmovetip === true){
        if(cfu.option[cid].tooltipShow === true){
          this.showTooltip(e,cid)
        }
      }
      if(ontouch === true && cfu.option[cid].enableScroll === true && this.onzoom === true && e.changedTouches.length == 2){
        cfu.instance[cid].dobuleZoom(e);
      }
      this.emitMsg({name:"getTouchMove",params:{type:"touchMove",event:e.changedTouches[0],id:cid, opts: cfu.instance[cid].opts}})
    },
    touchEnd(e) {
      let cid = this.cid
      let ontouch = this.ontouch
      if(ontouch == false) return;
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      // e.changedTouches = [];
      // e.changedTouches.unshift(tmpe)
      if(cfu.option[cid].enableScroll === true && e.touches.length == 0){
        cfu.instance[cid].scrollEnd(e);
      }
      this.emitMsg({name:"getTouchEnd",params:{type:"touchEnd",event:e.changedTouches[0],id:cid, opts: cfu.instance[cid].opts}})
      if(this.ontap === true && cfu.option[cid].enableScroll === false && this.onmovetip === true){
        this.tap(e,true)
      }
    },
    mouseDown(e) {
      let cid = this.cid
      let onmouse = this.onmouse
      if(onmouse == false) return;
      let rchartdom = document.getElementById('UC'+cid).getBoundingClientRect()
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      e.changedTouches = [];
      e.changedTouches.unshift(tmpe)
      cfu.instance[cid].scrollStart(e)
      cfu.option[cid].mousedown=true;
      this.emitMsg({name:"getTouchStart",params:{type:"mouseDown",event:tmpe,id:cid, opts: cfu.instance[cid].opts}})
    },
    mouseMove(e) {
      let cid = this.cid
      let onmouse = this.onmouse
      let tooltipShow = this.tooltipShow
      if(onmouse == false) return;
      let rchartdom = document.getElementById('UC'+cid).getBoundingClientRect()
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      e.changedTouches = [];
      e.changedTouches.unshift(tmpe)
      if(cfu.option[cid].mousedown){
        cfu.instance[cid].scroll(e)
        this.emitMsg({name:"getTouchMove",params:{type:"mouseMove",event:tmpe,id:cid, opts: cfu.instance[cid].opts}})
      }else if(cfu.instance[cid]){
        if(tooltipShow==true){
          this.showTooltip(e,cid)
        }
      }
    },
    mouseUp(e) {
      let cid = this.cid
      let onmouse = this.onmouse
      if(onmouse == false) return;
      let rchartdom = document.getElementById('UC'+cid).getBoundingClientRect()
      let tmpe = {}
      tmpe = { x: e.offsetX / this.pixel, y:e.offsetY / this.pixel}
      e.changedTouches = [];
      e.changedTouches.unshift(tmpe)
      cfu.instance[cid].scrollEnd(e)
      cfu.option[cid].mousedown=false;
      this.emitMsg({name:"getTouchEnd",params:{type:"mouseUp",event:tmpe,id:cid, opts: cfu.instance[cid].opts}});
    },
    emitMsg(msg) {
      this.$emit(msg.name, msg.params);
    },
  }
}
</script>

<style scoped>
.chartsview {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
