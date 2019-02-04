<template>
  <div class="video-overlay" v-if="this.playing">
    <video ref="video" :src="src" autoplay />
  </div>
</template>

<script>
  import {EventNames, Event, EventState} from '@/bits/Events'

  export default {
    data () {
      return {
        src: '',
        playing: false
      }
    },
    created () {
      Event.$on(EventNames.PLAY_VIDEO, this.playOrStop)
      Event.$on(EventNames.STOP_VIDEO, this.stop)
    },
    destroyed () {
      Event.$off(EventNames.PLAY_VIDEO, this.playOrStop)
      Event.$off(EventNames.STOP_VIDEO, this.stop)
    },
    methods: {
      playOrStop (e) {
        if (this.playing === false) {
          this.play(e)
        } else {
          this.stop()
        }
      },
      play (e) {
        this.src = `static/videos/${e.src}`
        Event.$emit(EventNames.PLAYING, {src: this.src})
        this.playing = EventState.playing = true
      },
      stop () {
        Event.$emit(EventNames.STOPPED, {src: this.src})
        this.playing = EventState.playing = false
      }
    },
    props: []
  }
</script>

<style lang="scss" scoped>
  .video-overlay {
    background: #000;
    position: absolute;
    width: 66.8%;
    height: 72%;
    top: 17.9%;
    z-index: 3;
    display: block;

    video {
      width: 100%;
      height: 100%;
    }
  }
</style>
