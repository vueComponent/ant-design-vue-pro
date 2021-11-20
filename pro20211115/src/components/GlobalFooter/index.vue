<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
<<<<<<< HEAD
<!--      <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>-->
      <a href="https://www.github.com/herobrine1010/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://mp.weixin.qq.com/s/1ss8Xm4_vdusX5F6b-5_RA" target="_blank">关于破壁</a>
    </template>
    <template v-slot:copyright>
      <a href="https://www.tongji.edu.cn/" target="_blank">Copyright &copy; 2021 Tongji University</a>
=======
      <!--      <a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>-->
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://www.github.com/sendya/" target="_blank">关于破壁</a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/vueComponent" target="_blank">Copyright &copy; 2021 Tongji University</a>
>>>>>>> c78b5c4 (xx)
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
