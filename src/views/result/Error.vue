<template>
  <a-card :bordered="false">
    <a-result status="error" :title="result.title" :sub-title="result.description">
      <template #extra>
        <a-button type="primary" >{{ $t('result.fail.error.btn-text') }}</a-button>
      </template>
      <div class="desc">
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px">
          {{ $t('result.fail.error.hint-title') }}
        </div>
        <div style="margin-bottom: 16px">
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text1') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn1') }} <a-icon type="right" /></a>
        </div>
        <div>
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          {{ $t('result.fail.error.hint-text2') }}
          <a style="margin-left: 16px">{{ $t('result.fail.error.hint-btn2') }} <a-icon type="right" /></a>
        </div>
      </div>
    </a-result>
  </a-card>
</template>

<script>

export default {
  name: 'Error',
  computed: {
    result () {
      return {
      title: this.$t('result.fail.error.title'),
      description: this.$t('result.fail.error.description')
      }
    }
  }
}
</script>
