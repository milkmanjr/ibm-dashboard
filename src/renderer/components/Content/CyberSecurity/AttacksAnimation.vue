<template>
  <div></div>
</template>

<script>
  import Dashboard from '@/bits/Attacks'
  export default {
    data () {
      return {}
    },
    mounted () {
      Dashboard.init()
    },
    destroyed () {
      Dashboard.teardown()
    },
    methods: {}
  }
</script>
