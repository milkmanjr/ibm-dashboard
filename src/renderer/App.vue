<template>
  <div id="app" :class="'theme--'+theme">
    <router-view name="menu"></router-view>
    <router-view name="content"></router-view>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'smt-dashboard-electron',
    data () {
      return {
        theme: 'home'
      }
    },
    created () {
      this.updateTheme()

      // after each route change, update the theme
      this.$router.afterEach((to, from) => {
        this.updateTheme()
      })
    },
    methods: {
      updateTheme: function () {
        this.theme = this.$route.name
      }
    }
  }
</script>

<style lang="scss">
  // Import fonts here so that they'll only get compiled ONCE
  // Multiple font-family declarations cause a text rendering bug
  @import '~font-awesome/css/font-awesome.css';
  @import '~animate.css';
  @import './assets/styles/fonts';
  @import './assets/styles/classes';

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    user-select: none;
  }

  html {
    font-size: 1vw;
  }

  #app {
    font-family: $font--sans--regular;
    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 16.5% 83.5%;
    grid-template-rows: 90% 10%;

    // default theme
    @include generate-theme(black, white, gray);

    &.theme--home {
      @include generate-theme($theme--home--background-color,
                              $theme--home--main-color,
                              $theme--home--sub-color);
    }

    &.theme--ibm-cloud {
      @include generate-theme($theme--ibm-cloud--background-color,
                              $theme--ibm-cloud--main-color,
                              $theme--ibm-cloud--sub-color);
    }

    &.theme--cyber-security {
      @include generate-theme($theme--cyber-security--background-color,
                              $theme--cyber-security--main-color,
                              $theme--cyber-security--sub-color);
    }

    &.theme--watson-captioning {
      @include generate-theme($theme--watson-captioning--background-color,
                              $theme--watson-captioning--main-color,
                              $theme--watson-captioning--sub-color);
    }

    &.theme--cognitive-highlights {
      @include generate-theme($theme--cognitive-highlights--background-color,
                              $theme--cognitive-highlights--main-color,
                              $theme--cognitive-highlights--sub-color);
    }

    &.theme--slam-tracker {
      @include generate-theme($theme--slam-tracker--background-color,
                              $theme--slam-tracker--main-color,
                              $theme--slam-tracker--sub-color);
    }

    &.theme--cognitive-concierge {
      @include generate-theme($theme--cognitive-concierge--background-color,
                              $theme--cognitive-concierge--main-color,
                              $theme--cognitive-concierge--sub-color);
    }
  }
</style>
