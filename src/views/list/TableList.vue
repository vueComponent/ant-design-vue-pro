<template>
    <a-card :bordered="false">
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null : 'fold'">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="规则编号"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="使用状态"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-select placeholder="请选择">
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="调用次数"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input-number style="width: 100%" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="48" v-if="advanced">
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="更新日期"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-date-picker style="width: 100%" placeholder="请输入更新日期" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="使用状态"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择">
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24" >
                            <a-form-item
                                    label="描述"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 18, offset: 1}"
                            >
                                <a-input placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>

                <span style="float: right; margin-top: 3px;">
                  <a-button type="primary">查询</a-button>
                  <a-button style="margin-left: 8px">重置</a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
            </a-form>
        </div>

        <standard-table
            size="default"
            :columns="columns"
            :data="loadData"
            :selectedRows="selectedRows"
            @change="onChange"
        >
        </standard-table>
    </a-card>
</template>

<script>
  import StandardTable from '@/components/table/StandardTable'
  import AForm from "ant-design-vue/es/form/Form";

  const data = []

  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      no: 'NO ' + i,
      description: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      updatedAt: '2018-07-26'
    })
  }

  export default {
    name: "TableList",
    components: {
      AForm,
      StandardTable
    },
    data () {
      return {
        // 高级搜索 展开/关闭
        advanced: false,
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
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    methods: {

      onChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
    }
  }
</script>

<style lang="scss" scoped>
    .search {
        margin-bottom: 54px;
    }
    .fold {
        width: calc(100% - 216px);
        display: inline-block
    }
    .operator{
        margin-bottom: 18px;
    }
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>