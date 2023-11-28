<template>
  <div class="main-container">
    <div ref="map" class="map-container">
      <button id="route-button" @click="toggleRouteVisibility">Toggle Route</button>
      <div v-if="isRouteVisible" class="route-info">
        Route Length: {{ routeLength.toFixed(2) }} km
      </div>
    </div>

    <div v-if="selectedImage" class="image-modal" @click="closeModalOnOverlay">
      <div class="modal-content">
        <img :src="selectedImage.url" :alt="selectedImage.alt" />
        <button class="close-button" @click="closeModal">&times;</button>
        <div class="image-details">
          <div class="image-info">
            <h3>{{ selectedImage.name }}</h3>
            <p>{{ selectedImage.description }}</p>
            <p>{{ selectedImage.timestamp }}</p>
          </div>
          <div class="thumbnails-and-location">
            <div class="image-thumbnails">
              <img
                v-for="img in imagesWithSameLocation"
                :key="img.id"
                :src="img.url"
                :alt="img.alt"
                @click="openModal(img)"
              />
            </div>
            <div class="location-info">
              <h5>{{ selectedImage.location }}</h5>
            </div>
          </div>
        </div>

        <div class="scroll-message" >
          <p>Scroll down for more </p>
        </div>
      </div>
    </div>
  </div>
  <p class="note">I know this might not be the most efficient solution, but I like the 3D buildings and lightning API Mapbox GL v3 Beta brings </p>
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
      imagesWithSameLocation: [],
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
      this.imagesWithSameLocation = this.images.filter(
        (img) => img.location === this.selectedImage.location
      );
    },
    closeModal() {
      this.selectedImage = null;
      this.imagesWithSameLocation = [];
    },
    closeModalOnOverlay(event) {
      if (event.target.classList.contains('image-modal')) {
        this.closeModal();
      }
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
                  'line-color': 'rgb(249, 75, 52)',
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
  border-radius: 2%;
  margin-top: 0px;
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
  transform: translate(135%, 25%);
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

.thumbnails-and-location {
  display: flex;
  flex-direction: column;
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
  z-index: 2;
}

.modal-content {
  position: relative;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  margin-top: 50px;
  overflow-y: auto; /* Added overflow-y here */
}

img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: fill;
}

.image-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
}

.image-thumbnails img {
  width: 90px;
  height: 60px;
  object-fit: cover;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.image-thumbnails {
  position: relative;
  margin: 0 auto;
  margin-left: 5px;
  margin-right: 5px;
}

.image-info, .location-info {
  text-align: center;
}

.close-button {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 32px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  color: white;
  outline: none;
  transform: translate(-25%, 25%);
  width: 50px;
  height: 50px;
}

.image-details {
  position: absolute;
  bottom: 0%;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  color: white;
  outline: none;
  background: rgba(0, 0, 0, 0.75);
  width: fit-content;
}

.location-info {
  text-align: center;
  margin-bottom: 5px;
}

.image-details h3, .image-details p {
  margin: 0;
}

.note {
  margin-top: 10px;
  font-size: smaller;
  color: rgb(171, 184, 196);
}

.scroll-message {
    position: absolute;
    bottom: 5px;    
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    display: none;
    background: rgba(0, 0, 0, 0.75);
    border: none;
  color: white;
  outline: none;
    max-width: 100%;
    padding-right: 5px;
  padding-left: 5px;
  text-align: center;
justify-content: center;
height:  32px;
white-space: nowrap;
  }


@media screen and (max-width: 768px) {
  .scroll-message {
      display: block;
    }
  .image-details {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }

  .image-thumbnails {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-content {
    max-height: calc(100vh - 100px);

  }

  .main-container {
    overflow-y: auto;
  }
}

</style>


