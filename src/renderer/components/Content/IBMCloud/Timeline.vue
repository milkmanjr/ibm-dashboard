<template>
  <div class="timeline">
    <div class="timeline__inner">
      <div class="timeline__text__static date">
        <span>|</span>
        <a href="javascript:void(0);" @click="reset()">Jan 7</a>
      </div>


      <div class="timeline__text__static us-open">
         <span>|</span>
        <span>&nbsp;</span>
      </div>

      <div class="timeline__text__static">
         <span>|</span>
        <span>&nbsp;</span>
      </div>

      <div class="timeline__text__static span-text">
        <span>&nbsp;</span>
        <span>US Open</span>
      </div>

      <div class="timeline__progress">
        <div class="timeline__text">
          <div class="arrow-up"></div>
          <span>{{ views.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {TweenMax} from 'gsap/TweenMax'
  import $ from 'jquery'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        views: 0
      }
    },
    created () {

    },
    methods: {
      toTheEnd (data) {
        // TweenMax.to($('.timeline__progress'), 2, {width: '100%'})
      },
      updateViews (data) {
        this.views = data.value
      },
      playAnimation () {
        TweenMax.to($('.timeline__progress'), 0, {width: '0%'})
        TweenMax.to($('.timeline__progress'), 10, {width: '100%'})
      },
      reset () {
        Event.$emit(EventNames.RESET_TIMELINE, {})
        this.playAnimation()
      }
    },
    mounted () {
      this.playAnimation()
      Event.$on(EventNames.GOT_EVENT_DATA, this.toTheEnd)
      Event.$on(EventNames.PLATFORM_VIEWS_TODAY, this.updateViews)
    },
    destroyed () {
      Event.$off(EventNames.GOT_EVENT_DATA, this.toTheEnd)
      Event.$off(EventNames.PLATFORM_VIEWS_TODAY, this.updateViews)
    }
  }
</script>
<style lang="scss">
  .timeline {
    background: #a6f9e7;
    width: 50%;
    height: 1vh;
  }

  .timeline__inner {
    position: relative;
  }

  .timeline__progress {
    height: 1vh;
    width: 15%;
    background: #09b4a0;
    box-shadow: inset -2px 0 0 0 black;
    position: relative;

    span {
      position: relative;
      top: -7vh;
      font-size: .7em;
      font-family: $font--sans--thin;
    }
  }

  .timeline__text {
    position: absolute;
    top: -20px;
    right: -7.5vw;
    text-align: center;
    width: 15vw;
  }

  .timeline__text__static {
    position: absolute;
    left: 75%;
    margin-left: -7.5vw;
    width: 15vw;
    top: 2vh;

    &.us-open {
      right: -7.5vw;
      left: auto;
    }

    &.date {
      left: -7.5vw;
      margin: 0;
      text-align: center;

      a {
        color: #fff;
        text-decoration: none;
      }

    }

    &.span-text {
      right: 0;
      left: auto;
      width: 8vw;
    }

    span {
      display: block;
      text-align: center;
    }
  }

  .arrow-up {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #09b4a0;
    margin: 0 auto 4vh;
  }
</style>
