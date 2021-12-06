<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-steps :current="current" style="font-weight: bold;margin-bottom:60px;">
        <a-step title="恒星号基本信息"/>
        <a-step title="确认基本信息"/>
        <a-step title="完成"/>
      </a-steps>
       <a-form :form="form" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit" v-if="current===0">
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="恒星号名称">
                <a-input
                placeholder="请输入"
                  v-decorator="['organizationName', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="恒星号属性">
                <a-select
                  v-model="accountDetail.property"
                  v-decorator="[
                    'property',
                    { rules: [{ required: true, message: '请选择' }] },
                  ]"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in propertyOptions"
                    :value="item.label"
                    :key="item.label"
                  > {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="恒星号类型">
                <a-select
                v-model="accountDetail.type"
                  v-decorator="[
                    'type',
                    { rules: [{ required: true, message: '请选择' }] },
                  ]"
                  placeholder="请选择"
                >
                <a-select-option
                    v-for="item in typeOptions"
                    :value="item.label"
                    :key="item.label"
                  > {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="人数规模">
                <a-input
                placeholder="请输入"
                  v-decorator="['memberCount', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="负责人姓名:">
                <a-input
                placeholder="请输入"
                  v-decorator="['operatorName', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="负责人学号:">
                <a-input
                placeholder="请输入"
                  v-decorator="['operatorStudentId', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="负责人手机号:">
                <a-input
                placeholder="请输入"
                  v-decorator="['operatorPhone', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="负责人微信号:">
                <a-input
                placeholder="请输入"
                  v-decorator="['operatorWxId', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="负责人邮箱:">
                <a-input
                placeholder="请输入"
                  v-decorator="['operatorMail', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="指导老师姓名:">
                <a-input
                placeholder="请输入"
                  v-decorator="['teacherName', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
           <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item label="指导老师联系方式:">
                <a-input
                placeholder="请输入"
                  v-decorator="['teacherContact', { rules: [{ required: true, message: '请输入' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
             
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="8">
              <a-form-item :wrapper-col="{ span: 10, offset: 5 }">
                <a-button type="primary" html-type="submit">
                  下一步
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>

      </a-form>
      <a-row>
        <a-col :span="16" :offset="2">
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
                <span class="content">{{ accountDetail.organizationName }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">恒星号属性：</span>
              </a-col>
              <a-col :span="6">
                 <span class="content" v-if="accountDetail.property == '0'">其他</span>
              </a-col>
              <a-col :span="6">
                <span class="label">恒星号类型：</span>
              </a-col>
              <a-col :span="6">
                <span class="content" v-if="accountDetail.type==52">社团</span>
                <span class="content" v-if="accountDetail.type==53">学生组织</span>
                <span class="content" v-if="accountDetail.type==54">官方组织</span>
              </a-col>
              <a-col :span="6">
                <span class="label">人数规模：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.memberCount }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">负责人姓名：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.operatorName }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人学号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.operatorStudentId }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人手机号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.operatorPhone }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人微信号：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.operatorWxId}} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">负责人邮箱：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.operatorMail }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="6">
                <span class="label">指导老师姓名：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.teacherName }} </span>
              </a-col>
              <a-col :span="6">
                <span class="label">指导老师联系方式：</span>
              </a-col>
              <a-col :span="6">
                <span class="content">{{ accountDetail.teacherContact }} </span>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col :span="2" :offset="8">
                <a-button @click="() => this.current--">上一步</a-button>
              </a-col>
              <a-col :span="2" :offset="3">
                <a-button type="primary" @click="submitForm()">提交</a-button>
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
                      <span class="content">{{ accountReturnDetail.organizationName }} </span>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0,24]">
                    <a-col :span="12">
                      <span class="label2">恒星号账户：</span>
                      <span class="content">{{ accountReturnDetail.operatorMail }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">恒星号密码：</span>
                      <span class="content">{{ accountReturnDetail.password }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">恒星号负责人：</span>
                      <span class="content">{{ accountReturnDetail.operatorName }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">指导老师：</span>
                      <span class="content">{{ accountReturnDetail.teacherName }} </span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">创建人：</span>
                      <span class="content">{{ currentUser.name }}></span>
                    </a-col>
                    <a-col :span="12">
                      <span class="label2">生效时间：</span>
                      <span class="content">{{accountReturnDetail.updateTime}}</span>
                    </a-col>
                  </a-row>
                </div>
              </a-col>
            </a-row>
            <a-row :gutter="[0,24]">
              <a-col offset="9">
                <a-button type="primary" @click="() => this.current--">返回恒星号列表</a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { adminCreateOrganization } from '@/api/planet' // 引入后台接口
import { SHOW_NAME } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'Create',
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      currentUser: {},
      current: 0,
      accountDetail: {
        organizationName: '',
        property: 1, // 属性
        type: 1,
        memberCount: '', 
        operatorName: '',
        operatorStudentId: '', // 负责人学号
        operatorPhone: '', // 负责人手机号
        operatorWxId: '', // 负责人微信
        operatorMail: '', // 负责人邮箱
        teacherName: '', // 指导老师姓名
        teacherContact: '', // 指导老师电话
        // account: '1234567',
        // password: '1234567'
      },
      accountReturnDetail:{}, // 创建成功后，接口返回内容
      typeOptions: [], // 恒星号类型
      propertyOptions: [] // 恒星号属性
    }
  },
  created () {
        // 类型
        this.typeOptions = [
          { label: 53, title: '学生组织' },
          { label: 52, title: '社团' },
          { label: 54, title: '官方组织' }
        ]
        // 属性
        this.propertyOptions = [
          { label: 0, title: '其他' }
        ]
  },
  mounted () {
    this.currentUser = {
      name: storage.get(SHOW_NAME)
    }
  },
  // beforeCreate () {
  //   this.form = this.$form.createForm(this, { name: 'search' })
  // },
  methods: {
    handleSelectChange() {

    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.accountDetail = {...values}
          this.current ++
        }
      });
    },
   submitForm () {
    // 提交
    adminCreateOrganization(this.accountDetail)
      .then(res => {
         if (res.success) {
          this.current += 1
          this.accountReturnDetail = res.data
          this.$message.info('创建成功!')
         } else {
           this.$message.info(res.msg)
         }
      })
      .catch(() => {
        this.$message.error('error！')
      })
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
/deep/ .ant-form-item-control-wrapper {
  margin-left: 10px;
}
</style>
