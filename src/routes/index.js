import Vue from "vue";
import VueRouter from 'vue-router'
import HomePage from "../pages/HomePage";

Vue.use(VueRouter)

const routes = [
    {path: '/', name: 'home', component: HomePage},
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

export default router