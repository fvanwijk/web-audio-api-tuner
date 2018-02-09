new Vue({
  el: '#harmonics',
  data() {
    return {
      overtones: [ // 329.63 Hz
        'E4', 'x', 'x', 'x'
      ].map((o, i) => ({ name: o, freq: Math.round((i+1) * 220*2**(7/12)) }))
    }
  },
  template: `
  <ul><li v-for="overtone in overtones">{{overtone.name}} - {{overtone.freq}}Hz</li></ul>
  `
});
