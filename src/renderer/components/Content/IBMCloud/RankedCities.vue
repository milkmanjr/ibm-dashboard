<template>
  <div class="ranked-cities">
    <div class="rank" v-for="(city, index) in cities">
      <div class="rank__position">
        <span>{{ '0' + (index + 1) }}</span>
      </div>
      <labeled-value class="rank__item" :label="cityMappings[city.site]" :value="city.percentage + '%'"></labeled-value>
    </div>
    <div class="cityDonut">
      <donut v-if="cityDonutData" :chart-data="cityDonutData"></donut>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Donut from '@/bits/Donut'
  import {Event, EventNames} from '@/bits/Events'

  export default {
    data () {
      return {
        cities: [],
        cityDonutData: null,
        cityMappings: {
          s2: 'Montreal',
          s3: 'San Jose',
          s4: 'London',
          s6: 'Tokyo',
          p1: 'Raleigh',
          p3: 'Boulder',
          p5: 'Portsmouth/UK'
        }
      }
    },
    components: {
      'labeled-value': require('@/bits/LabeledValue'),
      'donut': Donut
    },
    mounted () {
      this.refresh()

      Event.$on(EventNames.REFRESH_MAP, this.refresh)
    },
    destroyed () {
      Event.$off(EventNames.REFRESH_MAP, this.refresh)
    },
    methods: {
      refresh () {
        this.cityDonutData = null

        // todo: map site to city names
        Vue.http('https://www.usopen.org/demos/cloud/cmusta_traffic.json').then((response) => {
          this.cities = response.data.data.sort(function (a, b) {
            return a.percentage < b.percentage
          })

          this.$emit('updatedCities', {cities: this.cities})

          // todo: ignore warning in console for now
          this.cityDonutData = {
            datasets: [
              {
                backgroundColor: ['#A6F9E7', '#09B4A0', '#025348', '#022B22'],
                borderWidth: 0,
                data: this.cities.map((city) => {
                  return city.percentage
                })
              }
            ]
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .ranked-cities {
    padding: 1em 2em;

    .rank {
      display: flex;
      margin-bottom: 1em;

      .rank__position {
        width: 50%;
        font-size: 1.6rem;
        font-family: $font--sans--thin;
        color: rgba(255, 255, 255, 0.25);
        text-align: right;
        padding-right: 0.5em;

        span {
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        }
      }

      .rank__item {
        margin-bottom: 0.25rem;
      }

      &:nth-child(2) .rank__item {
        span {
          color: $theme--ibm-cloud--sub-color !important;
        }

        p {
          opacity: 0.7;
        }
      }

      &:nth-child(3) .rank__item {
        span {
          color: #025348 !important; // not a theme color
        }

        p {
          opacity: 0.4;
        }
      }

      &:nth-child(4) .rank__item {
        span {
          color: #022B22 !important; // not a theme color
        }

        p {
          opacity: 0.2;
        }
      }
    }

    .cityDonut {
      width: 6vw;
      height: 6vw;
      margin: 0 auto;
    }
  }
</style>
