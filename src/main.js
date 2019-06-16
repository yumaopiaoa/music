// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'

import 'swiper/dist/css/swiper.css'
import './assets/css/neat-min.css'
import './assets/css/style.css'
import './assets/fonts/iconfont.css'

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
	loading: require('./assets/logo.png')
})

FastClick.attach(document.body)
Vue.prototype.$http = axios
Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})