
<template>
  <div>
    <button @click="submit">提交</button>
    <div v-for="(qu1, index) in list" :key="index">
      <p class="fl">{{qu1.questionName||''}}</p>
      <div v-if="qu1.simple > 0" class="fl" style="margin-left: 50px;">
        <label><input type="radio" :name="qu1.basisElementId" :value="1" :checked="qu1.answers && qu1.answers.length && qu1.answers[0].elementNumValue === 1">是</label>
        <label><input type="radio" :name="qu1.basisElementId" :value="-1" :checked="qu1.answers && qu1.answers.length && qu1.answers[0].elementNumValue === -1">否</label>
      </div>
      <div v-if="qu1.simple < 0 && qu1.isWrite > 0">
        <input type="text" style="margin-left: 50px;" :name="qu1.basisElementId" :value="qu1.answers && qu1.answers.length && qu1.answers[0].elementTextValue">
      </div>
      <div v-if="qu1.hasChild > 0" :class="{clear: qu1.showType === 2}">
        <!-- 单选 -->
        <div class="radio-group" v-if="qu1.isRadio > 0">
          <div :class="{fl: qu1.showType !== 2}" v-for="(op,index) in qu1.childList" :key="index">
            <label :class="{fl: qu1.showType !== 2}"><input type="radio" :name="op.parentId" :value="op.basisElementId">{{op.questionName||''}}</label>
            <p :class="{fl: qu1.showType !== 2}" v-if="op.isWrite > 0"><input type="text" name="">{{op.unit}}</p>
          </div>
        </div>
        <!-- 多选 -->
        <div class="check-group" v-if="qu1.isRadio < 0">
          <div :class="{fl: qu1.showType !== 2}" class="clear" v-for="(op,index) in qu1.childList" :key="index" style="margin-right: 20px;">
            <label class="fl"><input type="checkbox" :name="op.parentId" :value="op.basisElementId" :data-nip="op.isWrite" :checked="op.answers && op.answers.length && op.answers[0].elementNumValue > 0">{{op.questionName||''}}</label>
            <p style="margin-left: 10px;" class="fl" v-if="op.isWrite > 0"><input type="text" :name="[op.basisElementId+'-text']" :value="op.answers && op.answers.length && op.answers[0].elementTextValue || ''">{{op.unit}}</p>
            <!-- 子选项 -->
            <div v-if="op.hasChild > 0">
              <div class="radio-group" v-if="op.isRadio > 0">
                <div v-for="(sub,index) in op.childList">
                  <label class="fl"><input type="radio" :name="sub.parentId" :value="sub.basisElementId">{{sub.questionName||''}}</label>
                </div>
              </div>
              <div class="check-group" v-if="op.isRadio < 0">
                <div v-for="(sub,index) in op.childList">
                  <label class="fl"><input type="checkbox" :name="sub.parentId" :value="sub.basisElementId">{{sub.questionName||''}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 是题目，下面有选项 -->
        <div v-else>
          <div v-for="(sub, index) in qu1.childList" :key="index" class="clear">
            <p :class="{fl: sub.showType === 1}">{{sub.sort}}.{{sub.questionName||''}}:</p>
            <p :class="{fl: sub.showType === 1}" v-if="sub.isWrite > 0"><input type="text" :name="sub.basisElementId" :value="sub.answers && sub.answers.length && sub.answers[0].elementTextValue||''">{{sub.unit}}</p>
            <div class="radio-group" v-if="sub.isRadio > 0">
              <div v-for="(subOp,index) in sub.childList" :key="index">
                <label :class="{fl: sub.showType === 1}"><input type="radio" :name="subOp.parentId" :value="subOp.basisElementId" :data-answer-id="subOp.answers && subOp.answers.length ? subOp.answers[0].basisAnswerId : ''" :checked="subOp.answers && subOp.answers.length && subOp.answers[0].elementNumValue > 0">{{subOp.questionName||''}}</label>
              </div>
            </div>
            <div class="check-group" v-if="sub.isRadio < 0"></div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
import { getElementsAnswer, submit } from '@/api/basis'
import _ from 'lodash'
import $ from 'jquery'

export default {

  name: 'Workplace',
  data () {
    return {
      list: []
    }
  },
  mounted () {
    var that = this
    var params = new URLSearchParams();
    params.append('basisMaskId', 10)
    params.append('patientBasisId', 1)
    getElementsAnswer(params)
    .then(res => {
      that.list = res.data
    })
  },
  methods: {
    getProjects () {
      this.$http.get('/element/list')
        .then(res => {
          this.list = res.result && res.result.second
        })
    },
    submit(){
      var result = [];
      var a = _.each(this.list, function(item){
        if(item.simple > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementId,
            elementNumValue: $('input[name="' + item.basisElementId + '"]:checked').val()
          })
        }else if(item.isWrite > 0){
          result.push({
            basisAnswerId: (item.answers && item.answers.length) ? item.answers[0].basisAnswerId : '',
            basisElementId: item.basisElementId,
            elementTextValue: $('input[name="' + item.basisElementId + '"]').val()
          }) 
        }
        if(item.hasChild > 0){
          if(item.childList[0].type === 1){
            _.each(item.childList, function(sub){
              if(sub.isWrite > 0){
                result.push({
                  basisAnswerId: (sub.answers && sub.answers.length) ? sub.answers[0].basisAnswerId : '',
                  basisElementId: sub.basisElementId,
                  elementTextValue: $('input[name="' + sub.basisElementId + '"]').val()
                })
              }
              $('input[name="' + sub.basisElementId + '"][type!="text"]').each(function(i,v){
                result.push({
                  basisAnswerId: $(v).data('answerId'),
                  basisElementId: parseInt($(v).val()),
                  elementNumValue: $(v).prop('checked') ? 1 : -1
                })
              })
            })
          }else{
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
      var patientBasis = {patientBasisId:1,"patientId":1,"type":1,"executeId":1,"executeStatus":1,"status":0}
      var patientBasisMark = {patientBasisId:1,"basisMarkId":10,"basisMarkName":"其他实验室检查","level":2,"progress":"10%"}
      var params = new URLSearchParams();
      params.append('basisAnswer', JSON.stringify(result))
      params.append('patientBasis', JSON.stringify(patientBasis))
      params.append('patientBasisMark', JSON.stringify(patientBasisMark))
      submit(params)
      .then(res => {
        console.log(res)
        alert('保存成功')
        location.href = location.href
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .fl{
    float: left;
  }
  .clear{
    clear: both;
  }
</style>
