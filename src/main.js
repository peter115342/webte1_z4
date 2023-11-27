import { createApp } from 'vue';
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.css";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRouter, createWebHashHistory } from 'vue-router';
import Gallery from './components/Gallery.vue';
import MapPage from './components/MapPage.vue';

const router = createRouter({
  history: createWebHashHistory(process.env.NODE_ENV === "production" ? "/~xmuzslay/kyahabpana/" : "/"),
  base: 'https://webte1.fei.stuba.sk/~xmuzslay/kyahabpana/',
  routes: [
    { path: '/', redirect: '/gallery' },
    { path: '/gallery', component: Gallery },
    { path: '/map-page', component: MapPage },
  ],
});

const app = createApp(App);

app.use(bootstrap).use(router);

app.mount('#app');
