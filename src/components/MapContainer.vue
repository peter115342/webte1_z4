<template>
  <div ref="map" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'MapContainer',
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    dates: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiOHBldGVyOCIsImEiOiJjbHBjb29nOGgwdno1MmtwZHI3dGhxaHJmIn0.mDbGBzVa0SJPgtgFIanB-Q';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [17.5410, 48.1972],
      zoom: 8,
    });
    this.addMarkers();
  },
  methods: {
    addMarkers() {
  if (Array.isArray(this.markers) && this.map) {
    this.markers.forEach((marker) => {
      console.log(marker.latitude,marker.longitude)
          new mapboxgl.Marker()
            .setLngLat([marker.longitude, marker.latitude])
            .addTo(this.map);
    });
  }
},


  },
  watch: {
    markers: 'addMarkers',
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
