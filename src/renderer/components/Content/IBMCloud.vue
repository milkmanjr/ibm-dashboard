<template>
  <div class="ibm-cloud">
    <section-header text="IBM Cloud" index="02"></section-header>
    <section>

      <div class="section__main">
        <div class="section__main__inner">
        <div class="panel">

          <h4>Private Cloud</h4>
          <span>&mdash;</span>

          <h5>Infrastructure services</h5>
          <table>
            <tr>
              <td>Boulder</td>
              <td class="number">30%</td>
            </tr>
            <tr>
              <td>Raleigh</td>
              <td class="number">31%</td>
            </tr>
            <tr>
              <td>Portsmouth</td>
              <td class="number">39%</td>
            </tr>
          </table>
          <span>&mdash;</span>
          <pviews />
        </div>
        <div class="panel">
          <public-cloud />
        </div>
        <div class="section__video__holder"><video src="static/videos/GlobeLoop.mp4" class="section__video" autoplay loop></video></div>
      </div>
      <div class="section__main__timeline">
        <timeline />
      </div>

      </div>
      <div class="section__sub-content">
        <ul>
          <li>
            <h2>Built for all applications</h2>
            <p>Migrate, modernize and build innovation and connected apps.</p>
          </li>
          <li>
            <h2>AI ready</h2>
            <p>Unlock the value of your data and accelerate your journey to AI.</p>
          </li>
          <li>
            <h2>Secure to the core</h2>
            <p>Move to the cloud with confidence, continuous security and data protection.</p>
          </li>
        </ul>
      </div>
    </section>
    <aside class="right-sidebar">

      <div class="donutWrapper">
        <h3 class="number">47/50</h3>
        <donut :chart-data="getSharedDonutProps([47, 100-94])" />
      </div>
      <p class="donutTextWrapper">
        Fortune 50<br/>
         companies
      </p>

      <div class="donutWrapper">
        <h3 class="number">10/10</h3>
        <donut :chart-data="getSharedDonutProps([100, 100-100])" />
      </div>
      <p class="donutTextWrapper">
        Largest<br/>
        global banks
      </p>

      <div class="donutWrapper">
        <h3 class="number" >9/10</h3>
        <donut :chart-data="getSharedDonutProps([90, 100-90])" />
      </div>
      <p class="donutTextWrapper">
        Leading<br/>
        retailers
      </p>

      <div class="donutWrapper">
        <h3 class="number">8/10</h3>
        <donut :chart-data="getSharedDonutProps([80, 100-80])" />
      </div>
      <p class="donutTextWrapper">
        Most-travelled<br/>
        airlines
      </p>

    </aside>
    <refresher :interval="60000" :refreshType="refreshType" />
  </div>
</template>

<script>
  import {EventNames} from '@/bits/Events'
  import Donut from '@/bits/Donut'

  export default {
    data () {
      return {
        cities: [],
        bigQuote: 'Embracing a scalable<br/>and cognitive cloud',
        fadeTimeout: 4000,
        fade: false,
        refreshType: EventNames.REFRESH_MAP,
        points: [
          {
            value: 'By 2018, 80% of all IT budgets',
            label: 'will be committed to cloud-based solutions'
          }, {
            value: '1,000% increase in end users;',
            label: '5,000% increase in page views<br/>during the US Open'
          }, {
            value: 'IBM Cloud includes Watson',
            label: 'and is designed for continuous operation'
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
      setTimeout(() => {
        this.fade = true
      }, this.fadeTimeout)
    },
    components: {
      'big-quote': require('@/bits/BigQuote'),
      'refresher': require('@/bits/Refresher'),
      'section-header': require('@/bits/SectionHeader'),
      'right-sidebar': require('@/bits/RightSidebar'),
      'content-interaction': require('./IBMCloud/ContentInteraction'),
      'ranked-cities': require('./IBMCloud/RankedCities'),
      'top-sources': require('./IBMCloud/TopSources'),
      'global-map': require('./IBMCloud/GlobalMap'),
      'timeline': require('./IBMCloud/Timeline'),
      'pviews': require('./IBMCloud/Counter'),
      'public-cloud': require('./IBMCloud/PublicCloud'),
      'donut': Donut
    },
    methods: {
      onCitiesUpdate (e) {
        this.cities = e.cities
      },
      getSharedDonutProps (value) {
        return {
          datasets: [
            {
              backgroundColor: ['#09B4A0', 'rgba(255, 255, 255, 0.15)'],
              borderWidth: 0,
              data: value
            }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
  .ibm-cloud {
    .right-sidebar {
      background: #3c3c3c;
      justify-content: space-between;
      align-items: center;
      display: flex;
      flex-direction: column;
      padding: 1.5em 0;
    }

    .number {
      font-family: "IBM Plex Mono Light";
    }

    .panel {
      display: inline-block;

      table {
        width: 100%;
        color: $theme--ibm-cloud--main-color;
        font-size: .8rem;

        td {
          padding: .5em;
        }
      }

      h5 {
        color: $theme--ibm-cloud--main-color;
      }

      span {
        margin: 1em 0;
        display: block;
      }
    }

    .donutWrapper {
      position: relative;
      margin: 10px auto;
      width: 5vw;
      text-align: center;

      #doughnut-chart {
        width: 5vw;
      }

      h3 {
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        width: 100%;
        height: 4vh;
        line-height: 5vh;
        color: $theme--ibm-cloud--main-color;
        font-size: 1.012rem;
      }

      canvas {
        position: relative;
        top: -9%;
      }

      h4 {
        text-align: center;
        width: 3em;
        font-family: $font__sans__thin;
        font-size: 0.5em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .donutTextWrapper {
      text-align: center;
      color: rgba(255,255,255, 0.25);
    }

    section {
      display: grid;
      height: 100%;
      grid-template-rows: 82.5% 17.5%;
      background: #3c3c3c;

      .section__sidebar {
        display: grid;
        grid-template-rows: 43% 57%; // todo grid-template-rows: (100% / 7) (100% / 7 * 6);
        background-color: rgba(0, 0, 0, 0.4);
        border-right: 4px solid $theme--ibm-cloud--border-color;
      }

      .section__main {
        display: grid;
        grid-template-rows: 80% 20%;
        background: #000;
        padding: 2em;
        z-index: 1;
        position: relative;
      }

      .section__video__holder {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        text-align: right;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
      }

      .section__video {
        height: 100%;
        margin-right: -50px;
      }

      .section__main__inner {
        display: grid;
        grid-template-columns: 33% 33% 33%;
      }

      .section__sub-content {

        ul {
          display: flex;
          height: 100%;

          li:first-child {
            border-left: 0;
          }

          li:last-child {
            border-right: 0;
          }
        }

        li {
          display: flex;
          flex-direction: column;
          list-style: none;
          justify-content: center;
          padding: 0 2em;
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-width: 3px 2px 0;

          h2 {
            font-size: 1rem;
          }

          p {
            font-size: .8rem;
          }
        }

        p {
          color: #7be7d1;
        }
      }

      .top-sources .subsection-header,
      .top-sources .countries .labeled-value {
        border-color: $theme--ibm-cloud--border-color;
      }
    }
  }
</style>
