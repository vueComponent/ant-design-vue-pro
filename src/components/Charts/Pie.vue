<template>
  <div v-if="data.length">
    <v-chart :forceFit="true" height="128" :data="data" padding="auto">
      <v-tooltip></v-tooltip>
      <v-facet
        type="rect"
        :fields="['type']"
        :padding="[12, 0, 12, 0]"
        :showTitle="false"
        :eachView="eachView"
      />
    </v-chart>
  </div>
</template>

<script>
const data = [
  {
    type: '男性',
    value: 56.4
  },
]

const eachView = function(view, facet) {
  var data = facet.data
  var color  = '#1890ff'
  data.push({
    type: '其他',
    value: 100 - data[0].value
  })
  view.source(data)
  view.coord('theta', {
    innerRadius: 0.8
  })
  view
    .intervalStack()
    .position('value')
    .color('type', [color, '#eceef1'])
    .opacity(1)
  view.guide().html({
    position: ['50%', '50%'],
    html:
      '<div class="g2-guide-html"><p class="title">' +
      data[0].type +
      '</p><p class="value">' +
      (data[0].value + '%') +
      '</p></div>'
  })
}
export default {
  mounted() {
    this.setStyle()
  },
  methods: {
    setStyle() {
      const id = 'legend-html'
      if (document.getElementById(id)) {
        return
      }
      const styleTxt = `
        .g2-guide-html {
            width: 50px;
            height: 50px;
            vertical-align: middle;
            text-align: center;
            line-height: 1.5
        }

        .g2-guide-html .title {
            font-size: 14px;
            margin-bottom:0 !important;
        }

        .g2-guide-html .value {
            font-size: 24px;
        }
      `
      const style = document.createElement('style')
      style.setAttribute('id', id)
      style.innerHTML = styleTxt
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  },
  data() {
    return {
      data: data,
      eachView
    }
  }
}
</script>