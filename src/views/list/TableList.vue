<template>
  <a-card :bordered="false">
    <router-view />
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'

export default {
  name: 'TableListWrapper',
  components: {
    AInput,
    ATextarea
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {

  }
}
</script>
