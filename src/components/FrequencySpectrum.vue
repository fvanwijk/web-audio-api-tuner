<template>
  <canvas style="width: 100%" height="300"></canvas>
</template>

<script>
  import { scaleLinear } from 'd3-scale';
  import { getFFTanalyser } from '../AudioService';

  export default {
    name: 'FrequencySpectrum',
    mounted() {
      const canvas = this.$el;
      canvas.width = canvas.offsetWidth;
      const canvasCtx = canvas.getContext('2d');
      const WIDTH = canvas.offsetWidth;
      const HEIGHT = canvas.offsetHeight;
      const colorScale = scaleLinear().domain([0, 255]).range([0.3, 1]);
      const yScale = scaleLinear().domain([0, 255]).range([0, HEIGHT]);

      let drawVisual; // requestAnimationFrame

      const visualize = analyser => {

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = function () {
          drawVisual = requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          canvasCtx.fillStyle = 'white';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / bufferLength);
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];

            canvasCtx.fillStyle = `rgba(127,0,0,${colorScale(value)})`;
            canvasCtx.fillRect(x, HEIGHT - yScale(value), barWidth, yScale(value));

            x += barWidth + 1;
          }
        };

        draw();
      };

      getFFTanalyser(this.fftSize).then(visualize);
    },
    props: {
      fftSize: {
        required: true,
        type: Number,
        validator(val) {
          return Number.isInteger(val) && 5 <= val && val <= 12;
        }
      }
    }
  }
</script>

<style>
  canvas {
    display: block;
  }
</style>
