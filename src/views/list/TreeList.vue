<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6">
        <a-menu
          class="custom-tree"
          @click="handleClick"
          style="width: 200px"
          :defaultSelectedKeys="['1']"
          :openKeys.sync="openKeys"
          mode="inline"
        >
          <a-sub-menu key="sub1" @titleClick="titleClick">
            <span slot="title"><a-icon type="mail" /><span>研发中心</span></span>
            <a-menu-item-group key="g1">
              <template slot="title">
                <span>后端组</span>
                <a-dropdown>
                  <a class="btn"><a-icon type="ellipsis" /></a>
                  <a-menu slot="overlay">
                    <a-menu-item key="1">新增</a-menu-item>
                    <a-menu-item key="2">合并</a-menu-item>
                    <a-menu-item key="3">移除</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <a-menu-item key="1">
                爪哇组
                <a class="btn"><a-icon type="plus" /></a>
              </a-menu-item>
              <a-menu-item key="2">
                拍黄片组
                <a class="btn"><a-icon type="plus" /></a>
              </a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group key="g2">
              <template slot="title">
                <span>前端组</span>
                <a class="btn"><a-icon type="ellipsis" /></a>
              </template>
              <a-menu-item key="2-1">
                React
                <a class="btn"><a-icon type="plus" /></a>
              </a-menu-item>
              <a-menu-item key="2-2">
                Vue
                <a class="btn"><a-icon type="plus" /></a>
              </a-menu-item>
              <a-menu-item key="2-3">
                Angular
                <a class="btn"><a-icon type="plus" /></a>
              </a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-sub-menu key="sub2" @titleClick="titleClick">
            <span slot="title"><a-icon type="appstore" /><span>财务部</span></span>
            <a-menu-item key="3-1">会计核算</a-menu-item>
            <a-menu-item key="3-2">成本控制</a-menu-item>
            <a-sub-menu key="sub3" title="内部控制">
              <a-menu-item key="3-3-1">财务制度建设</a-menu-item>
              <a-menu-item key="3-3-2">会计核算</a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title"><a-icon type="setting" /><span>Navigation Three</span></span>
            <a-menu-item key="9">Option 9</a-menu-item>
            <a-menu-item key="10">Option 10</a-menu-item>
            <a-menu-item key="11">Option 11</a-menu-item>
            <a-menu-item key="12">Option 12</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-col>
      <a-col :span="18">
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <span slot="action" slot-scope="text, record">
            <template v-if="$auth('table.update')">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
            </template>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">详情</a>
                </a-menu-item>
                <a-menu-item v-if="$auth('table.disable')">
                  <a href="javascript:;">禁用</a>
                </a-menu-item>
                <a-menu-item v-if="$auth('table.delete')">
                  <a href="javascript:;">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import STable from '@/components/table/'
import { getServiceList } from '@/api/manage'

export default {
  name: 'TreeList',
  components: {
    STable
  },
  data () {
    return {
      openKeys: ['sub1'],

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '规则编号',
          dataIndex: 'no'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '服务调用次数',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          customRender: (text) => text + ' 次'
        },
        {
          title: '状态',
          dataIndex: 'status',
          needTotal: true
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          sorter: true
        },
        {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    handleClick (e) {
      console.log('click', e)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  }
}
</script>

<style lang="less" scoped>
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>