<template>
  <v-chart :forceFit="true" :height="262" :padding="padding" :data="pieData" :scale="scale">
    <v-coord type="theta" :innerRadius="0.8" :radius="0.95"></v-coord>
    <v-axis :show="false" />
    <v-tooltip :showTitle="showTitle"></v-tooltip>
    <v-legend :useHtml="true" position="right" :reactive="true"  :containerTpl="containerTplLegend" :itemTpl="itemTpl" :offset="offset"></v-legend>
    <v-pie position="percent" color="item" :vStyle="pieStyle" />
    <v-stack-interval position="percent" :color="color" ></v-stack-interval>
  </v-chart>
</template>

<script>
 import {getProvinceCompare}  from '@/api/home';
const DataSet = require('@antv/data-set');

const setStyle = () => {
  const id = 'legend-html';
  if (document.getElementById(id)) {
    return;
  }
  const styleTxt = `
        #canvas .g2-tooltip {
        position:absolute;
        visibility:hidden;
        border-style:solid;
        white-space:nowrap;
        z-index:9;
        transition:left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        background-color:rgb(255, 255, 255);
        border-width:1px;
        border-color: #999;
        border-radius:4px;
        color: #444;
        font-style:normal;
        font-variant:normal;
        font-weight:normal;
        font-stretch:normal;
        font-size:14px;
        font-family:sans-serif;
        line-height:21px;
        padding:5px;
        }

        #canvas .g2-tooltip-list {
        margin: 5px ;
        list-style-type:none;
        padding:0;
        }
        #canvas .g2-legend {
        top: 45%!important;
        }
        .g2-legend{
            position:absolute;
        }
        .g2-legend-list{
            list-style:none;
            margin:0;
            padding:0;
        }
        .g2-legend-list-item{
            cursor:pointer;
            font-size:14px;
            margin-top:15px;
        }
    `;
  const style = document.createElement('style');
  style.setAttribute('id', id);
  style.innerHTML = styleTxt;
  document.getElementsByTagName('head')[0].appendChild(style);
};
setStyle();
const data = [
  {
    country: 'Lithuania',
    litres: 501.9
  },
  {
    country: 'Czech',
    litres: 301.9
  },
  {
    country: 'Ireland',
    litres: 201.1
  },
  {
    country: 'Germany',
    litres: 165.8
  },
  {
    country: 'Australia',
    litres: 139.9
  },
  {
    country: 'Austria',
    litres: 128.3
  },
  {
    country: 'UK',
    litres: 99
  }
];

export default {
  data() {
    return {
      pieData:{},
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      padding: [0, 300, 0, 0],
      offset: [15, 0],
      showTitle: false,
      scale: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%'
        }
      ],
      containerTplTooltip: `<div class="g2-tooltip"><ul class="g2-tooltip-list"></ul></div>`,
      itemTplTooltip: '<li data-index={index}><span style="color:{color}">{name}:</span>{value}</li>',
      containerTplLegend: `<div class="g2-legend"> <table class="g2-legend-list"></table> </div>`,
      color: ['provinceName', ['#67b7dc', '#84b761', '#fdd400', '#cc4748', '#cd82ad', '#2f4074', '#448e4d', '#b7b83f', '#b9783f']],
    };
  },
  created(){
    const that=this;
     getProvinceCompare().then(res => {
      const ds = new DataSet();
      that.pieData  = ds
        .createView()
        .source(res.data.provinceCompare)
        .transform({
          type: 'percent',
          field: 'numPatient',
          dimension: 'provinceName',
          as: 'percent'
        });
    });
  },
  methods:{
    itemTpl(value, color, checked, index) {
    const obj = this.pieData.rows[index];
    const percent = (obj.percent * 100).toFixed(2) + '%';
    checked = checked ? 'checked' : 'unChecked';
    return (
      '<tr class="g2-legend-list-item item-' +
      index +
      ' ' +
      checked +
      '" data-value="' +
      value +
      '" data-color=' +
      color +
      ' >' +
      '<td style="width:120px;"><i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:' +
      color +
      ';"></i>' +
      '<span class="g2-legend-text" style="color: #666">' +
      value +
      '</span></td>' +
      '<td style="text-align: right">' +
      percent +
      '</td>' +
      '<td style="text-align: right;color: #666;width:80px">' +
      obj.numPatient +
      '</td>' +
      '</tr>'
    );
  }
  }
};
</script>
