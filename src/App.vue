<template>
  <div id="app">
    <div class="container">
      <h1>Web Audio API tuner</h1>

      <h2>Frequency spectrum</h2>

      <FrequencySpectrum :fft-size="fftSize" :type="spectrumType" />
      <svg width="100%" height="20"></svg>
      <div class="controls">
        <label><input type="radio" v-model="spectrumType" value="bar" /> Bar</label>
        <label><input type="radio" v-model="spectrumType" value="line" /> Line</label>
        <label><input type="range" min="5" max="15" v-model.number="fftSize" /> FFT size</label>
      </div>

      <h2>Frequencies of harmonics</h2>
      <FrequencyTable />
    </div>
  </div>
</template>

<script>
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { scaleLog, scaleLinear } from 'd3-scale';

import FrequencySpectrum from './components/FrequencySpectrum.vue';
import FrequencyTable from './components/FrequencyTable.vue';

export default {
  name: 'app',
  components: {
    FrequencySpectrum,
    FrequencyTable
  },
  data() {
    return {
      fftSize: 5,
      spectrumType: 'bar'
    };
  },
  async mounted() {
    const width = select('svg').node().clientWidth;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const xScale = scaleLinear().domain([0, audioCtx.sampleRate]).range([0, width]);
    const xAxis = axisBottom(xScale);
    select('svg')
      .append('g')
      .attr('class', 'axis')
      .call(xAxis);
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

  canvas, svg {
    padding-left: 10px;
  }

  .axis line,
  .axis path {
    stroke: rgba(0, 0, 0, 0.15);
  }
  .axis text {
    color: #2c3e50;
  }

  .controls {
    float: right;
  }
</style>
