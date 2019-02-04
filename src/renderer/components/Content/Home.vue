<template>
  <div class="home">
    <section-header text="Home" index="01"></section-header>

    <section>
      <div class="home__text">
        <img :src="require('@/assets/images/introText.png')"><!-- temp -->
      </div>
      <div class="home__video">
        <video loop autoplay src="static/videos/Madison.mp4" />
      </div>
    </section>

    <right-sidebar :quote="quote"></right-sidebar>
  </div>
</template>

<script>
  let SectionHeader = require('@/bits/SectionHeader')

  export default {
    data () {
      return {
        quote: {}
      }
    },
    components: {
      'section-header': SectionHeader,
      'right-sidebar': require('@/bits/RightSidebar')
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    .home__text {
      background: #000;
    }

    section {
      background: #000;
      display: grid;
      grid-template-columns: 25% 75%;

      img {
        position: absolute;
        width: 30%;
      }

      video {
        background-color: transparent;
        width: 100%;
        object-fit: contain;
      }
    }

    .banner {
      width: 100%;
    }
  }

  .home__video {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
    overflow: hidden;
    text-align: right;

    video {
      width: auto;
    }
  }
</style>
