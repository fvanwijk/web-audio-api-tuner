<template>
  <table>
    <thead>
      <tr><th v-for="note in notes">{{note}}</th></tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="note in notes">{{note}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'FrequencyTable',
  data() {
    return {
      notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    }
  }
};
</script>
