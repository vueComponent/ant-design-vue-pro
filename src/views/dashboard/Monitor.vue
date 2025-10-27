<template>
  <page-header-wrapper v-if="pageShow">
    <template v-slot:extra>
      <a-tooltip title="刷新页面">
        <a-icon
          type="reload"
          :style="{ fontSize: '24px', color: '#151515' }"
          @click="refresh"
        />
      </a-tooltip>
    </template>
    <template v-slot:content>
      1.配置刷新时间后，刷新页面才能生效。
    </template>
    <!--
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info title="待处理订单" value="8" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="待审核用户" value="0" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="充值模板余额不足" value="0" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="查询掉线" value="0" />
        </a-col>
      </a-row>
    </a-card>
    -->
    <div :style="{ marginTop: '10px' }">
      <span v-action:masterSwitch style="font-size: 14px;">总开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.master_switch" @change="onMasterSwitch($event)" :style="{ marginRight: '16px' }" /></span>
      <a-button v-action:config icon="setting" type="primary" @click="saveConfig">
        配置
      </a-button>
    </div>
    <a-card
      style="margin-top: 10px"
      :bordered="false">
      <a-list
        itemLayout="horizontal"
      >
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="profile" :style="{ color: '#084B8A' }" /> 直充--充值中订单提醒</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryOrder('CHARGING')">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.order_zhichong_switch" @change="onOrderChargingSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countZhichongOrder > 0" style="color: #DF0101;font-weight:bold">{{ countZhichongOrder }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="profile" theme="twoTone" two-tone-color="#DF0101" /> 可疑订单提醒</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryOrder('DUBIOUS')">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.order_keyi_switch" @change="onOrderKeyiSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countDubiousOrder > 0" style="color: #DF0101;font-weight:bold">{{ countDubiousOrder }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="team" :style="{ color: '#FFBF00' }" /> 待审核会员</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryUserCheck">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.user_switch" @change="onUserSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countUserCheck > 0" style="color: #DF0101;font-weight:bold">{{ countUserCheck }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="appstore" :style="{ color: '#DF01A5' }" /> 充值模板余额提醒</a>
            <span slot="description">
              <span class="security-list-description">小于设置最低余额的模板</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryRechargeTpl">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.changetpl_switch" @change="onChangetplSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countChargeTpl > 0" style="color: #DF0101;font-weight:bold">{{ countChargeTpl }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="appstore" :style="{ color: '#0404B4' }" /> 查询模板</a>
            <span slot="description">
              <span class="security-list-description">已掉线模板</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryQueryTpl">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.querytpl_switch" @change="onQuerytplSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countQueryTpl > 0" style="color: #DF0101;font-weight:bold">{{ countQueryTpl }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="pay-circle" :style="{ color: '#DF0101' }" /> 代理商提现订单</a>
            <span slot="description">
              <span class="security-list-description">待处理订单</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryWithdrawAgent">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.agent_withdrawal_switch" @change="onChangeModifyAgentWithdrawaSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countWithdrawAgent > 0" style="color: #DF0101;font-weight:bold">{{ countWithdrawAgent }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="pay-circle" :style="{ color: '#DF0101' }" /> 公众号佣金提现订单</a>
            <span slot="description">
              <span class="security-list-description">自动提现失败，手动处理的订单</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryWithdrawWeixin">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.gongzhong_withdrawal_switch" @change="onChangeModifyGongzhongWithdrawaSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countWithdrawWeixin > 0" style="color: #DF0101;font-weight:bold">{{ countWithdrawWeixin }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="credit-card" theme="twoTone" two-tone-color="#eb2f96" /> 充值卡入库订单异常</a>
            <span slot="description">
              <span class="security-list-description">接口取卡异常情况，需要人工处理</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryCardOrder">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.card_order_switch" @change="onChangeModifyCardOrderSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countCardOrder > 0" style="color: #DF0101;font-weight:bold">{{ countCardOrder }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
        <a-list-item>
          <a-list-item-meta>
            <a slot="title"><a-icon type="credit-card" theme="twoTone" two-tone-color="#eb2f96" /> 充值卡可疑状态</a>
            <span slot="description">
              <span class="security-list-description">卡密转直充退款后，卡密设为可疑状态，等功能，需要人工处理</span>
            </span>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="queryCrad">点击查看</a>
          </div>
          <div slot="actions">
            提醒开关 <a-switch checked-children="开" un-checked-children="关" :checked="configData.card_switch" @change="onChangeModifyCardSwitch"/>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <p></p>
            </div>
            <div class="list-content-item">
              <p>待处理</p>
            </div>
            <div class="list-content-item">
              <p v-if="countCradDubious > 0" style="color: #DF0101;font-weight:bold">{{ countCradDubious }}</p>
              <p v-else style="color: #848484;font-weight:bold">0</p>
            </div>
            <div class="list-content-item">
              <p></p>
            </div>
          </div>
        </a-list-item>
      </a-list>
      <create-form
        ref="createModal"
        :visible="visible"
        :model="model"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from './modules/TaskForm'
import Info from './components/Info'
import { mapState } from 'vuex'
import CreateForm from '@/views/modules/CreateForm'
import { GetConfig, saveConfig, ModifyMasterSwitch, ModifyOrderChargingSwitch, ModifyOrderKeyiSwitch, ModifyUserSwitch, ModifyChangetplSwitch, ModifyQuerytplSwitch,
modifyAgentWithdrawaSwitch, modifyGongzhongWithdrawaSwitch, modifyCardOrderSwitch, modifyCardSwitch } from '@/api/index/monitor'

export default {
  name: 'StandardList',
  components: {
    TaskForm,
    Info,
    CreateForm
  },
  data () {
    return {
      // 页面是否显示
      pageShow: true,
      // 配置信息数据
      configData: [],
      visible: false,
      model: null
    }
  },
  created () {
    this.getConfig()
  },
  mounted () {
  },
  computed: {
    ...mapState({
      countZhichongOrder: state => state.user.countZhichongOrder,
      countDubiousOrder: state => state.user.countDubiousOrder,
      countUserCheck: state => state.user.countUserCheck,
      countChargeTpl: state => state.user.countChargeTpl,
      countQueryTpl: state => state.user.countQueryTpl,
      countWithdrawAgent: state => state.user.countWithdrawAgent,
      countWithdrawWeixin: state => state.user.countWithdrawWeixin,
      countCardOrder: state => state.user.countCardOrder,
      countCradDubious: state => state.user.countCradDubious
    })
  },
  methods: {
    // 刷新
    refresh () {
      this.pageShow = false
      this.$nextTick(function () {
        this.pageShow = true
        this.getConfig()
        // this.$message.success('刷新成功')
      })
      // this.$message.success('刷新成功')
    },
    /**
     * 获取配置
     */
    getConfig () {
      GetConfig().then(res => {
        // console.log('GetConfig', res)
        if (res.code === 0) {
          this.configData = res.result
          // alert(JSON.stringify(this.configData))
        } else {
          this.$notification['error']({
          message: '错误',
          description: res.message,
          duration: 4
          })
        }
      })
    },
    /**
     * 修改总开关
     */
    onMasterSwitch (checked) {
      ModifyMasterSwitch({ isSwitch: checked }).then(res => {
        // console.log('GetConfig', res)
        if (res.code === 0) {
          this.configData.master_switch = checked
          this.$message.success('操作成功')
          // alert(JSON.stringify(this.configData))
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改直充开关
     */
    onOrderChargingSwitch (checked) {
      ModifyOrderChargingSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.order_zhichong_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改可疑订单开关
     */
    onOrderKeyiSwitch (checked) {
      ModifyOrderKeyiSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.order_keyi_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改审核用户开关
     */
    onUserSwitch (checked) {
      ModifyUserSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.user_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改充值模板余额不足开关
     */
    onChangetplSwitch (checked) {
      ModifyChangetplSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.changetpl_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改查询模板掉线开关
     */
    onQuerytplSwitch (checked) {
      ModifyQuerytplSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.querytpl_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改代理商提现提醒开关
     */
    onChangeModifyAgentWithdrawaSwitch (checked) {
      modifyAgentWithdrawaSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.agent_withdrawal_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改公众号提醒开关
     */
    onChangeModifyGongzhongWithdrawaSwitch (checked) {
      modifyGongzhongWithdrawaSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.gongzhong_withdrawal_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改充值卡订单导入可疑开关
     */
    onChangeModifyCardOrderSwitch (checked) {
      modifyCardOrderSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.card_order_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    /**
     * 修改充值卡异常提醒开关
     */
    onChangeModifyCardSwitch (checked) {
      modifyCardSwitch({ isSwitch: checked }).then(res => {
        if (res.code === 0) {
          this.configData.card_switch = checked
          this.$message.success('操作成功')
        } else {
          self.$message.error(res.message)
        }
      })
    },
    // 查看订单
    queryOrder (status) {
      this.$router.push({ name: 'OrderList', params: { status: status } })
    },
    queryUserCheck () {
      this.$router.push({ name: 'UserList' })
    },
    queryRechargeTpl () {
      this.$router.push({ name: 'RechargeTplList' })
    },
    queryQueryTpl () {
      this.$router.push({ name: 'QueryTpl' })
    },
    queryWithdrawAgent () {
      this.$router.push({ name: 'WithdrawAgent' })
    },
    queryWithdrawWeixin () {
      this.$router.push({ name: 'WithdrawWeixin' })
    },
    queryCardOrder () {
      this.$router.push({ path: '/card/order' })
    },
    queryCrad () {
      this.$router.push({ path: '/card/manage' })
    },
    /**
     * 保存配置
     */
    saveConfig () {
      GetConfig().then(res => {
        if (res.code === 0) {
        this.visible = true
      this.model = {
        title: '配置',
        width: 690,
        data: [
          {
            label: '直充刷新时间',
            item: [
              {
                col: 6,
                formType: 'input',
                decorator: ['orderZhichongRefresh', { initialValue: res.result.order_zhichong_refresh, rules: [{ required: true, message: '直充刷新时间不能为空' }] }],
                placeholder: '请输入直充刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              },
              {
                col: 4,
                formType: 'text',
                value: '卡单时间:'
              },
              {
                col: 6,
                formType: 'input',
                decorator: ['orderZhichongTime', { initialValue: res.result.order_zhichong_time, rules: [{ required: true, message: '直充卡单时间不能为空' }] }],
                placeholder: '请输入直充卡单时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(分)'
              }
            ]
          },
          {
            label: '可疑订单刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['orderKeyiRefresh', { initialValue: res.result.order_keyi_refresh, rules: [{ required: true, message: '可疑订单刷新时间不能为空' }] }],
                placeholder: '请输入可疑订单刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '待审核会员刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['userRefresh', { initialValue: res.result.user_refresh, rules: [{ required: true, message: '待审核会员刷新时间不能为空' }] }],
                placeholder: '请输入待审核会员刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '充值模板刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['changetplRefresh', { initialValue: res.result.changetpl_refresh, rules: [{ required: true, message: '充值模板刷新时间不能为空' }] }],
                placeholder: '请输入充值模板刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '查询模板刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['querytplRefresh', { initialValue: res.result.querytpl_refresh, rules: [{ required: true, message: '查询模板刷新时间不能为空' }] }],
                placeholder: '请输入查询模板刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '代理商提现刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['agentWithdrawalRefresh', { initialValue: res.result.agent_withdrawal_refresh, rules: [{ required: true, message: '代理商提现刷新时间不能为空' }] }],
                placeholder: '请输入代理商提现刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '公众号提现刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['gongzhongWithdrawalRefresh', { initialValue: res.result.gongzhong_withdrawal_refresh, rules: [{ required: true, message: '公众号提现刷新时间不能为空' }] }],
                placeholder: '请输入公众号提现刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '卡密入库刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['cardOrderRefresh', { initialValue: res.result.card_order_refresh, rules: [{ required: true, message: '卡密入库待处理刷新时间不能为空' }] }],
                placeholder: '请输入卡密入库待处理刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          },
          {
            label: '卡密可疑刷新时间',
            item: [
              {
                col: 20,
                formType: 'input',
                decorator: ['cardRefresh', { initialValue: res.result.card_refresh, rules: [{ required: true, message: '充值卡可疑状态刷新时间不能为空' }] }],
                placeholder: '请输入充值卡可疑状态刷新时间'
              },
              {
                col: 4,
                formType: 'text',
                value: '单位(秒)'
              }
            ]
          }
        ]
      }
        }
      })
    },
    /**
     * 添加和编辑模板关闭
     */
    handleCancel () {
      const form = this.$refs.createModal.form
      form.resetFields()
      this.visible = false
    },
    /**
     * 添加和编辑模板提交表单
     */
    handleOk () {
      const form = this.$refs.createModal.form
      form.validateFields((errors, values) => {
        if (!errors) {
            // 添加
            saveConfig(values).then(response => {
            if (response.code === 0) {
              this.$message.success('操作成功')
              this.visible = false
              // form.resetFields() // 清理表单数据（可不做）
              // 刷新表格
              // this.list()
            } else {
              this.$message.error(response.message)
            }
            }).catch(error => {
            this.$message.error(error + '')
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
