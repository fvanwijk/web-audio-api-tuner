<template>
  <div id="app">
    <h1>Web Audio API tuner</h1>
    <FrequencyTable />
  </div>
</template>

<script>
import FrequencyTable from "./components/FrequencyTable.vue";

export default {
  name: 'app',
  components: {
    FrequencyTable
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
