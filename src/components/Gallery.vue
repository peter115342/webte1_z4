<template>
  <div class="main-container">
    <div id="gallery">

</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      images: [],
    };
  },
  mounted() {
    this.getImages();
  },
  methods: {
    
    getImages() {
      let gallery = document.getElementById("gallery");

      //const publicPath = process.env.NODE_ENV === "production" ? "/~xmuzslay/becnkhchag/" : "/";
   // const jsonPath = publicPath + "images.json";
      fetch("/images.json")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return null;
        })
        .then((result) => {
          if (result != null) {
            result.images.forEach(img => {
                let thumbnail = document.createElement('img')
                thumbnail.src = img.url;
                thumbnail.alt = img.description;
                thumbnail.classList.add('thumbnail');

                gallery.appendChild(thumbnail);
            })
            this.images = result.images;
          } else {
            console.error('response is empty');
          }
        });
    },
  },
};
</script>

<style >

</style>
