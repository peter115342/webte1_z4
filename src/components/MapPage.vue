<template>
  <div class="main-container">
    <div id="layout">
      <MapContainer :images="images" />
    </div>
  </div>
</template>

<script>
import MapContainer from '@/components/MapContainer.vue';

export default {
  name: 'MapPage',
  components: {
    MapContainer,
  },
  data() {
    return {
      images: [],
    };
  },
  created() {
    this.getJsonData();
  },
  methods: {
    getJsonData() {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseURL = isProduction
    ? 'https://webte1.fei.stuba.sk/~xmuzslay/kyahabpana/' 
    : '/';

  const jsonPath = baseURL + 'images.json';

  fetch(jsonPath)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to fetch JSON data');
    })
    .then((jsonData) => {
      jsonData.images.forEach((image) => {
        image.url = isProduction
          ? `https://webte1.fei.stuba.sk/~xmuzslay/kyahabpana${image.url}` 
          : image.url;
      });

      this.images = jsonData.images;
    })
    .catch((error) => {
      console.error(error);
    });
},
  },
};
</script>

<style scoped>
#layout {
  width: 100%;
  height: 100%;
}

.main-container {
  position: relative;
  margin: 0 auto;
  width: 95%;
  margin-top: 15px;
  height: 600px;
}
</style>
