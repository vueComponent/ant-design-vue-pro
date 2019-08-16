<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
     <a-card :bordered="false" style="background-color: #0399EC;color:#FFFFFF">
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
    <a-card :bordered="false" style="margin-top: 20px;">
     <a-row :gutter="8">
       <a-col :span="5">
         <s-tree :dataSource="orgTree" :openKeys.sync="openKeys" :search="false"  @click="handleClick" @add="handleAdd" @titleClick="handleTitleClick">
        </s-tree>
       </a-col>
       <a-col :span="19">
         <div class="baselineForm">
              <div class="fr">
                <a-button class="btn">导入</a-button>
                <a-button class="btn">保存</a-button>
                <a-button class="btn" type="primary">提交</a-button>
              </div>
              
              <a-form :form="form">
                <a-form-item
                  label="姓名"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['name',{rules: [{required: true,message:"该选项为必填"}]}]" />
                </a-form-item>
                <a-form-item
                  label="身份证号"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input v-decorator="['card', {rules: [{required: true,min:18}]}]" />
                </a-form-item>
                <a-form-item
                  label="性别"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                <a-radio-group v-decorator="['sex', {initialValue: 1, rules: [{required: true}]}]" style="width: 100%">
                  <a-radio :value="0">男</a-radio>
                  <a-radio :value="1">女</a-radio>
                </a-radio-group>
                </a-form-item>
                 </a-form-item>
                 <a-form-item
                   label="患者支扩病程"
                   :labelCol=" { span: 4 }"
                   :wrapperCol="{ span: 20 }"
                 >
                 <a-radio-group v-decorator="['sex', {initialValue: 1, rules: [{required: true}]}]" style="width: 100%">
                   <a-radio :value="0">不知道</a-radio>
                   <a-radio :value="1"> &lt;5年</a-radio>
                   <a-radio :value="2"> 5-9年</a-radio>
                   <a-radio :value="3"> 10-14年</a-radio>
                   <a-radio :value="4"> 15-20年</a-radio>
                   <a-radio :value="5"> &lg;29年</a-radio>
                   <a-radio :value="6"> 20-29年</a-radio>
                 </a-radio-group>
                 </a-form-item>
                 </a-form-item>
                <a-form-item
                  label="身份证号"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-date-picker
                  style="width: 100%"
                  showTime
                  format="YYYY-MM-DD"
                  placeholder="请选择"
                  v-decorator="['birthday',{rules: [{required: true}]}]"
                />
                </a-form-item>
                 <p class="formSubtitle">相关治疗</p>
                 <a-form-item
                   label="手术部位"
                   :labelCol=" { span: 4 }"
                  :wrapperCol="{ span: 20 }"
                 >
                 <a-checkbox-group v-decorator="['shoushu']">
                    <a-checkbox :value="0">部位</a-checkbox>
                    <a-checkbox :value="1">右肺上叶</a-checkbox>
                    <a-checkbox :value="2">右肺中</a-checkbox>
                    <a-checkbox :value="3">右肺下叶</a-checkbox>
                    <a-checkbox :value="4">左肺上叶固有</a-checkbox>
                    <a-checkbox :value="5">左肺上叶舌段</a-checkbox>
                    <a-checkbox :value="6">左肺下叶</a-checkbox>
                  </a-checkbox-group>
                 </a-form-item>
              </a-form>
               <a-dragger :formSubtitle="file.formSubtitle"></a-dragger>
         </div>         
       </a-col>
     </a-row>
     </a-card>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree';
import { getOrgTree, getServiceList } from '@/api/manage';
import ADragger from './page/dragger';
export default {
  name: 'success',
  components: {
    STree,
    ADragger
  },
  data() {
    return {
      openKeys: ['key-01'],
      orgTree: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
     
      file:{
         formSubtitle:"草草1草1草"
      }
      
    }
  },
  created() {
    getOrgTree().then(res => {
      this.orgTree = res.result;
    });
    const { id } = this.$route.params
    console.log(id)
  },
  methods: {
    handleClick(e) {
      // console.log('handleClick', e);
      // this.queryParam = {
      //   key: e.key
      // };
    },
    handleAdd(item) {
      console.log('add button, item', item);
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `);
      this.$refs.modal.add(item.key);
    },
    handleTitleClick(item) {
      console.log('handleTitleClick', item);
    },   
     handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
       handleCancel () {
      this.visible = false
    },
     onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.page-header-index-wide{
  /deep/ .ant-card-wider-padding .ant-card-body {
    padding: 18px 32px;
  }
  /deep/ .tree-title{
    border-right: 1px solid #E8E8E8;
    color: #25AEFE;
    font-size: 22px;
    padding-left: 55px;
    padding-top: 5px;
    padding-bottom: 10px;
    background-image:url(../../../assets/treeTop.png) ;
    background-repeat: no-repeat;
  }
  /deep/ .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title,.ant-menu .ant-menu-item{
    height: 50px;
    line-height: 50px;
  }
  /deep/ .ant-menu-submenu-title{
    height: 50px;
    line-height: 50px;
  }
  /deep/ .ant-menu-item{
    .ant-menu-item:hover, .ant-menu-item-active, .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open, .ant-menu-submenu-active, .ant-menu-submenu-title:hover {
        background-color: #EAF2FD;
    }
    .placeholderI{
      display: inline-block;
      width: 27px;
    }
    .anticon.anticon-check-circle{
        font-size: 18px;
        color: #8AC51B;
    }
    .anticon.anticon-clock-circle{
      font-size: 18px;
      color: #06A0E2;
    }
    .treeSubTitle{
      font-size: 16px;
      margin-left: 10px;
      display: inline-block;
      width: 150px;
    }
    .treeSubPercentage{
      font-size: 16px;
      margin-left: 10px;
    }
  }
  /deep/ .ant-menu-submenu{
    &.ant-menu-submenu-inline{
      .treeSubTitle{
         font-size: 16px;
         margin-left: 10px;
         display: inline-block;
         width: 150px;
      }
      .treeSubPercentage{
        font-size: 16px;
        margin-left: 10px;
      }
      .action{
        font-size: 18px;
        &.anticon-check-circle{
          color: #8AC51B;
        }
        &.anticon-clock-circle{
          color: #06A0E2;
        }
      }
      .placeholderI{
        display: inline-block;
        width: 27px;
      }
    }
  }
  .baselineForm{
    .fr{
      float: right;
    }
    .btn{
      margin-right: 10px;
    }
    padding: 20px;
    .ant-row{
      padding-bottom: 10px;
      padding-top: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #F3F3F3;
    }
    .ant-form-item-label{
      text-align: left;
    }
    .formSubtitle{
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        font-size: 16px;
        padding-left: 10px;
        margin-bottom: 0px;
        background: #FAFCFD;
        border-bottom: 1px solid #F3F3F3;
    }
  }
}
</style>
