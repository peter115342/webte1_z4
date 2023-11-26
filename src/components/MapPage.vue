<template>
  <div class="main-container">
    <div id="layout">
      <MapContainer :markers="markers" :dates ="dates" />
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
      markers: [],
      dates:[],

    };
  },
  created() {
    this.getJsonData();
  },
  methods: {
    getJsonData() {
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
          throw new Error('Failed to fetch JSON data');
        })
        .then((jsonData) => {
          console.log(jsonData.images);
          this.markers = jsonData.images.map((image) => image.coordinates);
          this.dates = jsonData.images.map((image) => image.timestamp);

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
