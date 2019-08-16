<template>
  <div>
     <a-card :bordered="false" style="margin: -24px -24px 0px;background-color: #0399EC;color:#FFFFFF">
      <a-row :gutter="30" style="line-height: 34px;">
        <a-col :md="1" :sm="4"><a-icon type="left" style="fontSize:20px" /></a-col>
        <a-col :md="3" :sm="20" style="fontSize:20px">
          <a-icon type="credit-card" theme="filled" />
          受访者:杨溢
        </a-col>
        <a-col :md="5" :sm="24" style="fontSize:20px">
          <a-icon type="credit-card" theme="filled" style="fontSize:20px" />
          320123199408175777
        </a-col>
        <a-col :md="15" :sm="24" style="fontSize:20px;textAlign: right;">创建时间：2018-01-02</a-col>
      </a-row>
    </a-card>
   <a-card :bordered="false" style="margin:24px 24px 0px">
    <a-row :gutter="8">
      <a-col :span="5"><s-tree :dataSource="orgTree" :openKeys.sync="openKeys" :search="true" @click="handleClick" @add="handleAdd" @titleClick="handleTitleClick"></s-tree></a-col>
      <a-col :span="19"><h1>11111111111111</h1></a-col>
    </a-row>
    </a-card>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree';
import { getOrgTree, getServiceList } from '@/api/manage';

// import { Result } from '@/components'
// import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'success',
  components: {
    STree
  },
  data() {
    return {
      openKeys: ['key-01'],
      orgTree: []
    };
  },
  created() {
    getOrgTree().then(res => {
      this.orgTree = res.result;
    });
  },
  methods: {
    handleClick(e) {
      console.log('handleClick', e);
      this.queryParam = {
        key: e.key
      };
      this.$refs.table.refresh(true);
    },
    handleAdd(item) {
      console.log('add button, item', item);
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
      this.$refs.modal.add(item.key);
    },
    handleTitleClick(item) {
      console.log('handleTitleClick', item);
    }
  }
};
</script>

<style>
.ant-card-wider-padding .ant-card-body {
  padding: 18px 32px;
}
</style>
