import 'bootstrap337/dist/css/bootstrap.min.css'
import 'bootstrap337/dist/js/bootstrap.min.js'
import 'vue2-animate/dist/vue2-animate.min.css'

import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store/'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
