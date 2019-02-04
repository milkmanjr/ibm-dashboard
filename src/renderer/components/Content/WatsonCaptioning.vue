<template>
  <div class="watson-captioning">
    <section-header text="Watson Subtitling" index="04"></section-header>

    <section>
      <caption-stats></caption-stats>
      <captioned-video v-if="readyToPlay" :videoLink="videoLink"></captioned-video>
      <graded-captions v-if="readyToPlay" :vtt="vtt"></graded-captions>
    </section>

    <right-sidebar :fade="fade" :quote="quote" :points="points"></right-sidebar>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data () {
      return {
        bigQuote: 'Getting more<br/>value from content',
        fade: true,
        videoIndex: 0, // todo: latest video (by date)?
        videoLink: null,
        vtt: null, // raw captions
        readyToPlay: false,
        points: [
          {
            value: 'Transcription and analysis',
            label: 'of customer service call recordings'
          }, {
            value: 'Content management',
            label: 'for media companies and<br/> marketing departments'
          }, {
            value: 'Capture and analysis',
            label: 'of public speeches and<br/> educational lectures'
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
      'caption-stats': require('@/components/Content/WatsonCaptioning/CaptionStats'),
      'captioned-video': require('@/components/Content/WatsonCaptioning/CaptionedVideo'),
      'graded-captions': require('@/components/Content/WatsonCaptioning/GradedCaptions')
    },
    created () {

    },
    mounted () {
      setTimeout(() => {
        this.fade = true
        this.loadVideo()
      }, this.fadeTimeout)
    },
    methods: {
      loadVideo () {
        Vue.http('https://www.usopen.org/demos/events-demos/data/video_demo_feed.json').then((response) => {
          let videoInfo = response.data.content[this.videoIndex]
          this.videoLink = videoInfo.mlink // high quality video

          // get the vtt
          Vue.http(videoInfo.tracks[0].file).then((response) => {
            this.vtt = response.data

            // bug: getting the captions != video has been loaded and ready to play
            this.readyToPlay = true
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .watson-captioning {
    section {
      display: grid;
      height: 100%;
      grid-template-columns: 45% 55%;
      grid-template-rows: (100% / 7) (100% / 7 * 6);
    }
  }
</style>
