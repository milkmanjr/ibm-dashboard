<template>
  <div class="content">
    <video-overlay />
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    components: {
      'video-overlay': require('@/bits/VideoOverlay')
    }
  }
</script>

<style lang="scss">
  .content {

    // this refers to all direct children components of Content (IBMCloud, CyberSecurity, etc)
    > div {
      height: 100%;
      display: grid;
      grid-template-columns: 80% 20%;
      grid-template-rows: 20% 80%;

      // Common elements inside the content view:
      // note: header has its own component called section-header

      section {
        border: 2px solid $theme--global--border-color;
        border-top-width: 4px;
        position: relative;
      }

      aside {
        border: 2px solid $theme--global--border-color;
        border-top-width: 4px;
        position: relative;
      }
    }
  }
</style>
