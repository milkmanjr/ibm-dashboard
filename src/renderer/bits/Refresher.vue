<template>
</template>

<script>
  import {Event} from '@/bits/Events'

  export default {
    data () {
      return {}
    },
    created () {
      this.timer = setInterval(() => {
        Event.$emit(this.refreshType)
      }, this.interval)
    },
    destroyed () {
      clearInterval(this.timer)
    },
    props: ['interval', 'refreshType']
  }
</script>
