<template>
    <div class="main-container">
        <div id="layout">
    <MapContainer/>
  </div>
    </div>
  </template>
  
  <script>
  import MapContainer from '@/components/MapContainer.vue';
  import 'mapbox-gl/dist/mapbox-gl.css';

  export default {
    name: 'MapPage',
    components: {
        MapContainer
    }
  };
  </script>
  
  <style >
  #layout {
  width: 100%;
  height: 100%;
}

.main-container{
    position: relative;
    margin: 0 auto;
    width: 100%;

    height: 600px;
}
  </style>
  