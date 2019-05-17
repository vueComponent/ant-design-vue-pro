<template>
  <div>
    <v-chart :forceFit="true" :height="161" :data="data" :scale="scale" padding="30">
      <v-tooltip/>
      <v-interval
        shape="liquid-fill-gauge"
        position="gender*value"
        color="gender"
        :v-style="style1"
      />
      <v-guide
        v-for="(row, index) in data"
        :key="index"
        type="text"
        :top="true"
        :position="{ gender: row.gender,
            value: 50}"
        :content="row.value + '%'"
        :v-style="style2"
      />
    </v-chart>
  </div>
</template>

<script>
const data = [
  {
    gender: 'male',
    value: 50
  }
]
const scale = [
  {
    dataKey: 'value',
    min: 0,
    max: 100
  }
]

export default {
  data() {
    return {
      data,
      scale,
      style1: {
        lineWidth: 5,
        opacity: 0.75,
      },
      style2: {
        fontSize: 40,
        textAlign: 'center'
      },
    }
  }
}
</script>
