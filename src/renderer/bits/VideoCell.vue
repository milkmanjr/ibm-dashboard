<template>
  <router-link tag="div" :to="href" class="video-cell">
    <span>{{ title }}</span>
    <div class="video-cell__inner">
      <video loop autoplay :src="src" v-if="src" />
    </div>
  </router-link>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: ['src', 'title', 'href']
  }
</script>

<style lang="scss" scoped>
  .video-cell {
    cursor: pointer;
    width: 33.33%;
    height: 50%;
    background: $theme--home--cell-color;
    border: 1px solid $theme--global--border-color;
    padding: 25px 40px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;

    span {
      display: block;
      font-size: .75rem;
      height: 10%;
      border-bottom: 2px solid $theme--global--border-color;
      width: 100%;
    }
  }

  .video-cell__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    width: 100%;

    video {
      height: 60%;
      width: 100%;
    }
  }
</style>
