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
                <a-form-item v-for="(qu1, index) in list" :key="index" :label="[qu1.sort + '.' + qu1.questionName]" :labelCol="qu1.type === 0 ? labelColVer : labelColHor" :wrapperCol="qu1.type === 0 ? wrapperVer : wrapperHor">
                    <a-radio-group v-if="qu1.simple === 1" :name="qu1.basisElementCopyId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementNumValue || ''">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="-1">否</a-radio>
                    </a-radio-group>
                    <a-radio-group v-if="qu1.simple === 2" :name="qu1.basisElementCopyId+''" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementNumValue">
                      <a-radio :value="1">有</a-radio>
                      <a-radio :value="-1">无</a-radio>
                    </a-radio-group>
                    <a-input :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && !qu1.event" :defaultValue="qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue" style="width: 200px" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (!qu1.answers || qu1.answers.length === 0 || qu1.answers[0].elementTextValue === '')" />
                    <a-date-picker :name="qu1.basisElementCopyId+''" v-if="qu1.simple < 0 && qu1.isWrite > 0 && qu1.event === 'showDate' && (qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue)" :defaultValue="moment(qu1.answers[0].elementTextValue)" />
                    <a-checkbox-group v-if="qu1.hasChild > 0 && qu1.isRadio < 0" v-model="qu1.elementId">
                      <a-checkbox v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementCopyId" :name="qu1.basisElementCopyId+''">{{op.questionName}}</a-checkbox>
                    </a-checkbox-group>
                    <a-radio-group v-if="qu1.hasChild > 0 && qu1.isRadio > 0" :name="qu1.basisElementCopyId+''">
                      <a-radio v-for="(op,index) in qu1.childList" :key="index" :value="op.basisElementCopyId">{{op.questionName}}</a-radio>
                    </a-radio-group>
                    <!-- 一级联动 -->
                    <a-row v-for="(sub, index) in qu1.childList" :key="index" v-if="qu1.isRadio < 0 && sub.logicValue > 0 && qu1.elementId.indexOf(sub.basisElementCopyId) > -1">
                      <a-col :span="4">{{sub.childList[0].questionName}}</a-col>
                      <a-col :span="4"><a-input :name="sub.childList[0].basisElementCopyId+''" :addonAfter="sub.childList[0].unit" :defaultValue="sub.childList[0].answers && sub.childList[0].answers.length && sub.childList[0].answers[0].elementTextValue" /></a-col>
                    </a-row>
                    <div v-if="qu1.hasChild > 0 && qu1.isRadio === 0">
                      <a-row v-for="(sub, index) in qu1.childList" :key="index" :class="{'no-border': index === qu1.childList.length - 1}">
                        <!-- <br v-if="sub.showType === 2" /> -->
                        <a-col :span="7">({{sub.sort}}) {{sub.questionName}}</a-col>
                        
                        <a-col :span="sub.isWrite > 0 ? 4 : 17">
                          <!-- 是否，有无以及填写值 -->
                          <a-input v-if="sub.isWrite > 0 && (!sub.event || sub.event === 'compute')" :name="sub.basisElementCopyId+''" :defaultValue="sub.answers && sub.answers.length && sub.answers[0].elementTextValue" />
                          <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && (!sub.answers || sub.answers.length === 0 || sub.answers[0].elementTextValue === '')" :name="sub.basisElementCopyId+''" />
                          <a-date-picker v-if="sub.isWrite > 0 && sub.event === 'showDate' && sub.answers && sub.answers.length && sub.answers[0].elementTextValue" :name="sub.basisElementCopyId+''" :defaultValue="moment(sub.answers[0].elementTextValue)" />
                          <a-radio-group v-if="sub.simple === 1" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio :value="1">是</a-radio>
                            <a-radio :value="-1">否</a-radio>
                          </a-radio-group>
                          <a-radio-group v-if="sub.simple === 2" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio :value="1">有</a-radio>
                            <a-radio :value="-1">无</a-radio>
                          </a-radio-group>
                          <div class="clear" v-if="sub.simple > 0"></div>
                          <a-col :span="4" v-if="(sub.logicValue === 0 || sub.basisElementId === 1) && sub.childEleName">{{sub.childEleName}}</a-col>
                          <a-checkbox-group v-if="sub.hasChild > 0 && sub.isRadio < 0" v-model="sub.elementId">
                            <a-checkbox v-for="(subOp,index) in sub.childList" :key="index" :name="subOp.parentId+''" :value="subOp.basisElementCopyId" v-if="sub.logicValue === 0 || sub.basisElementId === 1">{{subOp.questionName}}</a-checkbox>
                          </a-checkbox-group>
                          <!-- 二级联动 -->
                          <a-row v-for="(third, index) in sub.childList" :key="index" v-if="sub.hasChild > 0 && sub.isRadio < 0 && third.hasChild > 0 && third.logicValue > 0 && sub.elementId.indexOf(third.basisElementCopyId) > -1">
                            <a-col :span="4" v-if="third.childList[0].isWrite > 0">{{third.childList[0].questionName}}</a-col>
                            <a-col :span="4" v-if="third.childList[0].isWrite > 0">
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && third.childList[0].answers && third.childList[0].answers.length && third.childList[0].answers[0].elementTextValue" :defaultValue="moment(third.childList[0].answers[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" />
                              <a-date-picker v-if="third.childList[0].event === 'showDate' && (!third.childList[0].answers || !third.childList[0].answers.length || !third.childList[0].answers[0].elementTextValue)" :name="third.childList[0].basisElementCopyId+''" />
                              <a-input v-if="!third.childList[0].event" :addonAfter="third.childList[0].unit" :name="third.childList[0].basisElementCopyId+''" :defaultValue="third.childList[0].answers && third.childList[0].answers.length && third.childList[0].answers[0].elementTextValue" />
                            </a-col>
                            <a-col :span="4" v-if="third.isRadio > 0 && third.hasChild > 0">{{third.questionName}}</a-col>
                            <a-col :span="16" v-if="third.isRadio > 0 && third.hasChild > 0">
                              <a-radio-group :name="third.basisElementCopyId+''" v-model="third.basisElementId">
                                <a-radio v-for="(fourth, index) in third.childList" :key="index" :value="fourth.basisElementCopyId">{{fourth.questionName}}</a-radio>
                              </a-radio-group>
                            </a-col>
                          </a-row>
                          <a-radio-group v-if="sub.hasChild > 0 && sub.isRadio > 0" v-model="sub.basisElementId" :name="sub.basisElementCopyId+''">
                            <a-radio v-for="(subOp,index) in sub.childList" :key="index" :value="subOp.basisElementCopyId">{{subOp.questionName}}</a-radio>
                          </a-radio-group>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue === 0 && thirdSub.logicValue > 0 && thirdSub.hasChild > 0 && thirdSub.basisElementId === sub.basisElementId" v-for="(thirdSub, index) in sub.childList">
                            <a-col :span="6">{{thirdSub.childList[0].questionName}}</a-col>
                            <a-col :span="8">
                              <a-date-picker v-if="thirdSub.childList[0].event === 'showDate' && thirdSub.childList[0].answers && thirdSub.childList[0].answers.length && thirdSub.childList[0].answers[0].elementTextValue" :defaultValue="moment(thirdSub.childList[0].answers[0].elementTextValue)" :name="thirdSub.childList[0].basisElementCopyId+''" />
                              <a-date-picker v-if="thirdSub.childList[0].event === 'showDate' && (!thirdSub.childList[0].answers || !thirdSub.childList[0].answers.length || !thirdSub.childList[0].answers[0].elementTextValue)" :name="thirdSub.childList[0].basisElementCopyId+''" />
                              <a-input v-if="!thirdSub.childList[0].event" />
                            </a-col>
                          </a-row>
                          <a-col v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.childList[0].isWrite > 0">
                            <a-col :span="6">{{sub.childList[0].questionName}}</a-col>
                            <a-col :span="8"><a-input :name="sub.childList[0].basisElementCopyId+''" /></a-col>
                          </a-col>
                          <a-row class="no-border" v-if="sub.hasChild > 0 && sub.isRadio > 0 && sub.logicValue > 0 && secondSub.hasChild > 0" v-for="(secondSub, index) in sub.childList" :key="index">
                            <a-col :span="3" v-if="sub.basisElementId === secondSub.basisElementId">{{secondSub.childList[0].questionName}}</a-col>
                            <a-col :span="8" v-if="sub.basisElementId === secondSub.basisElementId"><a-input :addonAfter="secondSub.childList[0].unit" :defaultValue="secondSub.childList[0].answers && secondSub.childList[0].answers.length && secondSub.childList[0].answers[0].elementTextValue" :name="secondSub.childList[0].basisElementCopyId+''" /></a-col>
                          </a-row>
                          <a-row v-if="sub.hasChild > 0 && sub.isRadio === 0 && (!sub.logicValue || sub.basisElementId === 1)" v-for="(subOp,index) in sub.childList">
                              <a-col :span="7">{{subOp.questionName}}</a-col>
                              <a-radio-group v-if="subOp.simple === 1" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="-1">否</a-radio>
                              </a-radio-group>
                              <a-radio-group v-if="subOp.simple === 2" v-model="subOp.basisElementId" :name="subOp.basisElementCopyId+''">
                                <a-radio :value="1">有</a-radio>
                                <a-radio :value="-1">无</a-radio>
                              </a-radio-group>
                              <a-col :span="6" v-if="subOp.isWrite > 0">
                                <a-date-picker v-if="subOp.event === 'showDate' && subOp.answers && subOp.answers.length && subOp.answers[0].elementTextValue" :name="subOp.basisElementCopyId+''" :defaultValue="moment(subOp.answers[0].elementTextValue)" />
                                <a-date-picker v-if="subOp.event === 'showDate' && (!subOp.answers || !subOp.answers.length || !subOp.answers[0].elementTextValue)" :name="subOp.basisElementCopyId+''" />
                                <a-input :name="subOp.basisElementCopyId+''" v-if="!subOp.event || subOp.event !== 'showDate'" :defaultValue="subOp.answers && subOp.answers.length && subOp.answers[0].elementTextValue" />
                              </a-col>
                              <a-col :span="17" v-if="subOp.hasChild > 0 && subOp.isRadio < 0">
                                <a-checkbox-group v-model="subOp.elementId">
                                  <a-checkbox v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-checkbox>
                                </a-checkbox-group>
                              </a-col>
                              <a-col :span="17" v-if="subOp.hasChild > 0 && subOp.isRadio > 0">
                                <a-radio-group>
                                  <a-radio v-for="(secondSub,index) in subOp.childList" :key="index" :name="secondSub.parentId+''" :value="secondSub.basisElementId">{{secondSub.questionName}}</a-radio>
                                </a-radio-group>
                              </a-col>
                              <div v-if="subOp.hasChild > 0 && subOp.isRadio === 0  && (!subOp.logicValue || subOp.basisElementId === 1)" v-for="(thirdSub, index) in subOp.childList" :key="index">
                                <a-col :span="7">{{thirdSub.questionName}}</a-col>
                                <a-col :span="6">
                                  <a-radio-group v-if="thirdSub.simple === 1" :name="thirdSub.basisElementCopyId+''" v-model="thirdSub.basisElementId">
                                    <a-radio :value="1">是</a-radio>
                                    <a-radio :value="-1">否</a-radio>
                                  </a-radio-group>
                                  <a-input v-if="thirdSub.isWrite > 0" :name="thirdSub.basisElementCopyId + ''" :defaultValue="thirdSub.answers && thirdSub.answers.length && thirdSub.answers[0].elementTextValue" />
                                </a-col>
                              </div>
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
import { getPatientBasis, getElementsAnswer, submit } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'
import moment from 'moment'

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
      labelColHor: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 4}
      },
      labelColVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24}
      },
      wrapperHor: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 }
      },
      wrapperVer: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 }
      },
      visible: false,
      confirmLoading: false,
      patient: {},
      patientBasis: {},
      list: [],
      patientBasisId: this.$route.params.id,
      basisMaskId: undefined
    }
  },
  beforeCreate (){
    this.form = this.$form.createForm(this, {onFieldsChange: this.onFieldsChange, onValuesChange: this.onValuesChange})
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
  computed: {
    selectedCheckbox (){
      return function(list){
        var a = _.map(list, function(v){return v.answers})
        var b = _.flatten(a)
        var c = _.filter(b, function(v){return v && v.elementNumValue > 0})
        var d = _.map(c, function(v){return v.basisElementId})
        // return _.map(_.filter(_.flatten(_.map(list, function(a){return a.answers})),function(b){return b && b.elementNumValue > 0}),function(c){return c.basisElementId})
        return d
      }
    },
    selectedRadio (){ //动态改变basisElementId的值
      return function(sub){
        if(sub.simple > 0){
          if(sub.answers && sub.answers.length){
            sub.basisElementId = sub.answers[0].elementNumValue
          }
        }else{
          var re = _.filter(_.flatten(_.map(sub.childList, function(v){return v.answers})),function(v){return v && v.elementNumValue > 0});
          if(re && re.length) {
            sub.basisElementId = re[0].basisElementId
          }
        }
        return ''
      }
    },
    checkControlShow (){
      return function(node){
        console.log($('[value="' + node.parentId + '"]').prop('checked'))
        return $('[value="' + node.parentId + '"]').prop('checked')
      }
    }
  },
  methods: {
    ...mapActions(['CloseSidebar']),
    moment,
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
        that.list = that.initList(res.data)
        // that.logicList = _.filter(_.flatten(_.map(res.data, function(v){return _.flatMap(v)})),function(v){return v.logicValue > 0})
      })
    },
    save (){
      var result = []
      var a = _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementNumValue: $('input[name="' + item.basisElementCopyId + '"]:checked').val()
          })
        }else if(item.isWrite > 0){
          var text = $('[name="' + item.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + item.basisElementCopyId + '"] input').val() : $('[name="' + item.basisElementCopyId + '"]').val()
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementCopyId,
            elementTextValue: text
          }) 
        }
        if(item.hasChild > 0){
          if(item.childList[0].type === 1){
            _.each(item.childList, function(sub){
              if(sub.isWrite > 0){
                var text = $('[name="' + sub.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + sub.basisElementCopyId + '"] input').val() : $('[name="' + sub.basisElementCopyId + '"]').val()
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementTextValue: text
                })
              }
              if(sub.simple > 0){
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('input[name="' + sub.basisElementCopyId + '"]:checked').val()
                })
              }
              
              if(sub.hasChild > 0){
                if(sub.isRadio !== 0){
                  _.each(sub.childList, function(third){
                    result.push({
                      basisAnswerId: third.answers && third.answers.length ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('[value="' + third.basisElementCopyId + '"][name="' + third.parentId + '"]').prop('checked') ? 1 : -1
                    })
                  })
                }
                _.each(sub.childList, function(third){
                  if(third.simple > 0){
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementNumValue: $('input[name="' + third.basisElementCopyId + '"]:checked').val()
                    })
                  }
                  if(third.isWrite > 0){
                    var text = $('[name="' + third.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + third.basisElementCopyId + '"] input').val() : $('[name="' + third.basisElementCopyId + '"]').val()
                    result.push({
                      basisAnswerId: (third.answers && third.answers.length) ? third.answers[0].basisAnswerId : '',
                      basisElementId: third.basisElementCopyId,
                      elementTextValue: text || ''
                    })
                  }
                  if(third.hasChild > 0){
                    
                    _.each(third.childList,function(fourth){
                      if(third.isRadio !== 0){
                        result.push({
                          basisAnswerId: fourth.answers && fourth.answers.length ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('[value="' + fourth.basisElementCopyId + '"][name="' + fourth.parentId + '"]').prop('checked') ? 1 : -1
                        })
                      }
                      if(fourth.simple > 0){
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementNumValue: $('input[name="' + fourth.basisElementCopyId + '"]:checked').val()
                        })
                      }
                      if(fourth.isWrite > 0){
                        var text = $('[name="' + fourth.basisElementCopyId + '"]').hasClass('ant-calendar-picker') ? $('[name="' + fourth.basisElementCopyId + '"] input').val() : $('[name="' + fourth.basisElementCopyId + '"]').val()
                        result.push({
                          basisAnswerId: (fourth.answers && fourth.answers.length) ? fourth.answers[0].basisAnswerId : '',
                          basisElementId: fourth.basisElementCopyId,
                          elementTextValue: text || ''
                        })
                      }
                    })
                  }
                })
              }
            })
          }else{
            // 是选项，单选或多选
            if(item.isRadio !== 0){
              _.each(item.childList, function(sub){
                result.push({
                  basisAnswerId: sub.answers && sub.answers.length ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementCopyId,
                  elementNumValue: $('[value="' + sub.basisElementCopyId + '"][name="' + sub.parentId + '"]').prop('checked') ? 1 : -1
                })
                // TODO:此处后面需看还有没有更多情况
                if(sub.hasChild > 0 && sub.isWrite > 0){
                  result.push({
                    basisAnswer: sub.childList[0].answers && sub.childList[0].answers.length ? sub.childList[0].answers[0].basisAnswerId : '',
                    basisElementId: sub.childList[0].basisElementCopyId,
                    elementTextValue: $('[name="' + sub.childList[0].basisElementCopyId + '"]').val()
                  })
                }
              })
            }
            // $('input[name="' + item.basisElementCopyId + '"][type!="text"]').each(function(i,v){
            //   if($(v).data('nip') && $(v).data('nip') > 0){
            //     result.push({
            //       basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            //       basisElementId: parseInt($(v).val()),
            //       elementNumValue: $(v).prop('checked') ? 1 : -1,
            //       elementTextValue: $('[name="' + $(v).val() +'-text"]').val()
            //     })
            //   }else{
            //     result.push({
            //       basisAnswerId: $(v).,
            //       basisElementId: parseInt($(v).val()),
            //       elementNumValue: $(v).prop('checked') ? 1 : -1
            //     })
            //   }
            // })
          }
        }
      })
      console.log(result)
      var params = new URLSearchParams();
      params.append('basisAnswer', JSON.stringify(result))
      params.append('patientBasis', JSON.stringify(this.patientBasis))
      params.append('basisMarkId', this.basisMaskId)
      submit(params)
      .then(res => {
        console.log(res)
        alert('保存成功')
        location.href = location.href
      })
      .catch(error => {
        console.log(error)
      })
    },
    submit (){

    },
    onFieldsChange (props, fields){
      console.log('fields changed')
    },
    onValuesChange (props, values){
      console.log('values changed')
    },
    initList (list){
      _.each(list, function(a){
        if(a.hasChild > 0 && a.isRadio === 0){
          _.each(a.childList,function(b){
            if(b.simple > 0 && b.answers && b.answers.length){
              b.basisElementId = b.answers[0].elementNumValue
            }
            //单选
            if(b.hasChild > 0 && b.isRadio > 0){
              var re = _.filter(b.childList, function(v){return v.answers && v.answers.length && v.answers[0].elementNumValue > 0})
              if(re.length) b.basisElementId = re[0].basisElementId
            }
            //多选
            if(b.hasChild > 0 && b.isRadio < 0){
              if(b.childList[0].answers && b.childList[0].answers.length){
                b.elementId = _.map(_.filter(_.flatten(_.map(b.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
              }else{
                b.elementId = []
              }
            }
            //子选项,第三层
            if(b.hasChild > 0 && b.isRadio === 0){
              _.each(b.childList, function(c){
                if(c.simple > 0 && c.answers && c.answers.length){
                  c.basisElementId = c.answers[0].elementNumValue
                }
                if(c.hasChild > 0 && c.isRadio === 0){
                  _.each(c.childList, function(d){
                    if(d.simple > 0 && d.answers && d.answers.length){
                      d.basisElementId = d.answers[0].elementNumValue
                    }
                  })
                }
                if(c.hasChild > 0 && c.isRadio < 0){
                  if(c.childList[0].answers && c.childList[0].answers.length){
                    c.elementId = _.map(_.filter(_.flatten(_.map(c.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
                  }else{
                    c.elementId = []
                  }
                }
              })
            }
          })
        }else if(a.hasChild > 0 && a.isRadio < 0){
          if(a.childList[0].answers && a.childList[0].answers.length){
            a.elementId = _.map(_.filter(_.flatten(_.map(a.childList,function(v){return v.answers})),function(v){return v.elementNumValue > 0}),function(v){return v.basisElementId})
          }else{
            a.elementId = []
          }
        }
      })
      return list
    }
  }
};
</script>

<style lang="less" scoped>
.clear{
  clear: both;
}
.ant-col-4 .ant-calendar-picker,
.ant-col-6 .ant-calendar-picker{
  width: 100%;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper{
  margin-left: 0;
}
.ant-form label,
.ant-col-7,
.ant-col-4{
  font-size: 16px;
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
      &.ant-col-md-24 label{
        display: block;
        background-color: #F7F8F8;
        font-weight: bold;
        font-size: 16px;
        color: #231815;
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
