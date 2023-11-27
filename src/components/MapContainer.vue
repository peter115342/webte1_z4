<template>
  <div>
    <div ref="map" class="map-container">
      <button id="route-button" @click="toggleRouteVisibility">Toggle Route Visibility</button>

    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'MapContainer',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      styleLoaded: false,
      directions: null,
      sortedImages: [],
      isRouteVisible: true,
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiOHBldGVyOCIsImEiOiJjbHBjb29nOGgwdno1MmtwZHI3dGhxaHJmIn0.mDbGBzVa0SJPgtgFIanB-Q';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      center: [17.5410, 48.1972],
      zoom: 6,
    });

    this.map.on('style.load', () => {
      this.styleLoaded = true;
      this.addMarkers();
      this.getDirections();
    });
  },
  methods: {
    addMarkers() {
      if (this.styleLoaded && Array.isArray(this.images) && this.map) {
        this.sortedImages = this.sortedImagesComputed;
        console.log(this.sortedImages);

        this.sortedImages.forEach((image) => {
          new mapboxgl.Marker()
            .setLngLat([image.coordinates.longitude, image.coordinates.latitude])
            .addTo(this.map);
        });

        const coordinates = this.sortedImages.map((image) => [image.coordinates.longitude, image.coordinates.latitude]);
        this.getDirections(coordinates);
      }
    },
    getDirections(coordinates) {
      // Fetch directions only if coordinates are provided
      if (coordinates && coordinates.length > 0) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const route = data.routes[0].geometry;

              // Remove existing 'directions' source and layer
              if (this.map.getSource('directions')) {
                this.map.removeLayer('directions');
                this.map.removeSource('directions');
              }

              this.map.addSource('directions', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  geometry: route,
                },
              });

              this.map.addLayer({
                id: 'directions',
                type: 'line',
                source: 'directions',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': 'rgb(209, 81, 22)',
                  'line-width': 5,
                  'line-opacity': this.isRouteVisible ? 0.75 : 0, // Set opacity based on visibility
                },
              });

              const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
              }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[coordinates.length - 1]));

              this.map.fitBounds(bounds, { padding: 20 });
            }
          })
          .catch((error) => console.error('Error fetching directions:', error));
      }
    },
    toggleRouteVisibility() {
      this.isRouteVisible = !this.isRouteVisible;

      // Update the layer opacity based on visibility
      if (this.map.getLayer('directions')) {
        this.map.setPaintProperty('directions', 'line-opacity', this.isRouteVisible ? 0.75 : 0);
      }
    },
  },
  computed: {
    sortedImagesComputed() {
      return this.images.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
  },
  watch: {
    images: 'addMarkers',
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 80vh; 
}
#route-button{
position: absolute;
z-index: 1;
top: 0;
left: 0;
transform: translate(5%, 25%);
outline: none;
border: none;
border-radius: 5px;
width: 175px;
height: 36px;
background: rgba(0, 0, 0, 0.65);
color: aliceblue;
}
</style>
