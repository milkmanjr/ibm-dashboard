<template>
  <div class="cyber-security">
    <section-header subtext="IBM Cloud: Secure to the core" text="Watson for Cyber Security" index="06"></section-header>

    <section>
      <div class="section__sidebar">
        <attack-event-stats></attack-event-stats>
        <attack-types></attack-types>
      </div>
      <div class="section__main">
        <top-sources></top-sources>
        <global-map-animated></global-map-animated>
      </div>
    </section>

    <right-sidebar :quote="quote" :fade="fade" :points="points"></right-sidebar>
    <refresher :interval="6000" :refreshType="refreshType" />
  </div>
</template>

<script>
  import {EventNames} from '@/bits/Events'
  export default {
    data () {
      return {
        fade: true,
        refreshType: EventNames.REFRESH_MAP,
        points: [
          {
            value: '35',
            unit: 'billion',
            label: 'security events managed by IBM security everyday'
          }, {
            value: '12,000',
            label: 'IBM security clients in more than 130 countries'
          }, {
            value: '60X',
            label: 'increase in speed with which security analyst can respond to threats using Watson'
          }
        ],
        quote: {
          text: 'The IBM Cloud allows us to very quickly pivot from a relatively small audience to having the world\'s eyes looking at us and using our digital products.',
          speaker: 'Paul Maya',
          position: 'Chief Technology Officer',
          headshot: 'static/speakers/paul_maya.png'
        }
      }
    },
    mounted () {
    },
    components: {
      'refresher': require('@/bits/Refresher'),
      'section-header': require('@/bits/SectionHeader'),
      'right-sidebar': require('@/bits/RightSidebar'),
      'attack-event-stats': require('@/components/Content/CyberSecurity/AttackEventStats'),
      'attack-types': require('@/components/Content/CyberSecurity/AttackTypes'),
      'top-sources': require('@/components/Content/CyberSecurity/TopSources'),
      'global-map-animated': require('@/components/Content/CyberSecurity/GlobalMapAnimated')
    }
  }
</script>

<style lang="scss">
  .cyber-security {
    section {
      display: grid;
      height: 100%;
      grid-template-columns: 20% 80%;

      .section__sidebar {
        display: grid;
        grid-template-rows: 43% 57%; // todo: grid-template-rows: (100% / 7) (100% / 7 * 6);
        background-color: rgba(0, 0, 0, 0.4);
        border-right: 4px solid rgba(255,255,255,0.05);
      }

      .section__main {
        display: grid;
        grid-template-rows: (100% / 7) (100% / 7 * 6);
        background-color: rgba(0, 0, 0, 0.2);
      }

      .top-sources .subsection-header,
      .top-sources .countries .labeled-value {
        border-color: rgba(255,255,255,0.05);
      }
    }
  }
</style>
