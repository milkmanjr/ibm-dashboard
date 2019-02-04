<template>
  <div>
      <h4>Public Cloud</h4>
        <span>&mdash;</span>
        <h5>Scores, articles, media</h5>
        <table>
          <tr v-for="data in cloudData" v-if="cloudData.length > 0">
            <td>{{ cloudMappings[data.site] }}</td>
            <td class="number">{{ data.percentage }}%</td>
          </tr>
        </table>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    data () {
      return {
        cloudData: [],
        cloudMappings: {
          s1: 'Dallas',
          s2: 'Montreal',
          s3: 'San Jose',
          s4: 'London',
          s6: 'Tokyo'
        }
      }
    },
    methods: {
      getData () {
        var self = this
        Vue.http('https://www.usopen.org/demos/cloud/cmusta_traffic.json').then((response) => {
          self.cloudData = response.data.data
        })
      }
    },
    mounted () {
      this.getData()
    },
    unmounted () {
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

  .arrow-up {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #09b4a0;
    margin: 0 auto 4vh;
  }
</style>
