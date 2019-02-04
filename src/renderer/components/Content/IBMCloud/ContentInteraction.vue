<template>
  <div class="content-interaction">
    <subsection-header text="Content Interaction"></subsection-header>

    <div class="views">
      <labeled-value class="labeled-value" label="Total" :value="views.total"></labeled-value>
      <labeled-value class="labeled-value" label="Mobile" :value="views.mobile"></labeled-value>
      <labeled-value class="labeled-value" label="Desktop" :value="views.desktop"></labeled-value>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import CloudDashboard from '@/bits/Cloud'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        views: {
          total: 0,
          mobile: 0,
          desktop: 0
        }
      }
    },
    components: {
      'subsection-header': require('@/bits/SubsectionHeader'),
      'labeled-value': require('@/bits/LabeledValue')
    },
    mounted () {
      this.refresh()
      CloudDashboard.init()
      Event.$on(EventNames.CLOUD_COUNT_WEB, this.updateValues)
      Event.$on(EventNames.CLOUD_COUNT_MOBILE, this.updateValues)
      Event.$on(EventNames.CLOUD_COUNT_DESKTOP, this.updateValues)
    },
    destroyed () {
      CloudDashboard.teardown()
      Event.$off(EventNames.CLOUD_COUNT_WEB, this.updateValues)
      Event.$off(EventNames.CLOUD_COUNT_MOBILE, this.updateValues)
      Event.$off(EventNames.CLOUD_COUNT_DESKTOP, this.updateValues)
    },
    methods: {
      refresh () {
        let intcomma = Vue.filter('intcomma')

        Vue.http('https://www.usopen.org/demos/cloud/metrics.json').then((response) => {
          this.views.total = intcomma(parseInt(response.data.total))
          this.views.mobile = intcomma(parseInt(response.data.mobile))
          this.views.desktop = intcomma(parseInt(response.data.total) - parseInt(response.data.mobile))
        })
      },
      updateValues (e) {
        switch (e.type) {
          case EventNames.CLOUD_COUNT_WEB:
            this.views.total = e.value
            break

          case EventNames.CLOUD_COUNT_MOBILE:
            this.views.mobile = e.value
            break

          case EventNames.CLOUD_COUNT_DESKTOP:
            this.views.desktop = e.value
            break
        }
      }
    }
  }
</script>

<style lang="scss">
  .content-interaction {
    border-bottom: 4px solid $theme--global--border-color;
    padding: 0;

    .subsection-header {
      padding: 1em 2em;
      border-bottom: 4px solid $theme--global--border-color;
      height: 3em;
    }

    .views {
      padding: 0 2em;

      .labeled-value {
        margin-bottom: 1.5em;
      }
    }
  }
</style>
