<template>
  <div>
    <canvas style="width: 100%" height="300"></canvas>
    <svg width="100%" height="20"></svg>
  </div>
</template>

<script>
  import { axisBottom } from 'd3-axis';
  import { range } from 'd3-array';
  import { scaleBand, scaleLinear } from 'd3-scale';
  import { select } from 'd3-selection';
  import { getFFTanalyser } from '../AudioService';

  export default {
    name: 'FrequencySpectrum',
    data() {
      return {
        drawVisual: undefined, // requestAnimationFrame
        xBarScale: scaleBand().padding(0.1)
      }
    },
    methods: {
      init() {
        getFFTanalyser().then(analyser => {
          this.visualize(analyser);

          select('.axis').call(axisBottom(this.xBarScale));
        });
      },
      visualize(analyser) {
        const canvas = this.$el.getElementsByTagName('canvas')[0];
        const canvasCtx = canvas.getContext('2d');
        const WIDTH = canvas.offsetWidth;
        const HEIGHT = canvas.offsetHeight;

        analyser.fftSize = 2 ** this.fftSize;
        analyser.maxDecibels = -10;
        const binCount = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(binCount);
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const sampleRate = 44100;
        const binSize = sampleRate / binCount;
        const freqs = range(binCount).map(d => (d + 1) * binSize);

        this.xBarScale.domain(freqs).range([0, WIDTH]);
        const xScale = scaleLinear().domain([0, sampleRate]).range([0, WIDTH]);
        const yScale = scaleLinear().domain([0, 255]).rangeRound([HEIGHT, 0]);
        const colorScale = scaleLinear().domain([0, 255]).range([0.5, 1]);


        const draw = () => {
          this.drawVisual = requestAnimationFrame(draw);

          analyser.getByteFrequencyData(dataArray);

          // Clear canvas every frame
          canvasCtx.fillStyle = 'white';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT + 1);

          // Preprocess data
          const freqData = Array.from(dataArray).map((val, i) => {
            return {
              freq: (i+1) * binSize,
              value: val
            };
          });

          // Draw chart
          if (this.type === 'bar') {
            freqData.forEach(d => {
              canvasCtx.fillStyle = `rgba(127,0,0,${colorScale(d.value)})`;
              canvasCtx.fillRect(this.xBarScale(d.freq), yScale(d.value), this.xBarScale.bandwidth(), HEIGHT - yScale(d.value));
            });
          } else {
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = '#2c3e50';
            canvasCtx.beginPath();

            freqData.forEach((d, i) => {
              if (i === 0) {
                canvasCtx.moveTo(xScale(d.freq), yScale(d.value));
              } else {
                canvasCtx.lineTo(xScale(d.freq), yScale(d.value));
              }
            });

            canvasCtx.lineTo(WIDTH, HEIGHT);
            canvasCtx.stroke();
          }
        };

        draw();
      }
    },
    mounted() {
      const canvas = this.$el.getElementsByTagName('canvas')[0];
      canvas.width = canvas.offsetWidth;

      select('svg')
        .append('g')
        .attr('class', 'axis')

      this.init();
    },
    props: {
      type: {
        default: 'line',
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
        this.init();
      }
    }
  }
</script>

<style>
  canvas {
    display: block;
  }
</style>
