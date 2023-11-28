<template>
  <div>
    <input type="text" id="filter" placeholder="Filter images" v-model="filterString">

    <div class="main-container">
      <div class="images-container">
        <img
          v-for="img in filteredImages"
          :key="img.url"
          :src="img.url"
          :alt="img.description"
          class="thumbnail"
          @click="openModal(img)"
        />
      </div>

      <div v-if="selectedImage" class="modal" @click="closeModal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <button class="nav-button left" @click.stop.prevent="navigate(-1)">←</button>
          <img
            :src="selectedImage.url"
            :alt="selectedImage.description"
            class="modal-image"
            @click.stop="openModal(selectedImage)"
          />
          <button class="nav-button right" @click.stop.prevent="navigate(1)">→</button>
          <button
            class="slideshow-button"
            :class="{ 'slideshow-active': slideshowActive }"
            @click.stop="toggleSlideshow($event)"
          >
            Slideshow
          </button>
          <div class="image-details">
            <h3>{{ selectedImage.name }}</h3>
            <p>{{ selectedImage.description }}</p>
            <p>{{ selectedImage.timestamp }}</p>
          </div>
        </div>
        <div id="map" class="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'GalleryPage',
  data() {
    return {
      images: [],
      originalImages: [],
      selectedImage: null,
      currentIndex: 0,
      slideshowInterval: null,
      slideshowActive: false,
      filterString: '',
      map: null,
      marker: null,
    };
  },
  computed: {
    filteredImages() {
      const searchString = this.filterString.toLowerCase();
      return this.originalImages.filter((img) =>
        img.name.toLowerCase().includes(searchString) ||
        img.description.toLowerCase().includes(searchString) ||
        img.location.toLowerCase().includes(searchString)
      );
    },
  },
  mounted() {
    this.getImages();
    this.filterString = this.$route.query.filter || '';

    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeUnmount() {
  window.removeEventListener('keydown', this.handleKeyDown);

  if (this.map) {
    this.map.remove();
    this.map = null;
  }
  if (this.marker) {
    this.marker.remove();
    this.marker = null;
  }
},

  methods: {
    async getImages() {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseURL = isProduction
    ? 'https://webte1.fei.stuba.sk/~xmuzslay/kyahabpana/'
    : '/';

  const jsonPath = baseURL + 'images.json';

  try {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error('Failed to fetch JSON data');
    }

    const result = await response.json();

    if (result != null && Array.isArray(result.images)) {
      this.images = result.images;

      this.images.forEach((image) => {
        image.url = isProduction
          ? `https://webte1.fei.stuba.sk/~xmuzslay/kyahabpana${image.url}`
          : image.url;
      });

      this.originalImages = [...this.images];
    } else {
      console.error('Invalid or empty response');
      this.originalImages = [];
    }
  } catch (error) {
    console.error(error);
    this.originalImages = []; 
  }
},


    openModal(img) {
      this.selectedImage = img;
      this.currentIndex = this.originalImages.findIndex(
        (image) => image.url === img.url
      );
      this.$nextTick(() => {
        const modal = document.querySelector('.modal');
        if (modal) {
          modal.style.display = 'block';

          const imageDetails = document.querySelector('.image-details');
          if (imageDetails) {
            imageDetails.addEventListener('click', (event) => {
              event.stopPropagation();
            });
          }

          this.initializeMap();
        }
      });
    },
    closeModal() {
  this.selectedImage = null;
  this.currentIndex = 0;
  clearInterval(this.slideshowInterval);
  this.slideshowActive = false;
  this.$nextTick(() => {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.style.display = 'none';
    }

    
  });
},

    navigate(direction) {
      const images = this.filteredImages;

      if (images && images.length > 0) {
        this.currentIndex = (this.currentIndex + direction + images.length) % images.length;
        this.selectedImage = images[this.currentIndex];

        this.initializeMap();
      }
    },
    toggleSlideshow(event) {
      event.stopPropagation();

      if (this.slideshowInterval) {
        clearInterval(this.slideshowInterval);
        this.slideshowInterval = null;
        this.slideshowActive = false;
      } else {
        this.slideshowInterval = setInterval(() => {
          this.navigate(1, this.filteredImages);
        }, 2500);
        this.slideshowActive = true;
      }
    },

    initializeMap() {
      const img = this.selectedImage;

      if (img && img.coordinates) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiOHBldGVyOCIsImEiOiJjbHBjb29nOGgwdno1MmtwZHI3dGhxaHJmIn0.mDbGBzVa0SJPgtgFIanB-Q';

        this.map = new mapboxgl.Map({
          container: 'map',
          center: [img.coordinates.longitude, img.coordinates.latitude],
          zoom: 12,
        });

        if (this.marker) {
          this.marker.remove();
        }

        this.marker = new mapboxgl.Marker()
          .setLngLat([img.coordinates.longitude, img.coordinates.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${img.name}</h3><p>${img.location}</p>`))
          .addTo(this.map);
      }
    },

    handleKeyDown(event) {
      if (this.selectedImage) {
        if (event.key === 'ArrowLeft') {
          this.navigate(-1);
        } else if (event.key === 'ArrowRight') {
          this.navigate(1);
        }
      }
    },
  },
};
</script>

<style scoped>
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background: rgba(0, 0, 0, 0.75);
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  margin-top: 15px;
  max-height: 87vh;
  display: flex;
  flex-direction: column;
}

.close {
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

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: fill;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  padding: 10px;
}

.left {
  left: 5px;
  font-size: 32px;
  height: 25%;
}

.right {
  right: 10px;
  font-size: 32px;
  height: 25%;
}

.slideshow-button {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  background: rgb(30, 160, 127);
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  padding: 10px;
  border-radius: 5px;
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
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
}

.image-details h3,
.image-details p {
  margin: 0;
}

.slideshow-active {
  background-color: rgb(209, 81, 22);
}

#filter {
  margin: 20px;
  border-radius: 5px;
  border: 2px solid rgb(21, 85, 97);
  background-color: #f0eded;
  width: 25%;
}

.map {
  max-width: 80%;
  height: 15%;
  max-height: 20vh;
  position: relative;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}

@media screen and (max-width: 600px) {
  .modal-content {
    flex-direction: column;
  }

  .image-details {
    position: relative;
    margin-top: 10px;
  }

  .modal-image {
    max-height: 60vh;
  }
}
</style>
