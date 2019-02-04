<template>
  <span class="fake-button" v-on:click="play"></span>
</template>

<script>
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {}
    },
    mounted () {
      Event.$on(EventNames.PLAYING, this.setActive)
      Event.$on(EventNames.STOPPED, this.unsetActive)
    },
    destroyed () {
      Event.$off(EventNames.PLAYING, this.setActive)
      Event.$off(EventNames.STOPPED, this.unsetActive)
    },
    methods: {
      play () {
        Event.$emit(EventNames.PLAY_VIDEO, {src: this.video})
      },
      setActive (e) {
        if (e.src.indexOf(this.video) > -1) {
          this.$emit('playing')
        }
      },
      unsetActive (e) {

      }
    },
    props: ['video']
  }
</script>

<style lang="scss" scoped>
  span.fake-button {
    height: 50%;
    width: 20%;
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
  }
</style>
