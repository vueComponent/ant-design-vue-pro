<template>
  <div>
    <Card title="流程进度" style="margin-bottom: 24px;" :bordered="false">
      <Steps :direction="stepDirection" :current="1">
        <template slot="progressDot" slot-scope="{ index, status, prefixCls }">
          <Popover
            v-if="status === 'process'"
            placement="topLeft"
            arrowPointAtCenter
          >
            <template slot="content">
              <div style="width: 160px;">
                吴加号
                <span class="text-secondary" style="float: right;">
                  <Badge status="default" text="未响应"></Badge>
                </span>
                <div class="text-secondary" style="margin=top: 4px;">
                  耗时：2小时25分钟
                </div>
              </div>
            </template>
            <span :class="`${prefixCls}-icon-dot`"></span>
          </Popover>
          <span v-else :class="`${prefixCls}-icon-dot`"></span>
        </template>
        <Step title="创建项目">
          <div class="text-secondary step-description" slot="description">
            曲丽丽
            <Icon type="dingding-o" style="margin-left: 8px;"></Icon>
            <div>2016-12-12 12:32</div>
          </div>
        </Step>
        <Step title="部门初审">
          <div class="step-description" slot="description">
            周毛毛
            <Icon
              type="dingding-o"
              style="color: #00A0E9; margin-left: 8px"
            ></Icon>
            <div>
              <a href>催一下</a>
            </div>
          </div>
        </Step>
        <Step title="财务复核"></Step>
        <Step title="完成"></Step>
      </Steps>
    </Card>

    <Card title="用户信息" style="margin-bottom: 24px;" :bordered="false">
      <DescriptionList style="margin-bottom: 24px;">
        <Description term="用户姓名">付小小</Description>
        <Description term="会员卡号">32943898021309809423</Description>
        <Description term="身份证">3321944288191034921</Description>
        <Description term="联系方式">18112345678</Description>
        <Description term="联系地址">
          曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
        </Description>
      </DescriptionList>
      <DescriptionList style="margin-bottom: 24px;" title="信息组">
        <Description term="某某数据">725</Description>
        <Description term="该数据更新时间">2017-08-08</Description>
        <Description>&nbsp;</Description>
        <Description>
          <span slot="term">
            某某数据
            <Tooltip title="数据说明">
              <Icon
                style="color: rgba(0, 0, 0, 0.43); margin-left: 4px;"
                type="info-circle-o"
              ></Icon>
            </Tooltip>
          </span>
          725
        </Description>
        <Description term="该数据更新时间">2017-08-08</Description>
      </DescriptionList>

      <h4 style="margin-bottom: 16px;">信息组</h4>

      <Card type="inner" title="多层级信息组">
        <DescriptionList
          size="small"
          style="margin-bottom: 16px;"
          title="组名称"
        >
          <Description term="负责人">林东东</Description>
          <Description term="角色码">1234567</Description>
          <Description term="所属部门">XX公司 - YY部</Description>
          <Description term="过期时间">2017-08-08</Description>
          <Description term="描述">
            这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
          </Description>
        </DescriptionList>
        <Divider style="margin: 16px 0"></Divider>
        <DescriptionList
          size="small"
          style="margin-bottom: 16px;"
          title="组名称"
          :col="1"
        >
          <Description term="学名">
            Citrullus lanatus (Thunb.) Matsum. et
            Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
          </Description>
        </DescriptionList>
        <Divider style="margin: 16px 0"></Divider>
        <DescriptionList size="small" title="组名称">
          <Description term="负责人">付小小</Description>
          <Description term="角色码">1234568</Description>
        </DescriptionList>
      </Card>
    </Card>
  </div>
</template>

<script>
import DescriptionList from "../../components/DescriptionList";
import {
  Card,
  Divider,
  Popover,
  Badge,
  Tooltip,
  Steps,
  Icon
} from "ant-design-vue";
const { Description } = DescriptionList;
const { Step } = Steps;
export default {
  components: {
    DescriptionList,
    Description,
    Divider,
    Popover,
    Badge,
    Tooltip,
    Card,
    Icon,
    Steps,
    Step
  },
  data() {
    return {
      operationkey: "tab1",
      stepDirection: "horizontal"
    };
  }
};
</script>

<style lang="less" scoped>
@import "~ant-design-vue/lib/style/themes/default.less";

.text-secondary {
  color: @text-color-secondary;
}

.step-description {
  font-size: 14px;
  position: relative;
  left: 38px;
  padding-top: 8px;
  text-align: left;
  & > div {
    margin-top: 8px;
    margin-bottom: 4px;
  }
}
</style>
