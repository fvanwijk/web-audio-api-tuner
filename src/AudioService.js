const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const gainNode = audioCtx.createGain();
gainNode.gain.value = 0;

export function getFFTanalyser(fftSize) {
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      analyser.fftSize = 2 ** fftSize;
      return analyser;
    }).catch(err => {
      console.log('The following gUM error occured: ' + err);
    });
}
