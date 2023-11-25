import Vue from 'vue';
import Router from 'vue-router';
import Gallery from './components/Gallery.vue';
import Map from './components/Map.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/gallery'
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: Gallery
    },
    {
      path: '/Map',
      name: 'Map',
      component: Map
    }
  ]
});
