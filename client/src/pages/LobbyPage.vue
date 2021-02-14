<template>
  <div v-if="!isLoading">
    <div
      class="container"
      style="background-color:#FFFFFF; border-style: solid;
  border-color: coral; border-width: 20px"
    >
      <div class="row">
        <div class="col-4">
          <team-members
            :members="lobby.team1"
            :teamNumber="1"
            :teamTurn="null"
            :tellerTurn="null"
            :roomLeader="lobby.roomLeader"
          ></team-members>
        </div>
        <div class="col" style="margin: 0 50px">
          <div
            v-if="lobby.isGameOn"
            style="margin-bottom: 20px; font-family: 'Secular One', sans-serif; color: #5db427"
          >
            Oyun aktif!
          </div>
          <div
            style="margin-bottom: 20px; font-family: 'Secular One', sans-serif;"
          >
            Hazır Kullanıcılar: {{ readyMembers }}/{{ totalMembers }}
          </div>
          <form @submit.prevent="">
            <div class="form-group">
              <label
                for="exampleInputEmail1"
                style="font-family: 'Secular One', sans-serif;"
                >Kullanıcı Adı</label
              >
              <input
                type="text"
                class="form-control"
                v-model="userName"
                id="userNameInput"
                aria-describedby="userNameHelp"
                placeholder="Kullanıcı adı giriniz"
                style="font-family: 'Secular One', sans-serif;"
                :disabled="isReady"
              />
              <small
                id="emailHelp"
                class="form-text text-muted"
                style="font-family: 'Secular One', sans-serif;"
                >{{ userNameWarning }}</small
              >
            </div>
            <button
              @click="readyToggle"
              class="btn btn-primary"
              :class="{ active: !isReady, disabled: isReady }"
              :disabled="readyIsPressed"
              style="font-family: 'Secular One', sans-serif;"
            >
              Hazır
            </button>
          </form>
          <div>
            <button
              @click="changeTeam"
              class="btn btn-primary active"
              style="font-family: 'Secular One', sans-serif;"
              :disabled="afterTeamChangePress"
            >
              Takım değiş
            </button>
          </div>
          <div
            style="font-family: 'Secular One', sans-serif;"
            v-if="notEnoughPlayers"
          >
            {{ minUserWarning }}
          </div>
          <div class="row">
            <div class="col">
              <div
                class="form-group"
                style="font-family: 'Secular One', sans-serif;"
              >
                <label>Süre(saniye):</label>
                <input
                  type="number"
                  class="form-control"
                  style="text-align: center"
                  v-model="lobby.totalTimer"
                  v-on:change="changeTimerPassCount"
                  :disabled="socket.id !== lobby.roomLeader"
                />
              </div>
            </div>
            <div class="col">
              <div
                class="form-group"
                style="font-family: 'Secular One', sans-serif; "
              >
                <label>Pas Hakkı:</label>
                <input
                  type="number"
                  style="text-align: center"
                  class="form-control"
                  v-model="lobby.totalPassCount"
                  v-on:change="changeTimerPassCount"
                  :disabled="socket.id !== lobby.roomLeader"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button
                class="btn btn-info"
                style="width: 100%; font-family: 'Secular One', sans-serif;"
                @click="copyInvitation"
              >
                {{ invitationMessage }}
              </button>
            </div>
          </div>
        </div>
        <div class="col-4">
          <team-members
            :members="lobby.team2"
            :teamNumber="2"
            :teamTurn="null"
            :tellerTurn="null"
            :roomLeader="lobby.roomLeader"
          ></team-members>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  margin-bottom: 10px;
}
</style>

<script>
import TeamMembers from "../components/TeamMembers";
export default {
  components: {
    TeamMembers,
  },
  data() {
    return {
      lobby: null,
      isLoading: true,
      userName: "",
      currentTeam: null,
      isReady: false,
      userNameWarning: "Sana uyan kullanıcı adını seç",
      minUserWarning:
        "Oyuna başlamak için her takımda en az iki kişi olmalıdır",
      notEnoughPlayers: false,
      invitationMessage: "Arkadaşlarını Davet Et!",
      roomId: null,
      afterTeamChangePress: false,
      readyIsPressed: false,
    };
  },
  computed: {
    // roomId() {
    //   return this.$route.params.id;
    // },
    readyMembers() {
      return this.lobby.readyMemberCount;
    },
    totalMembers() {
      return this.lobby.memberCount;
    },
  },
  inject: ["socket", "backFromGame", "copy"],
  beforeRouteLeave(to, from, next) {
    if (to.name === "Root") {
      let dene = confirm("lobiden ayrilmak uzeresin");
      if (dene) {
        this.socket.emit(
          "delete-from-lobby",
          this.currentTeam,
          this.roomId,
          this.isReady
        );
        this.backFromGame.backFromLobby = true;
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
    // next(false);
  },
  created() {
    //this.socket.removeAllListeners();
    this.roomId = this.$route.params.id;
    // window.addEventListener("beforeunload", () => {
    //   this.socket.emit(
    //     "delete-from-lobby",
    //     this.currentTeam,
    //     this.roomId,
    //     this.isReady
    //   );
    // });
    this.socket.on("lobby", (lobby) => {
      this.lobby = lobby;
      this.isLoading = false;
      //getting current team
      let isTeam2 = true;
      this.lobby.team1.forEach((player) => {
        if (Object.keys(player)[0] === this.socket.id) {
          this.currentTeam = 1;
          //this.userName = player[this.socket.id];
          isTeam2 = false;
          //break;
        }
      });
      if (isTeam2) {
        this.currentTeam = 2;
        this.lobby.team2.forEach((player) => {
          if (Object.keys(player)[0] === this.socket.id) {
            //this.userName = player[this.socket.id];
            //break;
          }
        });
      }
    });
    this.socket.on("enough-players", () => {
      this.notEnoughPlayers = false;
    });
    this.socket.on("not-enough-players", () => {
      this.notEnoughPlayers = true;
    });
    this.socket.on("start-game", () => {
      if (!this.backFromGame.isBack) {
        console.log("listenerlari aldim");
        this.socket.emit("get-game-listeners", this.roomId);
      }
      //this.socket.emit("get-game-listeners", this.roomId);
      this.$router.push(`/game/${this.roomId}`);
    });

    this.socket.on("ready-reset", () => {
      this.isReady = false;
    });

    // this.socket.on("bad-url", () => {
    //   this.$router.push("/");
    // });

    //oyundan cikip lobiye donme
    if (this.backFromGame.isBack) {
      //this.backFromGame.isBack = false;
      console.log("bfg 1");
      this.socket.emit("login-lobby", this.$route.params.id);
    }
    // this.socket.on("name-taken", () => {
    //   this.userNameWarning = "Kullanıcı adı başkası tarafından alınmış";
    // });
    //linkten mi gelmis oda kuranin kendisi mi kontrolu
    else if (this.$route.params.id === this.socket.id) {
      console.log("creator 2 ");
      //return;
    } else {
      this.socket.on("connected", () => {
        console.log("login 3");
        this.socket.emit("login-lobby", this.$route.params.id);
      });
    }
    this.socket.on("play-sound-lobby", (action) => {
      let soundToPlay;
      switch (action) {
        case "ready-toggle":
          soundToPlay = new Audio(require("../assets/ready-toggle.mp3"));
          break;
        case "change-team":
          soundToPlay = new Audio(require("../assets/change-team.mp3"));
          break;
        case "ready-off":
          soundToPlay = new Audio(require("../assets/ready-off.mp3"));
          break;
        case "user-joined":
          soundToPlay = new Audio(require("../assets/user-joined.mp3"));
          break;
        case "user-logout":
          soundToPlay = new Audio(require("../assets/user-logout.mp3"));
          break;
      }
      soundToPlay.play();
    });
  },
  methods: {
    deneme() {
      this.socket.emit("print-rooms");
      this.socket.close();
    },
    // tryStartGame() {
    //   this.socket.emit("try-start-game", this.roomId);
    // },
    readyToggle() {
      //this.userName = this.$refs.username.value;
      if (this.userName.trim() === "") {
        this.userNameWarning = "Lütfen kullanıcı adı giriniz";
        return;
      }
      this.readyIsPressed = true;
      setTimeout(() => {
        this.readyIsPressed = false;
      }, 500);
      this.isReady = !this.isReady;
      if (this.isReady) {
        this.userNameWarning = "Oyuna başlamaya hazırsın";
        this.socket.emit(
          "user-ready",
          this.userName,
          this.roomId,
          this.currentTeam
        );
      } else {
        this.socket.emit("user-not-ready", this.roomId);
        this.userNameWarning = "Hazırlan";
      }
    },
    changeTeam() {
      this.afterTeamChangePress = true;
      setTimeout(() => {
        this.afterTeamChangePress = false;
      }, 500);
      this.socket.emit(
        "change-team",
        this.currentTeam,
        this.roomId,
        this.isReady
      );
      this.isReady = false;
      this.currentTeam = this.currentTeam === 1 ? 2 : 1;
    },
    changeTimerPassCount() {
      if (this.socket.id === this.lobby.roomLeader) {
        this.socket.emit(
          "timer-passcount-change",
          this.roomId,
          this.lobby.totalTimer,
          this.lobby.totalPassCount
        );
      }
    },
    copyInvitation() {
      this.copy(String(window.location.href));
      this.invitationMessage = "Link panoya kopyalandı";
      setTimeout(() => {
        this.invitationMessage = "Arkadaşlarını Davet Et!";
      }, 3000);
    },
  },
};
</script>
