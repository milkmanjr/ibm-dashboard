<template>
  <div class="labeled-value">
    <span class="theme--main-color--as-color">{{ value }}</span>
    <p>{{ label }}</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['label', 'value']
  }
</script>

<style lang="scss" scoped>
  .labeled-value {
    span {
      font-size: 1.2rem;
      letter-spacing: 0.05rem;
    }

    p {
      font-size: 0.6rem;
      line-height: 0.6rem;
      font-family: $font--sans--thin;
      white-space: nowrap;
    }
  }
</style>
