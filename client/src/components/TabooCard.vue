<template>
  <div>
    <table class="table">
      <thead :class="{ 'bg-danger': role === 'c', 'bg-success': role === 't' }">
        <tr>
          <th scope="col" style="font-family: 'Secular One', sans-serif;">
            {{ tabooWord }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="taboo of tabooRules" :key="taboo">
          <td style="font-family: 'Secular One', sans-serif;">
            {{ taboo }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["tabooRules", "tabooWord", "role"],
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
</style>
