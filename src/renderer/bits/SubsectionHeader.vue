<template>
  <div class="subsection-header">
    <h2>{{ text }}</h2>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['text']
  }
</script>

<style lang="scss" scoped>
  .subsection-header {
    margin-bottom: 0.5rem;

    h2 {
      font-family: $font--sans--thin;
      font-size: 0.65rem;
      letter-spacing: 0.05rem;
      padding-bottom: 0.15rem;
      border-bottom: 0.05rem solid white;
    }
  }
</style>
