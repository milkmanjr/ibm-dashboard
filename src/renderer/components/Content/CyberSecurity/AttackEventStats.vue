<template>
  <div class="attack-event-stats">
    <subsection-header text="Content interaction"></subsection-header>

    <div class="views">
      <labeled-value class="labeled-value" label="Attacks" :value="stats.attacks"></labeled-value>
      <labeled-value class="labeled-value" label="Events" :value="stats.events"></labeled-value>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        stats: {
          events: 0,
          attacks: 0
        }
      }
    },
    components: {
      'subsection-header': require('@/bits/SubsectionHeader'),
      'labeled-value': require('@/bits/LabeledValue')
    },
    mounted () {
      this.refresh()
      Event.$on(EventNames.ATTACK_COUNT, this.updateValues)
      Event.$on(EventNames.ATTACK_EVENT_COUNT, this.updateValues)
    },
    destroyed () {
      Event.$off(EventNames.ATTACK_COUNT, this.updateValues)
      Event.$off(EventNames.ATTACK_EVENT_COUNT, this.updateValues)
    },
    methods: {
      refresh () {
        let intcomma = Vue.filter('intcomma')

        Vue.http('https://www.usopen.org/demos/securitydashboard/security_visual.json').then((response) => {
          this.stats.events = intcomma(parseInt(response.data.counter.events))
          this.stats.attacks = intcomma(parseInt(response.data.counter.attacks))
        })
      },
      updateValues (e) {
        if (e.type === EventNames.ATTACK_COUNT) {
          this.stats.attacks = e.value
        } else {
          this.stats.events = e.value
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .attack-event-stats {
    border-bottom: 4px solid rgba(255,255,255,0.05);
    padding: 0;

    .subsection-header {
      padding: 1em 2em;
      border-bottom: 4px solid rgba(255,255,255,0.05);
      height: 3em;
    }

    .views {
      padding: 0 2em;

      .labeled-value {
        margin-bottom: 1.5em;
        font-family: $font--mono--light;
      }
    }
  }
</style>
