<template>
  <div class="footer">
    <span class="theme--main-color--as-border-color"></span>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="scss">
  .footer {
    grid-column-start: 1;
    grid-column-end: 3;
    border-top: 2px solid $theme--global--border-color;
    overflow: hidden;
    position: relative;

    span {
      display: inline-block;
      width: 1em;
      border-top: 0.1em solid white;
      position: absolute;
      top: 50%;
      right: 3.0vw;
      transform: translateY(-50%);
    }
  }
</style>
