<template>
  <canvas style="width: 100%" height="300"></canvas>
</template>

<script>
  import { scaleLinear } from 'd3-scale';

  export default {
    name: 'FrequencySpectrum',
    mounted() {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      const canvas = this.$el;
      canvas.width = canvas.offsetWidth;
      const canvasCtx = canvas.getContext('2d');
      const WIDTH = canvas.offsetWidth;
      const HEIGHT = canvas.offsetHeight;
      const colorScale = scaleLinear().domain([0, 255]).range([0.3, 1]);
      const yScale = scaleLinear().domain([0, 255]).range([0, HEIGHT]);

      let source;
      const analyser = audioCtx.createAnalyser();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0;

      navigator.getUserMedia(
        { audio: true },
        stream => {
          source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          visualize(stream);
        },
        err => {
          console.log('The following gUM error occured: ' + err);
        }
      );

      let drawVisual; // requestAnimationFrame

      function visualize() {

        analyser.fftSize = 2 ** 9;
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
      }
    }
  }
</script>

<style>
  canvas {
    border-bottom: 1px solid grey;
  }
</style>
