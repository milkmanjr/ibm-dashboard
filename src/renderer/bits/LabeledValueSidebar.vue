<template>
  <div class="labeled-value theme--main-color--as-border-color">
    <h4>{{ highlight.value }}<span v-if="highlight.unit"> {{ highlight.unit }}</span></h4>
    <p v-html="highlight.label"></p>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['highlight']
  }
</script>

<style lang="scss" scoped>
  .labeled-value {
    border-left: 3px solid #ccc;
    padding: 0.5em 0 0.5em 1em;

    h4 {
      font-size: 1.75rem;
      font-family: $font--mono--light;
      line-height: 150%;

      span {
        font-family: $font--sans--thin;
      }
    }

    p {
      font-size: 0.7rem;
      line-height: 150%;
      font-family: $font--sans--thin;
      white-space: normal;
    }
  }
</style>
