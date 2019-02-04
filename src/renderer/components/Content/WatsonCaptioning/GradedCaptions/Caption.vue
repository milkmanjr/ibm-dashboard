<template>
  <div class="caption">
    <span class="grade theme--sub-color--as-color">{{ grade || '' }}</span>
    <p class="text theme--main-color--as-color">{{ text }}</p>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['grade', 'text']
  }
</script>

<style lang="scss">
  .caption {
    display: flex;
    padding: 1em 0;
    font-family: $font--sans--thin;
    font-size: 1.1em;

    &:nth-child(n+2) {
      opacity: 0.35;
    }

    .grade {
      width: 15%;
      text-align: left;
      padding-right: 2em;
    }

    .text {
      width: 70%;
    }
  }
</style>
