import Vue from 'vue';
import Router from 'vue-router';
import Gallery from './components/Gallery.vue';
import MapPage from './components/MapPage.vue';


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
      path: '/map-page',
      name: 'MapPage',
      component: MapPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./Views/404.vue')
  }

  ]
});
