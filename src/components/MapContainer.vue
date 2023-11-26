<template>
      <div ref="mapContainer" class="map-container">

      </div>
  </template>

  <script>
  import mapboxgl from 'mapbox-gl';
  mapboxgl.accessToken = 'pk.eyJ1IjoiOHBldGVyOCIsImEiOiJjbHBjb29nOGgwdno1MmtwZHI3dGhxaHJmIn0.mDbGBzVa0SJPgtgFIanB-Q';

  export default {
    name: 'MapContainer',
    mounted() {

      const map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [17.10464, 48.13687],
        zoom: 6,
      });

      this.map = map;
    },
    unmounted() {
  this.map.remove();
  this.map = null;
}
  };
  </script>

  <style scoped >
  .map-container {
    width: 100%;
  height: 100%;
}



  </style>
