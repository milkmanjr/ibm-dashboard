<template>
  <div class="top-sources">
    <subsection-header text="Top sources"></subsection-header>

    <div class="countries">
      <labeled-value v-for="(country, index) in countries"
                     :key="index"
                     :label="ordinal(index+1)"
                     :value="country"></labeled-value>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Humanize from 'humanize-plus'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        countries: []
      }
    },
    components: {
      'subsection-header': require('@/bits/SubsectionHeader'),
      'labeled-value': require('@/bits/LabeledValue')
    },
    created () {
      this.refresh()
      Event.$on(EventNames.REFRESH_MAP, this.refresh)
    },
    destroyed () {
      Event.$off(EventNames.REFRESH_MAP, this.refresh)
    },
    methods: {
      ordinal (number) {
        return Humanize.ordinal(number)
      },
      refresh () {
        Vue.http('https://www.usopen.org/demos/securitydashboard/security_visual.json').then((response) => {
          this.countries = response.data.sources.splice(0, 6)

          // note: there's some weirdness going on with array.map() and array.forEach() in this block
          // map is modifying the array (which was parsed as an object from the JSON feed)
        })
      }
    }
  }
</script>

<style lang="scss">
  .top-sources {
    background-color: rgba(0, 0, 0, 0.15);
    padding: 0;
    display: flex;
    flex: 1;
    flex-direction: column;

    .subsection-header {
      width: 100%;
      padding: 1em 2em 0;
      border-bottom: 4px solid #ddd;
      margin: 0;
      height: 3em;
    }

    .countries {
      width: 100%;
      display: flex;
      flex: 1;

      .labeled-value {
        width: 16.6%;
        padding: 0 2em;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        border-right: 4px solid #ddd;

        &:nth-of-type(6) {
          border: none;
        }
      }
    }
  }
</style>
