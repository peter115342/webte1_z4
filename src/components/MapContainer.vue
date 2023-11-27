<template>
  <div class="main-container">
    <div ref="map" class="map-container">
      <button id="route-button" @click="toggleRouteVisibility">Toggle Route Visibility</button>
      <div v-if="isRouteVisible" class="route-info">
        Route Length: {{ routeLength.toFixed(2) }} km
      </div>
    </div>

    <div v-if="selectedImage" class="image-modal">
      <div class="modal-content">
        <img :src="selectedImage.url" :alt="selectedImage.alt" />
        <button @click="closeModal">Close</button>
      </div>
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
      isRouteVisible: false,
      routeLength: 0,
      selectedImage: null,
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiOHBldGVyOCIsImEiOiJjbHBjb29nOGgwdno1MmtwZHI3dGhxaHJmIn0.mDbGBzVa0SJPgtgFIanB-Q';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      center: [17.5410, 48.1972],
      zoom: 5,
    });

    this.map.on('style.load', () => {
      this.styleLoaded = true;
      this.addMarkers();
      this.getDirections();
      this.map.setConfigProperty('basemap', 'lightPreset', 'dawn');

    });
  },
  methods: {
    addMarkers() {
      if (this.styleLoaded && Array.isArray(this.images) && this.map) {
        this.sortedImages = this.sortedImagesComputed;

        this.sortedImages.forEach((image) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([image.coordinates.longitude, image.coordinates.latitude])
            .addTo(this.map);

          marker.getElement().addEventListener('click', () => {
            this.openModal(image);
          });
        });

        const coordinates = this.sortedImages.map((image) => [image.coordinates.longitude, image.coordinates.latitude]);
        this.getDirections(coordinates);
      }
    },
    openModal(image) {
      this.selectedImage = image;
    },
    closeModal() {
      this.selectedImage = null;
    },
    getDirections(coordinates) {
  if (coordinates && coordinates.length > 0) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}?geometries=geojson&steps=true&overview=full&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry;

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
              'line-opacity': this.isRouteVisible ? 0.75 : 0,
            },
          });

          this.routeLength = data.routes[0].distance / 1000; // Convert meters to kilometers

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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
}

#route-button {
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
  background: rgba(255, 255, 255, 0.8);
  font-weight: bolder;

}

.route-info {
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  transform: translate(140%, 25%);
  height: 36px;
  outline: none;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  text-align: center;
  line-height: 36px;
  font-weight: bolder;
  padding-left: 4px;
  padding-right: 4px;

}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  max-width: 80%;
  max-height: 80%;
  background: white;
  padding: 20px;
  border-radius: 10px;
  overflow: auto;
}

img {
  max-width: 100%;
  max-height: 100%;
}

button {
  margin-top: 10px;
}
</style>
