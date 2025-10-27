<template>
  <page-header-wrapper>
    <!--
    <template v-slot:content>
      1.Boss用户通过
    </template>
    -->
    <div style="margin-bottom: 20px">
      <!--添加按钮-->
      <a-button type="primary" icon="plus" @click="onSave()"> 添加</a-button>
    </div>
    <div>
      <a-row :gutter="24">
        <a-col v-for="item in dataSource" :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
          <a-card
            :body-style="{ padding: '20px 24px 8px' }"
            :bordered="false"
          >
            <div class="chart-card-header">
              <div class="meta">
                <span class="chart-card-title"></span>
              </div>
              <div class="total">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="chart-card-content">
              <div class="content-fix">
                <span style="color: crimson">价格：{{ item.payAmount }}元</span>
                <a-divider v-if="item.originalPrice" type="vertical" />
                <span v-if="item.originalPrice" style="text-decoration: line-through">原价:{{ item.originalPrice }}元</span>
                <a-divider type="vertical" />
                <span>数量：{{ item.number }}条 ({{ div(item.payAmount, item.number, 2)}}元每条)</span>
              </div>
            </div>
            <div class="chart-card-footer">
              <div class="field"><a @click="onSave(item)"><a-icon type="edit" /> 编辑</a><a-divider type="vertical" /><a @click="remove(item)"><a-icon type="delete" /> 删除</a></div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!-- 模态框 -->
    <create-form
      ref="createModal"
      :visible="visible"
      :model="model"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </page-header-wrapper>
</template>

<script>
import moment from "moment";
import { Ellipsis } from "@/components";
import CreateForm from "@/views/modules/CreateForm";
import { List, Save, Remove } from "@/api/sms/plan";
// 导入计算工具
import { div } from "@/utils/operationUtil";

export default {
  name: "UserList",
  components: {
    Ellipsis,
    CreateForm,
  },
  data() {
    return {
      // 新增新增和编辑模板Modal
      visible: false,
      model: null,
      dataSource: [],
      div
    };
  },
  created() {
    this.list()
  },
  computed: {},
  methods: {
    async list() {
      const res = await List();
      this.dataSource = res.result;
    },
    // 删除
    remove(record) {
      const self = this;
      this.$confirm({
        title: "您确定要删除?",
        content: (h) => <div style="color:red;">正在删除：ID: {record.id}</div>,
        onOk() {
          return new Promise((resolve) => {
            Remove({ id: record.id })
              .then((response) => {
                if (response.code === 0) {
                  self.$message.success("操作成功");
                  // 刷新表格
                  self.list()
                } else {
                  self.$message.error(response.message);
                }
              })
              .catch((err) => {
                self.$message.error(err + "");
              })
              .finally(() => {
                resolve();
              });
          });
        },
        class: "test",
      });
    },
    /**
     * 添加和保存编辑
     */
    onSave(record) {
      this.visible = true;
      this.model = {
        title: record ? "编辑" : "添加",
        where: {
          // 是否显示
          notVshow: record === undefined,
          label: "ID",
          decorator: ["id", { initialValue: record ? record.id : '' }],
        },
        data: [
          {
            label: "价格",
            item: [
              {
                formType: "input",
                decorator: [
                  "payAmount",
                  {
                    initialValue: record ? record.payAmount : '',
                    rules: [{ required: true, message: "价格不能为空" }],
                  },
                ],
                placeholder: "请输入购买价格",
              },
            ],
          },
          {
            label: "原价",
            item: [
              {
                formType: "input",
                decorator: ["originalPrice", { initialValue: record ? record.originalPrice : '' }],
                placeholder: "商品原价，为空不设置",
              },
            ],
          },
          {
            label: "短信数量",
            item: [
              {
                formType: "input",
                decorator: [
                  "number",
                  {
                    initialValue: record ? record.number : '',
                    rules: [{ required: true, message: "短信数量不能为空" }],
                  },
                ],
                placeholder: "请输入短信数量",
              },
            ],
          },
        ],
      };
    },
    /**
     * 添加和编辑关闭
     */
    handleCancel() {
      const form = this.$refs.createModal.form;
      form.resetFields();
      this.visible = false;
    },
    /**
     * 添加和编辑提交表单
     */
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 编辑
          Save(values).then((response) => {
            if (response.code === 0) {
              this.$message.success("操作成功");
              this.visible = false;
              // 刷新表格
              this.list();
            } else {
              this.$message.error(response.message);
            }
          }).catch((error) => {
            this.$message.error(error + "");
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.chart-card-header {
  position: relative;
  overflow: hidden;
  width: 100%;

  .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}

.chart-card-action {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.chart-card-footer {
  border-top: 1px solid #e8e8e8;
  padding-top: 9px;
  margin-top: 8px;

  > * {
    position: relative;
  }

  .field {
    float: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
}

.chart-card-content {
  margin-bottom: 12px;
  position: relative;
  height: 46px;
  width: 100%;

  .content-fix {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}

.total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 22px;
  line-height: 38px;
  height: 38px;
}
</style>
