import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.css"
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { createRouter, createWebHistory } from 'vue-router';
import Gallery from './components/Gallery.vue';
import Map from './components/Map.vue';

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === "production" ? "/~xmuzslay/kyahabpa/" : "/"),
  routes: [
    { path: '/', redirect: '/gallery' },
    { path: '/gallery', component: Gallery },
    { path: '/map', component: Map },
  ],
});
const app = createApp(App);

app.use(bootstrap).use(router);

app.mount('#app');