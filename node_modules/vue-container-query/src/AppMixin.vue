<template>
  <pre class="app">{{ containerQuery }}</pre>
</template>

<script>
import { createContainerQueryMixin } from './'

const query = {
  'width-between-400-and-599': {
    minWidth: 400,
    maxWidth: 599
  },
  'width-larger-than-600': {
    minWidth: 600
  }
}

export default {
  name: 'app2',
  mixins: [
    createContainerQueryMixin(query)
  ]
}
</script>
