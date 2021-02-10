<template>
  <div class="container" style="font-family: 'Secular One', sans-serif;">
    <div class="row">
      <div class="col">
        <div class="card text-center">
          <div class="card-header">
            Merhaba
          </div>
          <div class="card-body">
            <h5 class="card-title">Online Tabu</h5>
            <p class="card-text">
              Arkadaşlarınla online olarak tabu oynayabilirsin. Yeni oyun
              oluşturmak için aşağıdaki butona tıkla.
            </p>
            <button class="btn btn-info" @click="toLobby">Oyun Oluştur</button>
          </div>
          <div class="card-footer text-muted"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      toReset: false,
    };
  },
  inject: ["socket", "backFromGame"],
  beforeRouteEnter(_to, from, next) {
    next();
    if (from.name === "Lobby") {
      location.reload();
    }
  },
  methods: {
    toLobby() {
      //if (this.backFromGame.backFromLobby) {
      //this.backFromGame.backFromLobby = false;
      //location.reload();
      let soundToPlay = new Audio(require("../assets/create.mp3"));
      soundToPlay.play();
      this.socket.emit("create");
      this.$router.push(`/lobby/${this.socket.id}`);
      //} else {
      // this.socket.emit("login-lobby", this.$route.params.id);
      // }
    },
  },
};
</script>
