import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default Doughnut.extend({
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, { events: [], cutoutPercentage: 90 })
  }
})
