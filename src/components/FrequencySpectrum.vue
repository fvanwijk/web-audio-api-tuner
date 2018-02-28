<template>
  <canvas style="width: 100%" height="300"></canvas>
</template>

<script>
  import { scaleLinear } from 'd3-scale';
  import { getFFTanalyser } from '../AudioService';

  export default {
    name: 'FrequencySpectrum',
    data() {
      return {
        drawVisual: undefined // requestAnimationFrame
      }
    },
    methods: {
      visualize(analyser) {
        const canvas = this.$el;
        const canvasCtx = canvas.getContext('2d');
        const WIDTH = canvas.offsetWidth;
        const HEIGHT = canvas.offsetHeight;

        const colorScale = scaleLinear().domain([0, 255]).range([0.3, 1]);
        const yScale = scaleLinear().domain([0, 255]).range([0, HEIGHT]);

        analyser.fftSize = 2 ** this.fftSize;
        analyser.maxDecibels = -10;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = () => {
          this.drawVisual = requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          const binWidth = (WIDTH / bufferLength);

          // Clear canvas every frame
          canvasCtx.fillStyle = 'white';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT + 1);

          let x = 0;
          if (this.type === 'bar') {

            for (let i = 0; i < bufferLength; i++) {
              const value = dataArray[i];
              if (i === 0) {
                //console.log(value, yScale(value)) // value 255, 298
              }

              canvasCtx.fillStyle = `rgba(127,0,0,${colorScale(value)})`;
              canvasCtx.fillRect(x, HEIGHT - yScale(value), binWidth, yScale(value));

              x += binWidth + 1;
            }
          } else {
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = '#2c3e50';

            canvasCtx.beginPath();

            for (let i = 0; i < bufferLength; i++) {
              const y = HEIGHT - (dataArray[i] / 256 * HEIGHT);

              if (i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }
              x += binWidth;
            }

            canvasCtx.lineTo(WIDTH, HEIGHT);
            canvasCtx.stroke();
          }
        };

        draw();
      }
    },
    mounted() {
      const canvas = this.$el;
      canvas.width = canvas.offsetWidth;

      getFFTanalyser().then(this.visualize);
    },
    props: {
      type: {
        default: 'bar',
        validator(val) {
          return val === 'bar' || val === 'line';
        }
      },
      fftSize: {
        required: true,
        type: Number,
        validator(val) {
          return Number.isInteger(val) && 5 <= val && val <= 15;
        }
      }
    },
    watch: {
      fftSize() {
        getFFTanalyser().then(this.visualize);
      }
    }
  }
</script>

<style>
  canvas {
    display: block;
  }
</style>
