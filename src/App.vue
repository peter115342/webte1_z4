<template>
  <div class="app-body">
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary bg-gradient mt-0 navbar-fixed-top">
      <div class="container-fluid">
        <router-link to='/gallery' class="navbar-brand">Gallery</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to='/gallery' class="nav-link" aria-current="page">Gallery</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/map-page" class="nav-link">Map</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view class="main_viewport"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
@import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');
* {
  font-family: 'Muli', sans-serif;
}

.navbar.bg-primary {
  background: linear-gradient(to bottom, rgb(10, 92, 207), rgb(30, 140, 160)) !important;
  width: 100%;
}
.navbar-nav .nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.navbar-nav .nav-link {
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.navbar{
  border-bottom: 3px solid rgb(21, 85, 97);
}
.loading{
  margin-top: 25px;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1f2933;
  height: fit-content;
}
.main_viewport{
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
}
.router-link {
  cursor: pointer;
}
.main-container{
  position: relative;
  margin: 0 auto;
  max-width: 1650px;
  padding: 8px;
}

p{
  color: #969696;
}
.thumbnail {
    margin: .5em .5em;
    height: 12em;
    width: 12em;
    object-fit: cover;
    border-radius: 20px;
    cursor: pointer;

}
</style>