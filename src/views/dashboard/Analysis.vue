<template>
    <div>
        <a-row :gutter="24">
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card title="总销售额" total="￥126,560">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
                            同周比
                            <span>12%</span>
                            <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
                        </div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px;">
                            日环比
                            <span>11%</span>
                            <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
                        </div>
                    </div>
                    <div slot="footer">日均销售额      <span>￥ 234.56</span></div>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card title="总销售额" total="￥126,560">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <mini-area />
                    </div>
                    <div slot="footer">日均销售额<span>￥ 234.56</span></div>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card title="总销售额" total="￥126,560">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
                            同周比
                            <span>12%</span>
                            <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
                        </div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px;">
                            日环比
                            <span>11%</span>
                            <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
                        </div>
                    </div>
                    <div slot="footer">日均销售额      <span>￥ 234.56</span></div>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card title="总销售额" total="￥126,560">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px; margin-right: 16px">
                            同周比
                            <span>12%</span>
                            <span style="color: #f5222d; font-size: 12px"><a-icon type="caret-up" /></span>
                        </div>
                        <div style="display: inline-block; font-size: 14px; line-height: 22px;">
                            日环比
                            <span>11%</span>
                            <span style="color: #52c41a; font-size: 12px"><a-icon type="caret-down" /></span>
                        </div>
                    </div>
                    <div slot="footer">日均销售额      <span>￥ 234.56</span></div>
                </chart-card>
            </a-col>
        </a-row>
    </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'

  export default {
    name: "Analysis",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea
    }
  }
</script>

<style scoped>

</style>