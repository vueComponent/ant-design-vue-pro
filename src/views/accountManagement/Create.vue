<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-steps :current="current" style="font-weight: bold">
        <a-step title="恒星号基本信息"/>
        <a-step title="确认基本信息"/>
        <a-step title="完成"/>
      </a-steps>
      <a-row>
        <a-col :span="16" :offset="2">
          <div style="padding: 30px 0;" v-if="current===0">
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">恒星号名称：</span>
              </a-col>
              <a-col :span="14">
                <a-input v-model="accountDetail.name"/>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">恒星号属性：</span>
              </a-col>
              <a-col :span="6">
                <a-select style="width: 100%" v-model="accountDetail.property"></a-select>
              </a-col>
              <a-col :span="6">
                <span class="label">恒星号类型：</span>
              </a-col>
              <a-col :span="6">
                <a-select style="width: 100%" v-model="accountDetail.type"></a-select>
              </a-col>
              <a-col :span="6">
                <span class="label">人数规模：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.number"/>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">负责人姓名：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.headName"/>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人学号：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.headNumber"/>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人手机号：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.headPhoneNumber"/>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人微信号：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.headWeixin"/>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人邮箱：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.headEmail"/>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">指导老师姓名：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.instructorName"/>
              </a-col>
              <a-col :span="6">
                <span class="label">指导老师联系方式：</span>
              </a-col>
              <a-col :span="6">
                <a-input placeholder="请输入" v-model="accountDetail.instructorContactWay"/>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col offset="11">
                <a-button type="primary" @click="() => this.current++">下一步</a-button>
              </a-col>
            </a-row>
          </div>
          <div style="padding: 30px 0;" v-if="current===1">
            <a-row>
              <a-col :span="20" offset="2">
                <div style="background-color: rgb(235,247,253);border: rgb(214,235,251) solid 2px;padding: 5px 20px">
                  <a-icon type="exclamation-circle" theme="twoTone"/>
                  <span style="font-weight: 550;font-size: 10px">  确认基本信息无误提交后，该恒星号账号将被建立。</span>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">恒星号名称：</span>
              </a-col>
              <a-col :span="14">
                <span class="content">{{ accountDetail.name }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">恒星号属性：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.property }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">恒星号类型：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.type }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">人数规模：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.number }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">负责人姓名：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.headName }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人学号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.headNumber }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人手机号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.headPhoneNumber }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人微信号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.headWeixin }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人邮箱：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.headEmail }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">指导老师姓名：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.instructorName }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">指导老师联系方式：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.instructorContactWay }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="2" :offset="8">
                <a-button @click="() => this.current--">上一步</a-button>
              </a-col>
              <a-col :span="2" :offset="3">
                <a-button type="primary" @click="() => this.current++">提交</a-button>
              </a-col>
            </a-row>
          </div>
          <div style="padding: 30px 0;" v-if="current===2">
            <div style="display: flex;justify-content: center">
              <div style="display: flex;flex-direction: column">
                <a-icon type="check-circle" theme="filled" style="color: #52c41a;font-size: 100px"/>
                <br/>
                <span style="font-weight: bold;font-size: 20px">申请成功</span>
              </div>
            </div>
            <a-row>
              <a-col :span="20" :offset="4">
                <div style="margin-top: 40px">
                  <a-row :gutter="[0,24]">
                    <a-col :span="12">
                      <span class="label2">恒星号名称：</span>
                      <span class="content">{{ accountDetail.name }} </span>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0,24]">
                    <a-col :span="12">
                      <span class="label2">恒星号账户：</span>
                      <span class="content">{{ accountDetail.account }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">恒星号密码：</span>
                      <span class="content">{{ accountDetail.password }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">恒星号负责人：</span>
                      <span class="content">{{ accountDetail.headName }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">指导老师：</span>
                      <span class="content">{{ accountDetail.instructorName }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">创建人：</span>
                      <span class="content">达达</span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">生效时间：</span>
                      <span class="content">2021-08-01 20:00:00</span>
                    </a-col>
                  </a-row>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col offset="9">
                <a-button type="primary">返回恒星号列表</a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Create',
  data () {
    return {
      current: 0,
      accountDetail: {
        name: '破壁',
        property: '校园组织',
        type: '创新创业',
        number: '60',
        headName: '达芬奇',
        headNumber: '1234567',
        headPhoneNumber: '1234567890',
        headWeixin: '1234567',
        headEmail: '1234567@tongji.edu.cn',
        instructorName: '达达',
        instructorContactWay: '1234567',
        account: '1234567',
        password: '1234567'
      }
    }
  }
}
</script>

<style scoped>
.label{
  float: right;
  font-weight: 550;
  height: 30px;
  line-height: 30px;
}
.content{
  color: #909399;
  height: 30px;
  line-height: 30px;
}
.label2{
  font-weight: 550;
  height: 30px;
  line-height: 30px;
}
</style>
