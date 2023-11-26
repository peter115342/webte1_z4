<template>
  <div class="main-container">
    <img
      v-for="img in images"
      :key="img.url"
      :src="img.url"
      :alt="img.description"
      class="thumbnail"
      @click="openModal(img)"
    />

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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryPage',
  data() {
    return {
      images: [],
      selectedImage: null,
      currentIndex: 0,
      slideshowInterval: null,
      slideshowActive: false,
    };
  },
  mounted() {
    this.getImages();
  },
  methods: {
    getImages() {
      const publicPath =
        process.env.NODE_ENV === 'production'
          ? '/~xmuzslay/becnkhchag/'
          : '/';
      const jsonPath = publicPath + 'images.json';
      fetch(jsonPath)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((result) => {
          if (result != null) {
            this.images = result.images;
          } else {
            console.error('response is empty');
          }
        });
    },
    openModal(img) {
      this.selectedImage = img;
      this.currentIndex = this.images.findIndex(
        (image) => image.url === img.url
      );
      this.$nextTick(() => {
        const modal = document.querySelector('.modal');
        if (modal) {
          modal.style.display = 'block';
        }
      });
    },
    closeModal() {
      this.selectedImage = null;
      this.currentIndex = 0;
      clearInterval(this.slideshowInterval);
      this.$nextTick(() => {
        const modal = document.querySelector('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    },
    navigate(direction) {
      this.currentIndex =
        (this.currentIndex + direction + this.images.length) %
        this.images.length;
      this.selectedImage = this.images[this.currentIndex];
    },
    toggleSlideshow(event) {
      event.stopPropagation();

      if (this.slideshowInterval) {
        clearInterval(this.slideshowInterval);
        this.slideshowInterval = null;
        this.slideshowActive = false;
      } else {
        this.slideshowInterval = setInterval(() => {
          this.navigate(1);
        }, 2500);
        this.slideshowActive = true;
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
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: #fefefe;
  text-align: center;
  max-width: 80%;
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 50px;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  color: white;
  outline: none;
  padding: 10px;
  transform: translate(-25%, 25%);
  width: 50px;
}

.modal-image {
  max-width: 100%;
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
  left: 10px;
  margin-left: 5px;
}

.right {
  right: 10px;
  margin-right: 5px;
}
.slideshow-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  background: rgb(30, 160, 127);
  border: none;
  color: white;
  cursor: pointer;
  outline: none;
  padding: 10px;
}
.slideshow-active {
    background-color: rgb(209, 81, 22);
  }

</style>
