<template>
  <div class="now-playing">
    <div class="videoWrapper">
      <video :src="nowPlayingVideo.videoUrl" autoplay ref="theVideo"></video>
    </div>
    <div class="matchAnalysis">
      <div class="donutWrapper">
        <h4>{{ Math.round(nowPlayingVideo.matchAnalysis * 100) }}%</h4>
        <donut v-if="matchAnalysisData" :chart-data="matchAnalysisData"></donut>
      </div>
      <span>Match analysis</span>
    </div>
    <div class="playerGestures">
      <div class="donutWrapper">
        <h4>{{ Math.round(nowPlayingVideo.playerGestures * 100) }}%</h4>
        <donut v-if="playerGesturesData" :chart-data="playerGesturesData"></donut>
      </div>
      <span>Player gestures</span>
    </div>
    <div class="crowdCheering">
      <div class="donutWrapper">
        <h4>{{ Math.round(nowPlayingVideo.crowdCheering * 100) }}%</h4>
        <donut v-if="crowdCheeringData" :chart-data="crowdCheeringData"></donut>
      </div>
      <span>Crowd cheering</span>
    </div>
    <div class="overallExcitement">
      <div class="donutWrapper">
        <h4>{{ Math.round(nowPlayingVideo.overallExcitement * 100) }}%</h4>
        <!-- needs v-if for the donut, otherwise its options property won't work -->
        <donut v-if="overallExcitementData" :chart-data="overallExcitementData"></donut>
      </div>
      <span>Overall excitement</span>
    </div>
  </div>
</template>

<script>
  import Donut from '@/bits/Donut'
  import {Event, EventNames, EventState} from '@/bits/Events'

  export default {
    data () {
      return {
        matchAnalysisData: null,
        playerGesturesData: null,
        crowdCheeringData: null,
        overallExcitementData: null
      }
    },
    props: ['nowPlayingVideo'],
    components: {
      'donut': Donut
    },
    mounted () {
      if (this.$refs.theVideo) {
        this.$refs.theVideo.addEventListener('ended', () => {
          this.$emit('videoEnded')
        })
      }

      // add watcher for whenever the video changes
      this.$watch('nowPlayingVideo', (newVal, oldVal) => {
        // note: vue warns about the chartData prop being mutated inside the Donut component, but this seems to be a bug with vue@2.4.x
        // although I have downgraded vue to 2.3.2 and it still exists
        // see this: https://github.com/apertureless/vue-chartjs/issues/151
        // note 2: if you upgrade to vue 2.4.x, you get another warning $attrs is read-only, which seems to stop JS execution
        this.fillData()
      })

      this.fillData()

      // mute the video if its playing
      if (EventState.playing) {
        this.muteVideo()
      }

      Event.$on(EventNames.PLAYING, this.muteVideo)
      Event.$on(EventNames.STOPPED, this.unmuteVideo)
    },
    destroyed () {
      Event.$off(EventNames.PLAYING, this.muteVideo)
      Event.$off(EventNames.STOPPED, this.unmuteVideo)
    },
    methods: {
      fillData () {
        let overallExcitement = parseInt(this.nowPlayingVideo.overallExcitement * 100)
        let matchAnalysis = parseInt(this.nowPlayingVideo.matchAnalysis * 100)
        let playerGestures = parseInt(this.nowPlayingVideo.playerGestures * 100)
        let crowdCheering = parseInt(this.nowPlayingVideo.crowdCheering * 100)

        this.overallExcitementData = this.getSharedDonutProps([overallExcitement, (100 - overallExcitement)])
        this.matchAnalysisData = this.getSharedDonutProps([matchAnalysis, (100 - matchAnalysis)])
        this.playerGesturesData = this.getSharedDonutProps([playerGestures, (100 - playerGestures)])
        this.crowdCheeringData = this.getSharedDonutProps([crowdCheering, (100 - crowdCheering)])
      },
      muteVideo () {
        this.$refs.theVideo.volume = 0
      },
      unmuteVideo () {
        this.$refs.theVideo.volume = 1
      },
      getSharedDonutProps (value) {
        return {
          datasets: [
            {
              backgroundColor: ['#B3DF69', 'rgba(255, 255, 255, 0.15)'],
              borderWidth: 0,
              data: value
            }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
  .now-playing {
    background-color: rgba(0, 0, 0, 0.15);
    display: grid;
    height: 100%;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% (50% / 3) (50% / 3) (50% / 3);


    .videoWrapper {
      grid-column: 1 / 3;
      grid-row: 1 / 2;
      background-color: rgba(0, 0, 0, 0.25);
      padding: 1em 2em;

      video {
        display: block;
        width: 100%;
      }
    }

    .matchAnalysis {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      padding: 1em 2em;
      border-top-width: 4px !important;
    }

    .playerGestures {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }

    .crowdCheering {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
      border-bottom-width: 4px;
    }

    .matchAnalysis,
    .playerGestures,
    .crowdCheering {
      position: relative;
      background-color: rgba(0, 0, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1em 2em;
      border: 2px solid rgba(255,255,255,0.05);

      .donutWrapper {
        position: relative;
        width: 3vw;
        height: 3vw;

        canvas {
          position: relative;
          top: -9%;
        }

        h4 {
          text-align: center;
          width: 3em;
          font-family: $font--mono--light;
          font-weight: normal;
          font-size: 0.5em;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      span {
        display: inline-block;
        width: 10em;
        text-align: center;
        font-size: 0.85rem;
        white-space: nowrap;
      }
    }

    .overallExcitement {
      padding: 1em 2em;
      grid-column: 2 / 3;
      grid-row: 2 / 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      .donutWrapper {
        position: relative;
        width: 10vw;
        height: 10vw;
      }

      h4 {
        position: absolute;
        font-size: 2.5rem;
        font-family: $font--mono--light;
        font-weight: normal;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      span {
        font-size: 0.85rem;
      }
    }
  }
</style>
