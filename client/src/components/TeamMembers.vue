<template>
  <div>
    <table class="table">
      <thead class="bg-secondary">
        <tr>
          <th scope="col" style="font-family: 'Secular One', sans-serif;">
            Takım {{ teamNumber }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member, index) of members" :key="Object.keys(member)[0]">
          <td
            :class="{
              'bg-success': checkIfMe(Object.keys(member)[0]),
              isTelling: isTelling(index),
            }"
            style="font-family: 'Secular One', sans-serif;"
          >
            {{ member[Object.keys(member)[0]] }}
            <span v-if="Object.keys(member)[0] === roomLeader">(admin)</span>
            <span v-if="isTelling(index)"> anlatiyor...</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["members", "teamNumber", "isMyTeamsTurn", "tellerTurn", "roomLeader"],
  inject: ["socket"],
  methods: {
    checkIfMe(key) {
      if (this.socket.id === key) {
        return true;
      }
      return false;
    },
    isTelling(myIndex) {
      return this.isMyTeamsTurn && this.tellerTurn === myIndex;
    },
  },
};
</script>

<style scoped>
.isTelling {
  font-weight: 950;
}
@import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
</style>
