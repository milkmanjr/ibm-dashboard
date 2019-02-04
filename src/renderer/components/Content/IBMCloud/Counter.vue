<template>
  <div>
    <h5>Platform views</h5>
    <table>
      <tr v-if="reveal" class="animated fadeIn">
        <td>Today</td>
        <td class="number" v-if="apiToday">{{ apiToday.toLocaleString() }}</td>
      </tr>
      <tr v-if="reveal" class="animated fadeIn">
        <td>Event to Date</td>
        <td class="number">
          <span v-if="eventToDate">{{ eventToDate.toLocaleString() }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  // import {TweenMax} from 'gsap/TweenMax'
  // import $ from 'jquery'
  import {Event, EventNames} from '@/bits/Events'
  import Vue from 'vue'

  export default {
    data () {
      return {
        counted: false,
        appliedToday: false,
        reveal: false,
        platformViewsToday: 0,
        platformViewsEventToDate: 0,
        eventToDateIntervalcurrentStep: 0,
        platformViewsPos: 0,
        apiToday: 0,
        eventToDate: 0,
        eventToDateInterval: 0,
        revealTimeout: 0,
        secondsPerStep: 150,
        platformFixedIntervalcurrentStep: 0,
        platformViews: [
          {d: '7-Jan-18', v: 130110},
          {d: '14-Jan-18', v: 266576},
          {d: '21-Jan-18', v: 291179},
          {d: '28-Jan-18', v: 231840},
          {d: '4-Feb-18', v: 118888},
          {d: '11-Feb-18', v: 127419},
          {d: '18-Feb-18', v: 121195},
          {d: '25-Feb-18', v: 118417},
          {d: '4-Mar-18', v: 132063},
          {d: '11-Mar-18', v: 155312},
          {d: '18-Mar-18', v: 196395},
          {d: '25-Mar-18', v: 103641},
          {d: '1-Apr-18', v: 118635},
          {d: '8-Apr-18', v: 109082},
          {d: '15-Apr-18', v: 107520},
          {d: '22-Apr-18', v: 181752},
          {d: '29-Apr-18', v: 124711},
          {d: '6-May-18', v: 185517},
          {d: '13-May-18', v: 183210},
          {d: '20-May-18', v: 181886},
          {d: '27-May-18', v: 230308},
          {d: '3-Jun-18', v: 501375},
          {d: '10-Jun-18', v: 865182},
          {d: '17-Jun-18', v: 351417},
          {d: '24-Jun-18', v: 292937},
          {d: '1-Jul-18', v: 325690},
          {d: '8-Jul-18', v: 477295},
          {d: '15-Jul-18', v: 623284},
          {d: '22-Jul-18', v: 499511},
          {d: '29-Jul-18', v: 628270},
          {d: '5-Aug-18', v: 237831},
          {d: '12-Aug-18', v: 141916}
        ]
      }
    },
    watch: {
      platformViewsToday: (newViews, oldViews) => {
        Event.$emit(EventNames.PLATFORM_VIEWS_TODAY, {value: newViews})
      }
    },
    methods: {
      count () {
        this.platformInterval = setInterval(() => {
          if (this.platformViews[this.platformViewsPos]) {
            this.platformViewsToday = this.platformViews[this.platformViewsPos].v
            this.platformViewsPos++
          } else {
            clearInterval(this.platformInterval)
            this.counted = true

            // if we've haven't applied todays value yet
            // go ahead and do that
            if (!this.appliedToday && this.apiToday) {
              this.linearCount(self.apiToday, {today: this.apiToday, steps: 50, intervalName: 'platformFixedInterval'})
            }

            // if we haven't added the event to date
            // go ahead and do that
            if (!this.appliedEvent && this.eventToDate) {
              this.linearCount(this.eventToDate, {reset: true, steps: 100, og: this.platformViewsEventToDate, eventToDate: this.eventToDate, intervalName: 'eventToDateInterval'})
            }
          }
        }, this.secondsPerStep)

        // timeout that shows the two numbers
        this.revealTimeout = setTimeout(() => {
          this.reveal = true
        }, 6000)
      },
      linearCount (toNumber, opts) {
        var self = this
        opts.og = 0;

        (function (opts, toNumber) {
          let perStep = parseInt(toNumber / opts.steps, 10)

          self[opts.intervalName + 'currentStep'] = 0
          self[opts.intervalName + 'totalSteps'] = opts.steps

          self[opts.intervalName] = setInterval(() => {
            if (opts.today) {
              self.platformViewsToday = opts.today
            }

            if (opts.eventToDate) {
              self.platformViewsEventToDate += perStep
            }

            self[opts.intervalName + 'currentStep']++
            if (self[opts.intervalName + 'currentStep'] >= self[opts.intervalName + 'totalSteps']) {
              if (opts.eventToDate) {
                self.platformViewsEventToDate = toNumber
              }
              clearInterval(self[opts.intervalName])
            }
          }, 20)
        })(opts, toNumber)
      },
      resetTimeline () {
        this.counted = false
        this.platformViewsToday = 0
        this.platformViewsEventToDate = 0
        this.platformViewsPos = 0
        clearInterval(this.platformInterval)
        this.appliedToday = false
        this.appliedEvent = false
        this.reveal = false
        this.count()
      },
      getData () {
        var self = this

        Vue.http('https://www.usopen.org/demos/data/om_today.json').then((response) => {
          self.apiToday = response.data.total

          if (self.counted) {
            self.linearCount(self.apiToday, {today: self.apiToday, steps: 50, og: self.platformViewsToday, intervalName: 'platformFixedInterval'})
            self.appliedToday = true
          }
        })

        Vue.http('https://www.usopen.org/demos/data/om_etd.json').then((response) => {
          self.eventToDate = response.data.total
          self.linearCount(self.eventToDate, {eventToDate: self.eventToDate, steps: 250, og: self.platformViewsEventToDate, intervalName: 'eventToDateInterval'})
          self.appliedEvent = true
        })
      }
    },
    mounted () {
      this.count()
      this.getData()
      Event.$on(EventNames.RESET_TIMELINE, this.resetTimeline)
    },
    destroyed () {
      clearInterval(this.platformInterval)

      if (this.platformFixedInterval) {
        clearInterval(this.platformFixedInterval)
      }

      if (this.eventToDateInterval) {
        clearInterval(this.eventToDateInterval)
      }
    }
  }
</script>
<style lang="scss">
  .timeline {
    background: #a6f9e7;
    width: 50%;
    height: 1vh;
  }

  .timeline__progress {
    height: 1vh;
    width: 15%;
    background: #09b4a0;
    box-shadow: inset -2px 0 0 0 black;
    position: relative;
  }

  .timeline__text {
    position: absolute;
    top: -20px;
    right: -50px;
    text-align: center;
    width: 100px;

    span {
      display: block;
      text-align: center;
    }
  }

  .ibm-cloud .number span {
    margin: 0 !important;
  }

  .arrow-up {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #09b4a0;
    margin: 0 auto 4vh;
  }
</style>
