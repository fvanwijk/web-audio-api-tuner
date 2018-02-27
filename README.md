# Web Audio API tuner

There are many expensive (piano) tuning apps for mobile, but I haven't seen a free web based alternative yet.

This project could lead to a sophisticated piano tuner. Ideas are borrowed from Entropy Piano Tuner and Verituner.

Nevertheless it is a good way to experiment with the Web Audio API and to learn some piano tuning theory.

## Build Setup

### Front-end

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve
```

## Roadmap

- [x] Show frequencies of all piano notes for reference (also harmonics)
- [x] Get microphone input
- [x] Show frequency spectrum
- [ ] Show piano keys and frequencies as y-axis
- [ ] Determine note being played using FFT
- [ ] Determine note being played using auto-correlation
- [ ] Show fundamental offset from note in cents
- [ ] Show fine grained offset
- [ ] Show overtone offsets
- [ ] Record notes to create Railsback curve
