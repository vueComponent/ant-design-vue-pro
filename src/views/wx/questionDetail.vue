<template>
  <div>

  </div>
</template>

<script>
  import { getWxQuestionDetail } from '@/api/distract'
  export default {
    created() {
      const params = {
        questionId: this.$route.params.id
      }
      getWxQuestionDetail(params).then(res => {

      })
    }
  }
</script>

<style lang="less" scoped>
</style>