<template>
  <div class="menu">
    <div class="menu__logo">
      <img src="~@/assets/images/cloud-logo.png" />
    </div>
    <ul class="menu__items">
      <router-link tag="li" to="/home" class="router__home">
        <div>
          <span>Home</span>
        </div>
      </router-link>

      <router-link tag="li" to="/ibm-cloud" class="router__ibm-cloud">
        <div :class="{'active-video': activeTab == 'ibm-cloud'}">
          <span>IBM Cloud</span>
        </div>
        <plus-icon @playing="setActive('ibm-cloud')" video="18.08_4k_cloud.mp4" />
      </router-link>

      <router-link tag="li" to="/slam-tracker" class="router__slam-tracker">
        <div :class="{'active-video': activeTab == 'slam-tracker'}">
          <span>IBM SlamTracker<br><small>Built for all applications</small></span>
        </div>
        <plus-icon @playing="setActive('slam-tracker')" video="18.08_4K_Slam_tracker.mp4" />
      </router-link>

      <router-link tag="li" to="/cognitive-highlights" class="router__cognitive-highlights">
        <div :class="{'active-video': activeTab == 'cognitive-highlights'}">
          <span>AI Highlights<br><small>AI ready</small></span>
        </div>
        <plus-icon @playing="setActive('cognitive-highlights')" video="18.08_4K_Cognitive_highlights.mp4" />
      </router-link>

      <router-link tag="li" to="/cognitive-concierge" class="router__cognitive-concierge">
        <div :class="{'active-video': activeTab == 'cognitive-concierge'}">
          <span>Watson Assistant<br> <small>AI ready</small></span>
        </div>
        <plus-icon @playing="setActive('cognitive-concierge')" video="18.08_4K_Cognitive_concierge.mp4" />
      </router-link>

      <!-- <router-link tag="li" to="/watson-captioning" class="router__watson-captioning">
        <div :class="{'active-video': activeTab == 'watson-captioning'}">
          <span>Watson<br> Subtitling</span>
        </div>
        <plus-icon @playing="setActive('watson-captioning')" video="18.08_4K_Subttransc.mp4" />
      </router-link> -->

      <router-link tag="li" to="/cyber-security" class="router__cyber-security">
        <div :class="{'active-video': activeTab == 'cyber-security'}">
          <span>Watson for Cyber Security<br><small>Secure to the core</small></span>
        </div>
        <plus-icon @playing="setActive('cyber-security')" video="18.08_4K_Digital.mp4" />
       </router-link>

    </ul>
  </div>
</template>

<script>
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        activeTab: ''
      }
    },
    created () {
      Event.$on(EventNames.STOPPED, this.resetActive)
    },
    destroyed () {
      Event.$off(EventNames.STOPPED, this.resetActive)
    },
    components: {
      'plus-icon': require('@/bits/PlusIcon')
    },
    methods: {
      resetActive () {
        this.activeTab = ''
      },
      setActive (tab) {
        this.activeTab = tab
      }
    }
  }
</script>

<style lang="scss">
  .menu {
    display: grid;
    grid-template-rows: 20% 80%;

    .menu__logo {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-top: 4vh;
      padding-left: 30%;

      img {
        width: 20%;
      }
    }

    ul {
      grid-row-start: 2;
      grid-row-end: 3;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      li {
        flex: 1;
        border: 2px solid $theme--global--border-color;
        display: flex;
        justify-content: center;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.2);
        position: relative;

        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        &:first-child {
          border-top-width: 4px;
        }

        &.router-link-active {
          color: white;
          background-color: transparent;
        }

        &.router__home i { -webkit-mask-image: url('~@/assets/icons/home.svg'); }
        &.router__ibm-cloud i { -webkit-mask-image: url('~@/assets/icons/ibm-cloud.svg'); }
        &.router__cyber-security i { -webkit-mask-image: url('~@/assets/icons/cyber-security.svg'); }
        &.router__watson-captioning i { -webkit-mask-image: url('~@/assets/icons/watson-captioning.svg'); }
        &.router__cognitive-highlights i { -webkit-mask-image: url('~@/assets/icons/cognitive-highlights.svg'); }
        &.router__slam-tracker i { -webkit-mask-image: url('~@/assets/icons/slam-tracker.svg'); }
        &.router__cognitive-concierge i { -webkit-mask-image: url('~@/assets/icons/cognitive-concierge.svg'); }

        // icons - negate the theme color for inactive links
        &:not(.router-link-active) i {
          background-color: rgba(255, 255, 255, 0.15) !important;
        }

        &.router__ibm-cloud.router-link-active {
          div:before {
            color: $theme--ibm-cloud--main-color;
          }
        }

        &.router__slam-tracker.router-link-active {
          div:before {
            color: $theme--slam-tracker--main-color;
          }
        }

        &.router__cognitive-highlights.router-link-active {
          div:before {
            color: $theme--cognitive-highlights--main-color;
          }
        }

        &.router__cognitive-concierge.router-link-active {
          div:before {
            color: $theme--cognitive-concierge--main-color;
          }
        }

        &.router__cyber-security.router-link-active {
          div:before {
            color: $theme--cyber-security--main-color;
          }
        }

        div {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
          left: 30%;

          &:before {
            content: "+";
            display: block;
            color: rgba(0, 0, 0, 0.35);
            position: absolute;
            top: 50%;
            left: -20%;
            transform: translateY(-50%);
            font-size: 2em;
            font-family: $font--mono--bold;
          }

          &.active-video:before {
            color: rgba(255, 255, 255, 0.35);
            text-shadow: 0 0 30px rgba(0,0,0,0.25)
          }

          i {
            display: inline-block;
            width: 3em;
            height: 3em;
            -webkit-mask-size: contain;
            -webkit-mask-position: center center;
            -webkit-mask-repeat: no-repeat;
            margin: 0 1.2em 0 0;
          }

          span {
            font-family: $font--sans--thin;
            font-size: 0.9em;
            line-height: 1.2em;

            small {
              font-size: 0.7em;
            }
          }
        }
      }
    }
  }
</style>
