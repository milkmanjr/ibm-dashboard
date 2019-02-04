<template>
  <div class="cognitive-highlights">
    <section-header subtext="IBM Cloud: AI ready" text="AI Highlights" index="04"></section-header>

    <section>
      <video-header v-if="nowPlaying >= 0" :nowPlayingVideo="videos[nowPlaying]"></video-header>
      <now-playing  v-if="nowPlaying >= 0" :nowPlayingVideo="videos[nowPlaying]" @videoEnded="playNextVideo"></now-playing>
      <video-list v-if="nowPlaying >= 0" :videos="videos" :nowPlaying="nowPlaying" @pickVideo="setNowPlaying"></video-list>
    </section>

    <right-sidebar :fade="fade" :quote="quote" :points="points"></right-sidebar>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data () {
      return {
        fade: true,
        videos: [],
        nowPlaying: -1,
        points: [
          {
            value: '16,000',
            label: 'Watson client engagements in 80 different countries and 20 different industries'
          }, {
            value: '1,400',
            label: 'AI-related patents secured by IBM technologists'
          }, {
            value: '15',
            label: 'Watson APIs currently available through the IBM Cloud'
          }
        ],
        quote: {
          text: 'The ultimate goal is to cover the US Open at the highest level that we can.',
          speaker: 'Patti Fallick',
          position: 'Senior Director,<br/>Broadcast Operations',
          headshot: 'static/speakers/patti_fallick.png'
        }
      }
    },
    components: {
      'section-header': require('@/bits/SectionHeader'),
      'right-sidebar': require('@/bits/RightSidebar'),
      'video-header': require('@/components/Content/CognitiveHighlights/VideoHeader'),
      'now-playing': require('@/components/Content/CognitiveHighlights/NowPlaying'),
      'video-list': require('@/components/Content/CognitiveHighlights/VideoList')
    },
    mounted () {
      this.fade = true
      this.refresh()
    },
    methods: {
      setNowPlaying (index) {
        this.nowPlaying = index
        this.videos[this.nowPlaying].videoUrl = this.videos[this.nowPlaying].videoUrl.match(/^\/\//) ? ('https:' + this.videos[this.nowPlaying].videoUrl) : this.videos[this.nowPlaying].videoUrl
      },
      playNextVideo () {
        if (this.nowPlaying < this.videos.length - 1) {
          this.nowPlaying++
        }
      },
      refresh () {
        let timestampToDatetime = Vue.filter('timestamp-to-datetime')

        Vue.http('https://coghlclipstranslator-thankful-turtle.mybluemix.net/data').then((response) => {
          response.data.map((video) => {
            (video.excitement_score >= 0.5) && this.videos.push({
              title: timestampToDatetime(video.timestamp),
              players: video.team_1 + ' vs. ' + video.team_2,
              thumbnail: video.thumbnail.replace(/^\/\//g, 'https://'),
              videoUrl: video.url.replace(/^\/\//g, 'https://'),
              overallExcitement: video.excitement_score.toFixed(2),
              matchAnalysis: video.analytics_score.toFixed(2),
              playerGestures: video.action_score.toFixed(2),
              crowdCheering: video.cheer_score.toFixed(2)
            })
          })

          this.setNowPlaying(0)
        })
      }
    }
  }
</script>

<style lang="scss">
  .cognitive-highlights {
    section {
      display: grid;
      height: 100%;
      grid-template-columns: 45% 55%;
      grid-template-rows: (100% / 7) (100% / 7 * 6);
      background-color: #3c3c3c;
      border-color: rgb(15, 92, 81);
    }
  }
</style>
