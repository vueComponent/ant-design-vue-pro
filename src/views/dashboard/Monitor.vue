<template>
  <div>
    <a-row :gutter="24">
      <a-col
        :xl="18"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
        style="margin-bottom: 24px">
        <a-card title="活动实时交易情况">
          <a-row>
            <a-col :md="6" :sm="12" :xs="24">
              <MiniCard title="今日交易总额" total="123,1232" :titleFontSize="24" suffix="元"/>
            </a-col>
            <a-col :md="6" :sm="12" :xs="24">
              <MiniCard title="销售目标完成率" total="92%" :titleFontSize="24"/>
            </a-col>
            <a-col :md="6" :sm="12" :xs="24">
              <MiniCard title="活动剩余时间" total="00:53:31" :titleFontSize="24"/>
            </a-col>
            <a-col :md="6" :sm="12" :xs="24">
              <MiniCard title="今日交易总额" total="2444" :titleFontSize="24" suffix="元"/>
            </a-col>
          </a-row>
          <div class="mapChart">
            <a-tooltip title="开局一张图">
              <img
                src="https://gw.alipayobjects.com/zos/antfincdn/h%24wFbzuuzz/HBWnDEUXCnGnGrRfrpKa.png"
                alt="map"
              >
            </a-tooltip>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card title="活动情况预测" style="margin-bottom: 24px">
          <MiniCard title="目标评估" total="有望达到预期" :titleFontSize="24"/>
          <ActiveChart/>
        </a-card>
        <a-card title="券核效率" style="margin-bottom: 24px">
          <Gauge :data="[{value:2,title:'跳进率'}]" :height="180"/>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :xl="12" :lg="24" :sm="24" :xs="24" style="margin-bottom: 24px">
        <a-card title="各品类占比">
          <a-row :style=" {padding: '16px 0' }">
            <a-col :span="8">
              <Pie :data="[{type: '中式快餐',value: 28,color: '#6fb0fd'}]"/>
            </a-col>
            <a-col :span="8">
              <Pie :data="[{type: '西餐',value: 22,color: '#7be3d6'}]"/>
            </a-col>
            <a-col :span="8">
              <Pie :data="[{type: '火锅',value: 32,color: '#5acc74'}]"/>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :xl="6" :lg="12" :sm="24" :xs="24">
        <a-card title="热门搜索">
          <Cloud :data="tagData" :height="161"/>
        </a-card>
      </a-col>
      <a-col :xl="6" :lg="12" :sm="24" :xs="24">
        <a-card title="资源剩余">
          <WaterWave :data="[{value:80,key:'male'}]" :height="161"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Liquid, ChartCard, Pie, Cloud, WaterWave, Gauge, MiniCard, ActiveChart } from '@/components'

const tagData = [
  {
    'name': '延边朝鲜族自治州',
    'value': 96,
    'type': 2
  },
  {
    'name': '海南藏族自治州',
    'value': 76,
    'type': 1
  },
  {
    'name': '台东县',
    'value': 54,
    'type': 2
  },
  {
    'name': '防城港市',
    'value': 59,
    'type': 2
  },
  {
    'name': '阿克苏地区',
    'value': 13,
    'type': 1
  },
  {
    'name': '四平市',
    'value': 78,
    'type': 2
  },
  {
    'name': '上海市',
    'value': 78,
    'type': 1
  },
  {
    'name': '安顺市',
    'value': 83,
    'type': 2
  },
  {
    'name': '四平市',
    'value': 64,
    'type': 0
  },
  {
    'name': '鹤岗市',
    'value': 50,
    'type': 1
  },
  {
    'name': '南阳市',
    'value': 53,
    'type': 0
  }
]
export default {
  name: 'Monitor',
  components: {
    ChartCard,
    Pie,
    Cloud,
    WaterWave,
    Gauge,
    MiniCard,
    ActiveChart,
    Liquid
  },
  data () {
    return {
      tagData
    }
  },
  mounted () {
    window.dispatchEvent(new Event('resize'))
  }
}

</script>

<style scoped>
.mapChart {
  height: 452px;
  padding-top: 24px;
  text-align: center;
}
.mapChart > img {
  display: inline-block;
  max-width: 100%;
  max-height: 437px;
}
</style>
