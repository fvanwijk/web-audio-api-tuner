<template>
  <div id="app">
    <div class="container">
      <h1>Web Audio API tuner</h1>
      <h2>Frequency spectrum</h2>
      <FrequencySpectrum />
      <h2>Frequencies of harmonics</h2>
      <FrequencyTable />
    </div>
  </div>
</template>

<script>
import FrequencySpectrum from './components/FrequencySpectrum.vue';
import FrequencyTable from './components/FrequencyTable.vue';

export default {
  name: 'app',
  components: {
    FrequencySpectrum,
    FrequencyTable
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

/* Mobile */
@media only screen and (max-width: 767px) {
  .container {
    width: auto;
    margin-left: 1em;
    margin-right: 1em;
  }
}

/* Tablet */
@media only screen and (min-width: 768px) and (max-width: 1023px) {
  .container {
    width: 719px;
  }
}

/* Small Monitor */
@media only screen and (min-width: 1024px) and (max-width: 1279px) {
  .container {
    width: 959px;
  }
}

/* Large Monitor */
@media only screen and (min-width: 1280px) {
  .container {
    width: 1199px;
  }
}

</style>
