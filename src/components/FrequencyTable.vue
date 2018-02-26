<template>
  <table>
    <thead>
      <tr>
        <th></th>
        <th v-for="i in 6">{{i}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="note in notes">
        <th>{{note.name}}</th>
        <td v-for="i in 6">{{(Math.round(note.frequency * i * 100) / 100).toFixed(2)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { Note } from 'tonal';

export default {
  name: 'FrequencyTable',
  data() {
    return {
      notes: new Array(88).fill().map((_, i) => ({
        name: Note.fromMidi(21 + i),
        frequency: Note.freq(21 + i)
      }))
    }
  }
};
</script>

<style>
  table {
    border-collapse: collapse;
  }
  table td {
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 10px;
    text-align: right;
  }
</style>
