const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
// Webkit/blink browsers need prefix, Safari won't work without window.

const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');

let drawVisual; // requestAnimationFrame

const analyser = audioCtx.createAnalyser();
const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();

navigator.getUserMedia(
  { audio: true },
  stream => {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination); // connecting the different audio graph nodes together

    visualize(stream);
  },
  err => {
    console.log('The following gUM error occured: ' + err);
  }
);

function findFundamentalFreq(buffer, sampleRate) {
  // We use Autocorrelation to find the fundamental frequency.

  // In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away.
  // The autocorrelation index will be the average of these products. At the same time, we normalize the values.
  // Source: http://www.phy.mty.edu/~suits/autocorrelation.html
  // Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48),
  // while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all)
  var n = 1024;
  let rs = Array.from({ length: 1000 });

  for (var k = 8; k <= 1000; k++) {
    var sum = 0;

    for (var i = 0; i < n; i++) {
      sum += (buffer[i] - 128) / 128 * ((buffer[i + k] - 128) / 128);
    }

    var r = sum / (n + k);
    rs[k] = { k, r };

    if (r > 0.9) {
      // Let's assume that this is good enough and stop right here
      break;
    }
  }
  rs.sort((a, b) => b.r - a.r);
  if (rs[0].r > 0.0025 && rs[0].k !== 8) {
    // The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
    var fundamentalFreq = sampleRate / rs[0].k;
    return fundamentalFreq;
  } else {
    // We haven't found a good correlation
    return undefined;
  }
}

function visualize(stream) {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  analyser.fftSize = 2 ** 12;
  const bufferLength = analyser.frequencyBinCount;

  const blue = d3.schemeBlues[9];
  const colorScale = d3.scaleLinear().domain([128, 0]).range([blue[0], blue[blue.length-1]]);

  const xScale = d3
    .scaleLinear()
    .range([0, WIDTH])
    .domain([0, audioCtx.sampleRate]);

  d3
    .select('#scale')
    .attr('width', WIDTH)
    .attr('height', 30)
    .append('g')
    .call(d3.axisBottom(xScale));

  const dataArray = new Uint8Array(bufferLength);
  const binRange = audioCtx.sampleRate / bufferLength;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  const freqElement = document.getElementById('freq');
  const freqCorrl = document.getElementById('freq-corrl');

  const draw = function() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    var buffer = new Uint8Array(analyser.fftSize);
    // See initializations in the AudioContent and AnalyserNode sections of the demo.
    analyser.getByteTimeDomainData(buffer);
    var fundalmentalFreq = findFundamentalFreq(buffer, audioCtx.sampleRate);

    if (fundalmentalFreq !== undefined) {
      // var note = findClosestNote(fundalmentalFreq, notesArray); // See the 'Finding the right note' section.
      // var cents = findCentsOffPitch(fundalmentalFreq, note.frequency); // See the 'Calculating the cents off pitch' section.
      freqCorrl.innerText = `AutoCorrelated to ${fundalmentalFreq}`; // Function that updates the note on the page (see demo source code).
      // updateCents(cents); // Function that updates the cents on the page and the gauge control (see demo source code).
    }

    const peak = dataArray.reduce(
      (memo, value, index) => (value > memo.value ? { value, index } : memo),
      { value: -1, index: 0 }
    );

    freq.innerText = `Peak: ${peak.index * binRange} Hz`;

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    const barWidth = WIDTH / bufferLength * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      canvasCtx.fillStyle = colorScale(barHeight / 2);
      canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  };

  draw();
}
