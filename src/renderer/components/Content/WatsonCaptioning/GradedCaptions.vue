<template>
  <div class="graded-captions">
    <div class="captions">
      <a-caption v-for="(c, index) in visibleCaptions" :key="index" :grade="c.grade" :text="c.text"></a-caption>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import _ from 'underscore'

  export default {
    data () {
      return {
        captions: [],
        visibleCaptions: []
      }
    },
    props: ['vtt'],
    components: {
      'a-caption': require('@/components/Content/WatsonCaptioning/GradedCaptions/Caption')
    },
    created () {
      this.parseCaptions()
    },
    methods: {
      parseCaptions () {
        let vtt = this.vtt // from props
        let timestampToMs = Vue.filter('timestamp-to-ms')

        // split into lines (sans whitespaces and first line)
        vtt = _.compact(vtt.split('\n'))
        vtt.splice(0, 1)

        // ready to transform this array into actual captions
        for (let i = 0; i < vtt.length; i++) {
          let grade = vtt[i].split(', ')[1]

          this.captions.unshift({
            grade: grade === '%' ? false : grade, // X%
            timeIn: timestampToMs(vtt[i + 1].split(' --> ')[0]), // the first timestamp (in ms)
            text: vtt[i + 2].endsWith('%') ? ' ' : vtt[i + 2]
          })

          // bug ISD-79 : avoid malformed vtt where the transcript line is missing
          if (vtt[i + 2].endsWith('%')) {
            i -= 1
          }

          // move index up twice since it "read" two additional lines for the caption
          // and it will get bumped up again in the next iteration of this for loop
          i += 2
        }

        // Start pushing captions to frontend
        this.play()
      },
      play () {
        for (let i = 0; i < this.captions.length; i++) {
          // note: this is a closure
          setTimeout(() => {
            this.visibleCaptions.unshift(this.captions.pop())
          }, this.captions[i].timeIn)
        }
      }
    }
  }
</script>

<style lang="scss">
  .graded-captions {
    padding: 2em 3em;

    .captions {
      height: 100%;
      border-top: 3px solid rgba(0, 0, 0, 0.4);
      border-bottom: 3px solid rgba(0, 0, 0, 0.4);
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
