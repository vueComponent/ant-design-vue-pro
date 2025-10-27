<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <!--
      <a @click="showVersion">合源缴费系统 V{{ version.version }}</a>
      <a @click="showShiyong">使用须知</a>
      -->
      <a-modal
        title="更新说明"
        :width="640"
        :visible="visible"
        @cancel="handleCancel"
        :footer="null"
      >
        <div style="width: 100%;height:450px;overflow-y:auto;">
          <a-timeline>
            <a-timeline-item v-for="(item, index) in version.result" :key="index" color="red">
              <p>{{ item.time + ' V' + item.version }}</p>
              <span v-html="item.content" />
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-modal>
      <a-modal
        title="使用须知"
        :width="640"
        :visible="visible2"
        @cancel="handle2Cancel"
        :footer="null"
      >
        <div style="width: 100%;height:450px;overflow-y:auto;font-size:18px;color:#FF0000;">
          <p>1.请勿把服务器任何信息透露给别人，服务器相关账号密码设置足够复杂,确保服务器安全。自行维护服务器数据安全，以免造成损失。</p>
          <p>2.不得利用本系统实施违法或欺诈行为。</p>
          <p>3.为了系统安全和可持续发展，请勿把源代码透漏给任何人(对透漏源代码的用户后期停止所有支持，并要求其赔偿相应损失)</p>
          <p>4.未经我方同意，不能擅自把系统转让给他人(擅自转让的系统不做更新维护，如造成损失的，要求其赔偿相应损失)</p>
          <p>5.未经我方同意，不能擅自把系统转让给他人(擅自转让的系统不做更新维护，如造成损失的，要求其赔偿相应损失)</p>
          <p>使用本系统，默认同意以上协议，合作愉快谢谢</p>
          <p>技术支持: QQ:494907837,手机:18955263033</p>

        </div>
      </a-modal>
    </template>
  </global-footer>
</template>

<script>
import Vue from 'vue'
import { GlobalFooter } from '@ant-design-vue/pro-layout'
import { Modal, Timeline } from 'ant-design-vue'
Vue.use(Modal)
Vue.use(Timeline)
export default {
  name: 'ProGlobalFooter',
  props: {
    version: {
      type: Object,
      default: () => null
    }
  },
  components: {
    GlobalFooter
  },
  data () {
    return {
      visible: false,
      visible2: false
    }
  },
  methods: {
    // 显示版本
    showVersion () {
      this.visible = true
    },
    handleCancel (e) {
      this.visible = false
    },
    showShiyong () {
      this.visible2 = true
    },
    handle2Cancel (e) {
      this.visible2 = false
    }
  }
}
</script>
