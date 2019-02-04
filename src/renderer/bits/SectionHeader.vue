<template>
  <header class="section-header">
    <h1 class="theme--main-color--as-color theme--sub-color--as-border-color"><i>{{ text }}</i> <small>{{ subtext }}</small></h1>
    <span class="theme--main-color--as-color">{{ index }}</span>
  </header>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['text', 'index', 'subtext']
  }
</script>

<style lang="scss">
  .section-header {
    grid-column-start: 1;
    grid-column-end: 3;
    /*padding-top: 3vw;
    padding-right: 3vw;*/
    position: relative;
    display: flex;
    align-items: center;

    h1 {
      font-size: 2.5em;
      border-top: 0.045em solid white;
      padding-top: 0.25em;
      font-family: $font--sans--light;
      width: calc(100% - 3vw);
      color: #fff !important;
      display: flex;
      flex-direction: column;
      height: 10vh;
      justify-content: center;
      margin-top: 3vh;

      i {
        font-style: normal;
      }

      small {
        display: block;
        font-size: .5em;
      }
    }

    span {
      position: absolute;
      top: 50%;
      right: 3vw;
      font-size: 2em;
      font-family: $font--mono--light;
      opacity: 1;
      color: #fff !important;
    }
  }
</style>
