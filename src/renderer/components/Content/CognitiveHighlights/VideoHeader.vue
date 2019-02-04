<template>
  <div class="video-header">
    <subsection-header text="All Matches"></subsection-header>
    <labeled-value class="labeled-value" :label="nowPlayingVideo.players" :value="nowPlayingVideo.title"></labeled-value>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['nowPlayingVideo'],
    components: {
      'subsection-header': require('@/bits/SubsectionHeader'),
      'labeled-value': require('@/bits/LabeledValue')
    }
  }
</script>

<style lang="scss">
  .video-header {
    padding: 1em 0;
    grid-column-start: 1;
    grid-column-end: 3;
    background-color: rgba(0, 0, 0, 0.25);
    border-bottom: 4px solid rgba(255,255,255,0.05);

    .labeled-value {
      border-top: 4px solid rgba(255,255,255,0.05);
    }

    .labeled-value,
    .subsection-header {
      padding-left: 2em;
      padding-right: 2em;
    }


  }
</style>
