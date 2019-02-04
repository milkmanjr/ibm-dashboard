<template>
  <div v-if="visible" class="big-quote theme--background-color--as-background-color animated" :class="{'fadeOut': fadeOut}">
    <span class="theme--main-color--as-color" v-html="quote"></span>
  </div>
</template>

<script>
  export default {
    watch: {
      fadeOut (v) {
        if (v === true) {
          setTimeout(() => {
            this.visible = false
          }, 500)
        }
      }
    },
    data () {
      return {
        visible: true
      }
    },
    props: ['quote', 'fadeOut']
  }
</script>

<style lang="scss" scoped>
  .big-quote {
    display: block !important;
    padding: 5em 6em;
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding-right: 5em !important;

    span {
      font-size: 5rem;
      line-height: 110%;
      font-weight: normal;
    }

    p {
      font-size: 0.6rem;
      line-height: 0.6rem;
      font-family: $font--sans--thin;
      white-space: nowrap;
    }
  }
</style>
