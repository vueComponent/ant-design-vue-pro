<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
     <a-card :bordered="false" style="background-color: #0399EC;color:#FFFFFF">
       <a-row :gutter="30" style="line-height: 34px;">
         <a-col :md="1" :sm="4"><a-icon type="left" style="fontSize:20px" /></a-col>
         <a-col :md="3" :sm="20" style="fontSize:20px">
           <a-icon type="credit-card" theme="filled" />
           受访者:{{patient.name}}
         </a-col>
         <a-col :md="5" :sm="24" style="fontSize:20px">
           <a-icon type="credit-card" theme="filled" style="fontSize:20px" />
           {{patient.card}}
         </a-col>
         <a-col :md="15" :sm="24" style="fontSize:20px;textAlign: right;">创建时间：{{patientBasis.createDate | moment}}</a-col>
       </a-row>
    </a-card>
    <a-card :bordered="false" style="margin-top: 20px;">
     <a-row :gutter="8">
       <a-col :span="5">
        <s-tree :treeTitle="title" :dataSource="orgTree" :openKeys.sync="openKeys" :search="false" @click="handleClick">
        </s-tree>
       </a-col>
       <a-col :span="19">
         <div class="baselineForm">
              <div style="overflow: hidden;">
                <a-button class="btn fr">导入</a-button>
                <a-button class="btn fr" @click="save">保存</a-button>
                <a-button class="btn fr" type="primary" @click="submit">提交</a-button>
              </div>
              <a-form :form="form">
                <a-form-item v-for="(qu1, index) in list" :key="index" :label="[qu1.sort + '.' + qu1.questionName]" :labelCol="labelCol"
                  :wrapperCol="wrapperCol">
                    <a-radio-group v-if="qu1.simple === 1" :name="qu1.basisElementId+''">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="-1">否</a-radio>
                    </a-radio-group>
                    <a-radio-group v-if="qu1.simple === 2" :name="qu1.basisElementId+''">
                      <a-radio :value="1">有</a-radio>
                      <a-radio :value="-1">无</a-radio>
                    </a-radio-group>
                    <a-input :name="qu1.basisElementId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event" />
                    <a-date-picker :name="qu1.basisElementId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate'" />
                    <a-checkbox-group v-if="qu1.hasChild > 0 && qu1.isRadio < 0">
                      <a-checkbox v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementId" :name="qu1.basisElementId+''">{{op.questionName}}</a-checkbox>
                    </a-checkbox-group>
                    <a-radio-group v-if="qu1.hasChild > 0 && qu1.isRadio > 0" :name="qu1.basisElementId">
                      <a-radio v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementId">{{op.questionName}}</a-radio>
                    </a-radio-group>
                    <div v-if="qu1.hasChild > 0 && qu1.isRadio === 0">
                      <a-row v-for="(sub, index) in qu1.childList" :key="index" class="no-border">
                        <br v-if="sub.showType === 2" />
                        <a-col :span="7">({{sub.sort}}) {{sub.questionName}}</a-col>
                        
                        <a-col :span="sub.isWrite > 0 ? 4 : 17">

                          <a-input v-if="sub.isWrite > 0 && !sub.event" :name="sub.basisElementId+''" />
                          <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate'" :name="sub.basisElementId+''" />
                          <a-radio-group v-if="sub.simple === 1" v-model="sub.basisElementId" :name="sub.basisElementId+''">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="-1">否</a-radio>
                          </a-radio-group>
                          <a-radio-group v-if="sub.simple === 2" v-model="sub.basisElementId" :name.once="sub.basisElementId+''">
                            <a-radio :value="1">有fdf</a-radio>
                            <a-radio :value="-1">无fdf</a-radio>
                          </a-radio-group>
                          <div class="clear" v-if="sub.simple > 0"></div>
                          <a-col :span="4" v-if="sub.logicValue === 0 || sub.basisElementId === 1">{{sub.childEleName}}</a-col>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0">
                            <a-checkbox v-for="(subOp,index) in sub.childList" :key="index" :name="subOp.parentId+''" :value="subOp.basisElementId" v-if="sub.logicValue === 0 || sub.basisElementId === 1">{{subOp.questionName}}</a-checkbox>
                          </a-checkbox-group>
                          <a-radio-group v-if="sub.hasChild > 0 && sub.isRadio > 0" v-model="sub.basisElementId" :name="sub.basisElementId+''">
                            <a-radio v-for="(subOp,index) in sub.childList" :key="index" :value="subOp.basisElementId">{{subOp.questionName}}</a-radio>
                          </a-radio-group>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue === 0 && thirdSub.logicValue > 0 && thirdSub.hasChild > 0 && thirdSub.basisElementId === sub.basisElementId"" v-for="(thirdSub, index) in sub.childList">
                            <a-col :span="6">{{thirdSub.childList[0].questionName}}</a-col>
                            <a-col :span="8">
                              <a-date-picker v-if="thirdSub.childList[0].event === 'showDate'" :name="thirdSub.childList[0].basisElementId" />
                              <a-input v-else />
                            </a-col>
                          </a-row>
                          <a-col :offset="1" v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.childList[0].isWrite > 0">
                            <a-col :span="6">{{sub.childList[0].questionName}}</a-col>
                            <a-col :span="8"><a-input /></a-col>
                          </a-col>
                          <a-row class="no-border" v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue > 0 && secondSub.hasChild > 0" v-for="(secondSub, index) in sub.childList" :key="index">
                            <a-col :span="3" v-if="sub.basisElementId === secondSub.basisElementId">{{secondSub.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="sub.basisElementId === secondSub.basisElementId"><a-input :addonAfter="secondSub.childList[0].unit" /></a-col>
                          </a-row>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio === 0 && (!sub.logicValue || sub.basisElementId === 1)" v-for="(subOp,index) in sub.childList">
                              <a-col :span="7">{{subOp.questionName}}</a-col>
                              <a-radio-group v-if="subOp.simple === 1" v-model="subOp.basisElementId">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="-1">否</a-radio>
                              </a-radio-group>
                              <a-radio-group v-if="subOp.simple === 2" v-model="subOp.basisElementId">
                                <a-radio :value="1">有</a-radio>
                                <a-radio :value="-1">无</a-radio>
                              </a-radio-group>
                              <a-col :span="6" v-if="subOp.isWrite > 0"><a-input :name="subOp.basisElementId+''" /></a-col>
                              <a-col :span="17" v-if="subOp.hasChild > 0 && subOp.isRadio < 0">
                                <a-checkbox-group>
                                  <a-checkbox v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-checkbox>
                                </a-checkbox-group>
                              </a-col>
                              <a-col :span="17" v-if="subOp.hasChild > 0 && subOp.isRadio > 0">
                                <a-radio-group>
                                  <a-radio v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-radio>
                                </a-radio-group>
                              </a-col>
                              <a-col v-if="subOp.hasChild > 0 && subOp.isRadio === 0  && (!subOp.logicValue || subOp.basisElementId === 1)" v-for="(thirdSub, index) in subOp.childList" :key="index" :span="17" :offset="1">
                                <a-col :span="12">{{thirdSub.questionName}}</a-col>
                                <a-col :span="12">
                                  <a-radio-group v-if="thirdSub.simple === 1">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="-1">否</a-radio>
                                  </a-radio-group>
                                  <a-input v-if="thirdSub.isWrite > 0" :name="thirdSub.basisElementId + ''" />
                                </a-col>
                              </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </div>
                </a-form-item>
              </a-form>
         </div>         
       </a-col>
     </a-row>
     </a-card>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { mapActions } from 'vuex'
import { getPatientBasis, getElementsAnswer } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'

export default {
  name: 'success',
  components: {
    STree
  },
  data() {
    return {
      title: '支扩研究基线表',
      openKeys: ['key-01'],
      orgTree: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4}
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      patient: {},
      patientBasis: {},
      list: [],
      patientBasisId: this.$route.params.id,
      basisMaskId: undefined
    }
  },
  created() {
    var that = this
    this.CloseSidebar()
    var params = new URLSearchParams()
    params.append('patientBasisId', this.patientBasisId)
    getPatientBasis(params)
    .then(res => {
      that.patient = res.data.patient
      that.patientBasis = res.data.patientBasis
      that.orgTree = res.data.list
    })
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    handleClick(e) {
      this.basisMaskId = e.key
      this.getElementsAnswer()
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
    },
    getElementsAnswer (){
      var that = this
      var params = new URLSearchParams()
      params.append('basisMaskId', this.basisMaskId)
      params.append('patientBasisId', this.patientBasisId)
      getElementsAnswer(params)
      .then(res => {
        that.list = res.data
        // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
      })
    },
    save (){
      var result = []
      var a = _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementId,
            elementNumValue: $('input[name="' + item.basisElementId + '"]:checked').val()
          })
        }else if(item.isWrite > 0){
          var text = $('[name="' + item.basisElementId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementId + '"] input').val() : $('[name="' + item.basisElementId + '"]').val()
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementId,
            elementTextValue: text
          }) 
        }
        if(item.hasChild > 0){
          if(item.childList[0].type === 1){
            _.each(item.childList, function(sub){
              if(sub.isWrite > 0){
                var text = $('[name="' + sub.basisElementId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sub.basisElementId + '"] input').val() : $('[name="' + sub.basisElementId + '"]').val()
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementId,
                  elementTextValue: text
                })
              }
              $('input[name="' + sub.basisElementId + '"][type!="text"]').each(function(i,v){
                result.push({
                  basisAnswerId: $(v).data('answerId'),
                  basisElementId: parseInt($(v).val()),
                  elementNumValue: $(v).prop('checked') ? 1 : -1
                })
              })
              if(sub.hasChild > 0){
                _.each(sub.childList, function(third){
                  if(third.hasChild > 0 && third.childList[0] && third.childList[0].isWrite > 0){
                    var text = $('[name="' + third.childList[0].basisElementId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.childList[0].basisElementId + '"] input').val() : $('[name="' + third.childList[0].basisElementId + '"]').val()
                    result.push({
                      basisAnswerId: (third.childList[0].answers && third.childList[0].answers.length) ? third.childList[0].answers[0].basisAnswerId : '',
                      basisElementId: third.childList[0].basisElementId,
                      elementTextValue: text || ''
                    })
                  }
                })
              }
            })
          }else{
            // 是选项，单选或多选
            $('input[name="' + item.basisElementId + '"][type!="text"]').each(function(i,v){
              if($(v).data('nip') && $(v).data('nip') > 0){
                result.push({
                  basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
                  basisElementId: parseInt($(v).val()),
                  elementNumValue: $(v).prop('checked') ? 1 : -1,
                  elementTextValue: $('[name="' + $(v).val() +'-text"]').val()
                })
              }else{
                result.push({
                  basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
                  basisElementId: parseInt($(v).val()),
                  elementNumValue: $(v).prop('checked') ? 1 : -1
                })
              }
            })
          }
        }
      })
      console.log(result)
    },
    submit (){

    }
  }
};
</script>

<style lang="less" scoped>
.clear{
  clear: both;
}
.ant-col-4 .ant-calendar-picker{
  width: 100%;
}
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
      &.no-border{
        border-bottom: none;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    /deep/ .ant-form-item-label{
      text-align: left;
      label:after{
        content: ''
      }
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
