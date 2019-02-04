<template>
  <div class="caption-stats">
    <subsection-header text="Videos"></subsection-header>
    <div class="stats">
      <labeled-value class="labeled-value" label="Analysed" :value="stats.analyzed"></labeled-value>
      <labeled-value class="labeled-value" label="Words Processed" :value="stats.wordsProcessed"></labeled-value>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data () {
      return {
        stats: {
          analyzed: 0,
          wordsProcessed: 0
        }
      }
    },
    components: {
      'subsection-header': require('@/bits/SubsectionHeader'),
      'labeled-value': require('@/bits/LabeledValue')
    },
    created () {
      this.refresh()

      // todo
      // setInterval(this.refresh, 1000)
    },
    methods: {
      refresh () {
        Vue.http('https://2017.usopen.org/demos/events-demos/data/spech_to_text_stats.json').then((response) => {
          let intcomma = Vue.filter('intcomma')
          this.stats.analyzed = intcomma(response.data.count)
          this.stats.wordsProcessed = intcomma(response.data.words)
        })
      }
    }
  }
</script>

<style lang="scss">
  .caption-stats {
    padding: 0;
    grid-column-start: 1;
    grid-column-end: 3;
    background-color: rgba(0, 0, 0, 0.15);
    border-bottom: 4px solid $theme--watson-captioning--border-color;
    display: flex;
    flex-wrap: wrap;
    // border-bottom: 4px solid $theme--global--border-color;

    .subsection-header {
      padding: 0 2em;
      width: 100%;
      padding-top: .5em;
    }

    .stats {
      display: flex;
      width: 100%;
      border-top: 4px solid $theme--watson-captioning--border-color;

      .labeled-value {
        padding: 0 2em;
        border-right: 4px solid $theme--watson-captioning--border-color;
      }
    }
  }
</style>
