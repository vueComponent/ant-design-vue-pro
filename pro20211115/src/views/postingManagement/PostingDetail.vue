<template>
  <page-header-wrapper>
    <h1>帖子详情</h1>
    <div v-html="htmlData"/>
  </page-header-wrapper>
</template>

<script>
import request from '@/utils/request'
import storage from 'store'
import { ROLE_ID } from '@/store/mutation-types'

export default {
  name: 'postingDetail',
  data () {
    return {
      htmlData: ''
    }
  },
  created () {
    console.log(this.$route.params.postingId)
    if (this.$route.params.postingId) {
      if (storage.get(ROLE_ID) === 'organization') {
        request({
          url: '/posting/organizationGetPostingDetail/' + this.$route.params.postingId,
          method: 'get'
        })
          .then(res => {
            console.log(res)
            console.log(res.data.content)
            this.htmlData = res.data.content
          })
      } else if (storage.get(ROLE_ID) === 'admin') {
        request({
          url: '/posting/adminGetPostingDetail/' + this.$route.params.postingId,
          method: 'get'
        })
          .then(res => {
            console.log(res)
            this.htmlData = res.data.content
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
