import Vue from 'vue'
import axios from 'axios'
import moment from 'moment-timezone'
import App from './App'
import router from './router'
import store from './store'
import $ from 'jquery'

global.$ = $

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// todo: move to its own thing
// todo: replace usage with HumanizePlus's intcomma()
Vue.filter('intcomma', function (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// Converts timestamp to milliseconds
// 00:01:36.276 to 96276
Vue.filter('timestamp-to-ms', function (value) {
  let splitValue = value.split(':')
  let result = 0

  result += splitValue[0] * 60 * 60 * 1000
  result += splitValue[1] * 60 * 1000
  result += splitValue[2] * 1000

  return result
})

Vue.filter('timestamp-to-datetime', function (value) {
  value -= (60 * 60 * 0)
  let tz = moment().tz('America/New_York').format()
  return moment.unix(value).zone(tz).format('dddd h:mm a')
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
