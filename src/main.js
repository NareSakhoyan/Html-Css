import Vue from 'vue'
import App from './App.vue'
import router from "./routes";
import store from "./store/store";
import api from "./utils/api";
import Buefy from "buefy";
import './assets/styles/main.css';

Vue.use(Buefy)

Vue.config.productionTip = false
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
