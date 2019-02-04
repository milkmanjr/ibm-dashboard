<template>
  <div class="video-list">
    <div class="highlight-video" :ref='`video-list__v-${index}`' v-for="(video, index) in videos" :key="index" @click="pickVideo(index)" :class="{ 'is-now-playing' : index == nowPlaying }">
      <h2 class="overallExcitement theme--main-color--as-color">{{ noZero(video.overallExcitement) }}%</h2>
      <div class="title_players">
        <h3 class="title">{{ video.title }}</h3>
        <p class="players">{{ video.players }}</p>
      </div>
      <div class="thumbnail" :style="{ backgroundImage: 'url(' + video.thumbnail + ')' }"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['videos', 'nowPlaying'],
    watch: {
      nowPlaying (val) {
        this.$refs[`video-list__v-${val}`][0].scrollIntoView(false)
      }
    },
    methods: {
      pickVideo (index) {
        this.$emit('pickVideo', index)
      },
      noZero (value) {
        return Math.round(value.toString().slice(1) * 100)
      }
    }
  }
</script>

<style lang="scss">
  .video-list {
    overflow-y: scroll;
    padding-right: 1em;
    margin-right: 1em;
    border-left: 0.1em solid rgba(255,255,255,0.05);

    &::-webkit-scrollbar {
      // display: none;
      background: transparent;
      width: 0.25rem;
    }

    &::-webkit-scrollbar-track {
      // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    &::-webkit-scrollbar-thumb {
      background-color: $theme--cognitive-highlights--main-color;
    }

    .highlight-video {
      display: flex;
      align-items: center;
      height: 16.7%;
      border-bottom: 0.1em solid rgba(255,255,255,0.05);
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &.is-now-playing {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .overallExcitement {
        width: 30%;
        text-align: center;
        font-size: 2.5em;
        font-family: $font--mono--light;
        font-weight: normal;
      }

      .title_players {
        width: 40%;
        font-size: 0.7rem;
        line-height: 0.9rem;
      }

      .title {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        padding-bottom: 0.2rem;
      }

      .players {
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.5);
        font-family: $font__sans__thin;
      }

      .thumbnail {
        width: 30%;
        flex-grow: 2;
        height: 100%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        margin-left: 2em;
      }
    }
  }
</style>
