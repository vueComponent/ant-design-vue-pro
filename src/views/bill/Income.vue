<template>
  <div>{{ msg }}</div>
</template>
<script>
import { selectAllByPatternStatus } from '@/api/dealPattern'
export default {
    data () {
        return {
            msg: 'income'
        }
    },
    mounted () {
      this.selectAll()
    },
    methods: {
      selectAll () {
        selectAllByPatternStatus({ patternStatus: 1 }).then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      }
    }
}
</script>
