<template>
  <div class="attack-types">
    <subsection-header text="Types"></subsection-header>

    <ul class="types theme--sub-color--as-color">
      <li :class="`level-${index}`" v-for="(at, index) in attackTypes">{{ index + 1 }}) {{ convertDashes(at.text) }}</li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        attackTypes: []
      }
    },
    components: {
      'subsection-header': require('@/bits/SubsectionHeader')
    },
    created () {
      this.refresh()
      Event.$on(EventNames.REFRESH_MAP, this.refresh)
    },
    destroyed () {
      Event.$off(EventNames.REFRESH_MAP, this.refresh)
    },
    methods: {
      convertDashes (text) {
        return text.replace(/_/g, ' ')
      },
      refresh () {
        Vue.http('https://www.usopen.org/demos/securitydashboard/security_visual.json').then((response) => {
          this.attackTypes = response.data.tags.splice(0, 4)
        })
      }
    }
  }
</script>

<style lang="scss">
  .attack-types {
    padding: 1em 2em;
    overflow: hidden;

    ul.types {
      margin: 0;
      padding: 0;
      font-size: 0.5rem;
      list-style-type: none;

      li {
        margin-bottom: 0.5rem;
        white-space: nowrap;

        &.level-1 { color: #ad508e; }
        &.level-2 { color: #987cb4; }
        &.level-3 { color: #d6c1e5; }
      }
    }
  }
</style>
