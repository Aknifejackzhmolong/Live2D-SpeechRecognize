// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import store from '@/store'
import axios from '@/axios'

import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.use(MintUI)

Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
})
