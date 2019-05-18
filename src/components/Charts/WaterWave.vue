<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" padding="auto">
      <v-tooltip/>
      <v-interval
        shape="liquid-fill-gauge"
        position="key*value"
        color="key"
        :v-style="style1"
      />
      <v-guide
        v-for="(row, index) in data"
        :key="index"
        type="text"
        :top="true"
        :position="{ key: row.key,value: 50}"
        :content="row.value + '%'"
        :v-style="style2"
      />
    </v-chart>
  </div>
</template>

<script>
const scale = [
  {
    dataKey: 'value',
    min: 0,
    max: 100
  }
]

export default {
  data () {
    return {
      scale,
      style1: {
        lineWidth: 5,
        opacity: 0.75
      },
      style2: {
        fontSize: 40,
        textAlign: 'center'
      }
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [
          {
            key: 'male',
            value: 50
          }
        ]
      }
    },
    height: {
      type: Number,
      default: 161
    }
  }
}
</script>
