<template>
  <Card>
    <DescriptionList size="large" title="退款申请" style="margin-bottom: 32px;">
      <Description term="取货单号">1000000000</Description>
      <Description term="状态">已取货</Description>
      <Description term="销售单号">1234123421</Description>
      <Description term="子订单">3214321432</Description>
    </DescriptionList>
    <Divider style="margin-bottom: 32px;" />
    <DescriptionList size="large" title="用户信息" style="margin-bottom: 32px;">
      <Description term="用户姓名">付小小</Description>
      <Description term="联系电话">18100000000</Description>
      <Description term="常用快递">菜鸟仓储</Description>
      <Description term="取货地址">浙江省杭州市西湖区万塘路18号</Description>
      <Description term="备注">无</Description>
    </DescriptionList>
    <Divider style="margin-bottom: 32px;" />
  </Card>
</template>

<script>
import DescriptionList from "../../components/DescriptionList";
import { Divider, Card } from "ant-design-vue";
const { Description } = DescriptionList;
export default {
  components: {
    DescriptionList,
    Description,
    Divider,
    Card
  }
};
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.title {
  color: @heading-color;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
