<template>
  <div>
    <div>
      <a-row :gutter="24">
        <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24" style="margin-bottom: 24px">
          <a-card title="活动实时交易情况">
            <a-row>
              <a-col :md="6" :sm="12" :xs="24">
                <miniCard
                  :loading="loading"
                  title="今日交易总额"
                  total="123,1232"
                  :titleFontSize="24"
                  suffix="元"
                  :mini="true"
                />
              </a-col>
              <a-col :md="6" :sm="12" :xs="24">
                <miniCard
                  :loading="loading"
                  title="销售目标完成率"
                  total="92%"
                  :titleFontSize="24"
                  :mini="true"
                />
              </a-col>
              <a-col :md="6" :sm="12" :xs="24">
                <miniCard
                  :loading="loading"
                  title="活动剩余时间"
                  total="00:53:31"
                  :titleFontSize="24"
                  :mini="true"
                />
              </a-col>
              <a-col :md="6" :sm="12" :xs="24">
                <miniCard
                  :loading="loading"
                  title="今日交易总额"
                  total="2444"
                  :titleFontSize="24"
                  suffix="元"
                  :mini="true"
                />
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
          <a-card title="活动情况预测" style="marginBottom:24px">
            <miniCard title="目标评估" total="有望达到预期" :titleFontSize="24" :mini="true"/>
            <ActiveChart
              :dataSource="searchUserData"
              :scale="searchUserScale"
            />
          </a-card>
          <a-card title="券核效率">
            <Gauge/>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24" style="margin-bottom: 24px">
          <a-card title="各品类占比">
            <a-row :style=" {padding: '16px 0' }">
              <a-col :span="8">
                <Pie/>
              </a-col>
              <a-col :span="8">
                <Pie/>
              </a-col>
              <a-col :span="8">
                <Pie/>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="热门搜索">
            <Cloud/>
          </a-card>
        </a-col>
        <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card title="资源剩余">
            <WaterWave/>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {  ChartCard, Pie, Cloud, WaterWave, Gauge ,miniCard,ActiveChart} from '@/components'

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, 'days')
      .format('DD'),
    y: Math.ceil(Math.random() * 5)
  })
}
export default {
  name: 'Monitor',
  components: {
    ChartCard,
    Pie,
    Cloud,
    WaterWave,
    Gauge,
    miniCard,
    ActiveChart
  },
  data() {
    return {
      searchUserData
    }
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
