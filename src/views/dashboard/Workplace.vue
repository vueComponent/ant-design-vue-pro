
<template>
  <div>
    <div v-for="(qu1, index) in list" :key="index">
      <p class="fl">{{qu1.questionName||''}}</p>
      <div v-if="qu1.simple > 0" class="fl" style="margin-left: 50px;">
        <label><input type="radio" :name="qu1.basisElementId" :value="[qu1.basisElementId+'_1']">是</label>
        <label><input type="radio" :name="qu1.basisElementId" :value="[qu1.basisElementId+'_-1']">否</label>
      </div>
      <div v-if="qu1.simple < 0 && qu1.isWrite > 0">
        <input type="text" style="margin-left: 50px;" :name="qu1.basisElementId">
      </div>
      <div v-if="qu1.hasChild > 0" :class="{clear: qu1.showType === 2}">
        <!-- 单选 -->
        <div class="radio-group" v-if="qu1.isRadio > 0">
          <div :class="{fl: qu1.showType !== 2}" v-for="(op,index) in qu1.childList" :key="index">
            <label :class="{fl: qu1.showType !== 2}"><input type="radio" :name="op.parentId" :value="[op.parentId + '_' + op.basisElementId]">{{op.questionName||''}}</label>
            <p :class="{fl: qu1.showType !== 2}" v-if="op.isWrite > 0"><input type="text" name="">{{op.unit}}</p>
          </div>
        </div>
        <!-- 多选 -->
        <div class="check-group" v-if="qu1.isRadio < 0">
          <div :class="{fl: qu1.showType !== 2}" class="clear" v-for="(op,index) in qu1.childList" :key="index" style="margin-right: 20px;">
            <label class="fl"><input type="checkbox" :name="op.parentId" :value="[op.parentId + '_' + op.basisElementId]">{{op.questionName||''}}</label>
            <p style="margin-left: 10px;" class="fl" v-if="op.isWrite > 0"><input type="text" name="">{{op.unit}}</p>
            <!-- 子选项 -->
            <div v-if="op.hasChild > 0">
              <div class="radio-group" v-if="op.isRadio > 0">
                <div v-for="(sub,index) in op.childList">
                  <label class="fl"><input type="radio" :name="sub.parentId" :value="[sub.parentId + '_' + sub.basisElementId]">{{sub.questionName||''}}</label>
                </div>
              </div>
              <div class="check-group" v-if="op.isRadio < 0">
                <div v-for="(sub,index) in op.childList">
                  <label class="fl"><input type="radio" :name="sub.parentId" :value="[sub.parentId + '_' + sub.basisElementId]">{{sub.questionName||''}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 是题目，下面有选项 -->
        <div v-else>
          <div v-for="(sub, index) in qu1.childList" :key="index" class="clear">
            <p :class="{fl: sub.showType === 1}">{{sub.sort}}.{{sub.questionName||''}}:</p>
            <p :class="{fl: sub.showType === 1}" v-if="sub.isWrite > 0"><input type="text" name="">{{sub.unit}}</p>
            <div class="radio-group" v-if="sub.isRadio > 0">
              <div v-for="(subOp,index) in sub.childList" :key="index">
                <label :class="{fl: sub.showType === 1}"><input type="radio" :name="subOp.parentId" :value="[subOp.parentId + '_' + subOp.basisElementId]">{{subOp.questionName||''}}</label>
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
export default {
  name: 'Workplace',
  data () {
    return {
      list: []
    }
  },
  computed: {
    
  },
  created () {
   
  },
  mounted () {
    this.getProjects()
  },
  methods: {
    getProjects () {
      this.$http.get('/element/list')
        .then(res => {
          this.list = res.result && res.result.seven
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
