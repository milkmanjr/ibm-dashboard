<template>
  <div class="captioned-video">
    <video :src="videoLink" ref="theVideo" autoplay></video>
  </div>
</template>

<script>
  import {Event, EventNames, EventState} from '@/bits/Events'

  export default {
    data () {
      return {}
    },
    mounted () {
      if (EventState.playing) this.muteVideo()

      Event.$on(EventNames.PLAYING, this.muteVideo)
      Event.$on(EventNames.STOPPED, this.unmuteVideo)
    },
    destroyed () {
      Event.$off(EventNames.PLAYING, this.muteVideo)
      Event.$off(EventNames.STOPPED, this.unmuteVideo)
    },
    props: ['videoLink'],
    methods: {
      muteVideo () {
        this.$refs.theVideo.volume = 0
      },
      unmuteVideo () {
        this.$refs.theVideo.volume = 1
      }
    }
  }
</script>

<style lang="scss">
  .captioned-video {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1em 2em;

    video {
      display: block;
      width: 100%;
    }
  }
</style>
